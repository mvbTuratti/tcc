defmodule Backend.Pix.PixGenerator do
  @moduledoc """
  Handles the generation of Brazilian PIX QR code strings.
  """

  @id_payload_format_indicator "000201"
  @id_merchan_account_size "0014br.gov.bcb.pix01"
  @id_merchant_account_information "26"
  @id_merchant_category_code "52040000"
  @id_transaction_currency "5303986"
  @id_transaction_amount "54"
  # @id_country_code "58"
  @id_merchant_name "59"
  # @id_merchant_city "60"
  @id_additional_data_field_template "62"
  @id_additional_data_field "05"
  @country_code "5802BR"
  @id_crc16 "6304"

  defp append_size_to_value(value, should_add_0_for_less_than_10?) do
    lead = String.length(value) |> Integer.to_string()
    case should_add_0_for_less_than_10? do
      true ->
        String.pad_leading(lead, 2, "0") <> value
      false ->
        lead <> value
    end
  end
  defp transaction_amount(value), do: @id_transaction_amount <> append_size_to_value(value, true)
  defp merchant_account_size(key), do: @id_merchan_account_size <> append_size_to_value(key, false)
  defp merchant_account(key), do: @id_merchant_account_information <> append_size_to_value(merchant_account_size(key), false)
  defp merchant_name(name), do: @id_merchant_name <> append_size_to_value(name, false)
  # defp merchant_city(city), do: @id_merchant_city <> append_size_to_value(city, false)
  defp additional_data_field_size(txt_id), do: @id_additional_data_field <> append_size_to_value(txt_id, true)
  defp additional_data_field(txt_id), do: @id_additional_data_field_template <> append_size_to_value(additional_data_field_size(txt_id),false)

  def create_payload(name, key, value, txt_id) do
    @id_payload_format_indicator <> merchant_account(key) <> @id_merchant_category_code <> @id_transaction_currency <> transaction_amount(value)
    <> @country_code <> merchant_name(name) <> additional_data_field(txt_id) <> @id_crc16
  end


  defp calculate_crc16(data_string) do
    binary_data = if is_binary(data_string), do: data_string, else: to_string(data_string)
    crc_model = %{
      width: 16,
      poly: 0x1021,
      init: 0xFFFF,
      refin: false,
      refout: false,
      xorout: 0x0000
    }
    CRC.crc(crc_model, binary_data)
  end
  def generate_pix_string(name, key, value, txt_id) do
    try do
      payload = create_payload(name, key, value, txt_id)
      crc_value_int = calculate_crc16(payload)
      crc_string =
         crc_value_int
          |> Integer.to_string(16)
          |> String.trim_leading("0x")
          |> String.upcase()
      final_pix_string = payload <> crc_string
      {:ok, final_pix_string}
    rescue
      e ->
        IO.inspect(e, label: "ERROR WHEN GENERATING PIX!")
        {:error, "PIX generation failed"}
    end
  end
end
