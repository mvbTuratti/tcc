defmodule Backend.Pix.PixGenerator do
  @moduledoc """
  Handles the generation of Brazilian PIX QR code strings, EMV® MPM and BR Code standards.
  """

  @id_payload_format_indicator "00"
  @id_point_of_initiation_method "01"
  @id_merchant_account_information "26"
  @id_merchant_category_code "52"
  @id_transaction_currency "53"
  @id_transaction_amount "54"
  @id_country_code "58"
  @id_merchant_name "59"
  @id_merchant_city "60"
  @id_additional_data_field_template "62"
  # @id_crc16 "63"

  @sub_id_gui "00"
  @sub_id_pix_key "01"
  @sub_id_reference_label "05" # txid

  @val_payload_format_indicator "01"
  @val_point_of_initiation_static "11"
  @val_gui "BR.GOV.BCB.PIX"
  @val_merchant_category_code "0000"
  @val_transaction_currency "986" # BRL
  @val_country_code "BR"
  @val_default_txid "***"
  @val_crc_id_and_length "6304"

  @type params :: %{
          required(:merchant_name) => String.t(),
          required(:merchant_city) => String.t(),
          required(:pix_key) => String.t(),
          optional(:transaction_amount) => float() | nil
        }

  @doc """
  ## Parameters
    - `params`: A map of required values for PIX.
      - `:merchant_name` (string, required): The user name (max 25 chars).
      - `:merchant_city` (string, required): The user city (max 15 chars) -  listed as optional, but mandatory for some PSP...
      - `:pix_key` (string, required): The valid PIX key (e.g., CPF, CNPJ, ...).
      - `:transaction_amount` (float, optional): The transaction amount. If nil, the payer can define the amount.
  ## Returns
    - `{:ok, pix_string}` on success.
    - `{:error, reason}` on failure, where `reason` can be a validation error or a generation error.
  """
  @spec generate(params) :: {:ok, String.t()} | {:error, any()}
  def generate(params) do
    with {:ok, valid_params} <- validate_inputs(params) do
      do_generate(valid_params)
    end
  end

  defp do_generate(params) do
    try do
      parts =
        [
          build_tlv(@id_payload_format_indicator, @val_payload_format_indicator),
          build_tlv(@id_point_of_initiation_method, @val_point_of_initiation_static),
          merchant_account_information(params.pix_key),
          build_tlv(@id_merchant_category_code, @val_merchant_category_code),
          build_tlv(@id_transaction_currency, @val_transaction_currency),
          build_transaction_amount(params.transaction_amount),
          build_tlv(@id_country_code, @val_country_code),
          build_tlv(@id_merchant_name, params.merchant_name),
          build_tlv(@id_merchant_city, params.merchant_city),
          additional_data_field("L2LEnsino")
        ]
      |> Enum.reject(&is_nil/1)

      base_payload = Enum.join(parts)
      payload_for_crc = base_payload <> @val_crc_id_and_length
      crc_value = calculate_crc16(payload_for_crc)
      final_pix_string = payload_for_crc <> crc_value
      {:ok, final_pix_string}
    rescue
      e ->
        IO.inspect(e, label: "ERROR WHEN GENERATING PIX!")
        {:error, {:generation_failed, inspect(e)}}
    end
  end

  defp build_tlv(id, value) do
    length =
      value
      |> String.length()
      |> Integer.to_string()
      |> String.pad_leading(2, "0")
    id <> length <> value
  end

  defp merchant_account_information(key) do
    gui_tlv = build_tlv(@sub_id_gui, @val_gui)
    pix_key_tlv = build_tlv(@sub_id_pix_key, key)
    payload = gui_tlv <> pix_key_tlv
    build_tlv(@id_merchant_account_information, payload)
  end

  defp additional_data_field(txid) do
    txid_to_use = if is_nil(txid) or txid == "", do: @val_default_txid, else: txid
    ref_label_tlv = build_tlv(@sub_id_reference_label, txid_to_use)
    build_tlv(@id_additional_data_field_template, ref_label_tlv)
  end

  defp build_transaction_amount(nil), do: nil
  defp build_transaction_amount(amount) when is_float(amount) do
    formatted_amount = :erlang.float_to_binary(amount, decimals: 2)
    build_tlv(@id_transaction_amount, formatted_amount)
  end

  defp calculate_crc16(data_string) do
    # # These parameters define the CRC-16/CCITT-FALSE algorithm required by the PIX standard.
    # crc_model = %{
    #   width: 16,
    #   poly: 0x1021,
    #   init: 0xFFFF,
    #   refin: false,
    #   refout: false,
    #   xorout: 0x0000
    # }

    # crc_value_int = CRC.crc(crc_model, data_string)

    Backend.Utils.CRC16.ccitt_false(data_string)
    |> Integer.to_string(16)
    |> String.upcase()
    |> String.pad_leading(4, "0")
  end

  defp validate_inputs(params) do
    with :ok <- validate_merchant_name(params[:merchant_name]),
         :ok <- validate_merchant_city(params[:merchant_city]) do
      required_keys = [:merchant_name, :merchant_city, :pix_key]
      missing_keys = Enum.filter(required_keys, &(!Map.has_key?(params, &1)))
      if Enum.empty?(missing_keys) do
        {:ok, params}
      else
        {:error, {:validation, :missing_keys, missing_keys}}
      end
    else
      {:error, error} -> {:error, error}
    end
  end

  defp validate_merchant_name(name) when is_binary(name) do
    if String.length(name) <= 25,
      do: :ok,
      else: {:error, {:validation, :merchant_name, "Exceeds 25 characters"}}
  end
  defp validate_merchant_name(_), do: :ok

  defp validate_merchant_city(city) when is_binary(city) do
    if String.length(city) <= 15,
      do: :ok,
      else: {:error, {:validation, :merchant_city, "Exceeds 15 characters"}}
  end
  defp validate_merchant_city(_), do: :ok

  # defp validate_txid(txid) when is_binary(txid) do
  #   cond do
  #     String.length(txid) > 25 ->
  #       {:error, {:validation, :txid, "Exceeds 25 characters"}}
  #    !String.match?(txid, ~r/^[a-zA-Z0-9]*$/) ->
  #       {:error, {:validation, :txid, "Contains invalid characters (must be alphanumeric)"}}
  #     true ->
  #       :ok
  #   end
  # end
  # defp validate_txid(nil), do: :ok
end
