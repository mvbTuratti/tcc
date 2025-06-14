defmodule Backend.Class.Billing do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]

  postgres do
    table "billings"
    repo Backend.Repo

    references do
      reference :classroom, on_delete: :delete
    end
  end
  identities do
    identity :one_by_classroom, [:classroom_id]
  end

  json_api do
    type "billing"
  end

  actions do
    defaults [:destroy]
    read :read do
      primary?(true)
      prepare build(sort: {:inserted_at, :desc})
      pagination keyset?: true, offset?: true, required?: false, countable: true
    end
    read :by_id do
      argument :id, :uuid, allow_nil?: false
      get? true
      filter expr(id == ^arg(:id))
    end

    create :create do
      accept [:transaction_amount, :pix_key, :name, :city, :classroom_id]

      change fn changeset, _context ->
        params = %{
          merchant_name: Ash.Changeset.get_attribute(changeset, :name),
          merchant_city: Ash.Changeset.get_attribute(changeset, :city),
          pix_key: Ash.Changeset.get_attribute(changeset, :pix_key),
          transaction_amount: Ash.Changeset.get_attribute(changeset, :transaction_amount)
        }
        case Backend.Pix.PixGenerator.generate(params) do
          {:ok, pix_string} ->
            Ash.Changeset.force_change_attribute(changeset, :qr_code, pix_string)
          {:error, reason} ->
            Ash.Changeset.add_error(changeset,
              field: :qr_code,
              message: "Failed to generate PIX QR Code: #{reason}"
            )
        end
      end
    end

    update :update do
      accept [:transaction_amount, :pix_key, :name, :city]
      require_atomic? false
      change fn changeset, _context ->
        params = %{
          merchant_name: Ash.Changeset.get_attribute(changeset, :name),
          merchant_city: Ash.Changeset.get_attribute(changeset, :city),
          pix_key: Ash.Changeset.get_attribute(changeset, :pix_key),
          transaction_amount: Ash.Changeset.get_attribute(changeset, :transaction_amount)
        }
        case Backend.Pix.PixGenerator.generate(params) do
          {:ok, pix_string} ->
            Ash.Changeset.force_change_attribute(changeset, :qr_code, pix_string)
          {:error, reason} ->
            Ash.Changeset.add_error(changeset,
              field: :qr_code,
              message: "Failed to generate PIX QR Code: #{reason}"
            )
        end
      end
    end
    changes do
      change optimistic_lock(:version), on: [:destroy,:update]
    end
  end


  attributes do
    uuid_primary_key :id do
      public? true
    end
    attribute :version, :integer, allow_nil?: false, default: 1
    attribute :transaction_amount, :float, allow_nil?: true, public?: true
    attribute :pix_key, :string, allow_nil?: false, public?: true
    attribute :name, :string, allow_nil?: false, public?: true
    attribute :city, :string, allow_nil?: false, public?: true
    attribute :qr_code, :string, allow_nil?: true, public?: true

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom, public?: true
  end

  policies do
    policy action_type(:update) do
      authorize_if expr(exists(classroom, exists(classroom_owners, user_id == ^actor(:id))))
    end
    policy action_type(:destroy) do
      authorize_if expr(exists(classroom, exists(classroom_owners, user_id == ^actor(:id))))
    end
    policy action_type(:create) do
      authorize_if Backend.Class.Checks.IsOwner
    end
    policy action_type(:read) do
      authorize_if expr(
        exists(classroom, exists(enrollments, exists(student, user_id == ^actor(:id)))) or
        exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
        )
    end
  end
  field_policies do
    field_policy [:transaction_amount, :pix_key, :name, :city] do
      authorize_if expr(
          exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
      )
    end
    field_policy :* do
      authorize_if always()
    end
  end
end
