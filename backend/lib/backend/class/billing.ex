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

  json_api do
    type "billing"
  end

  actions do
    defaults [:destroy]
    read :by_id do
      argument :id, :uuid, allow_nil?: false
      get? true
      filter expr(id == ^arg(:id))
    end

    create :create do
      accept [:price, :method, :city, :method, :city, :name]
    end

    update :update do
      accept [:price, :method, :city, :method, :city, :name]
    end
    changes do
      change optimistic_lock(:version), on: [:create, :destroy,:update]
    end
  end

  attributes do
    uuid_primary_key :id do
      public? true
    end
    attribute :version, :integer, allow_nil?: false, default: 1
    attribute :price, :string do
      allow_nil? false
      constraints max_length: 9,
              allow_empty?: false
      public? true
    end
    attribute :method, Backend.Types.PixType, allow_nil?: false, public?: true
    attribute :city, :string, allow_nil?: false, public?: true
    attribute :name, :string, allow_nil?: false, public?: true
    attribute :qr_code, :string, allow_nil?: true, public?: true

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom
  end

  policies do
    policy action_type(:update) do
      authorize_if expr(exists(classroom, exists(classroom_owners, user_id == ^actor(:id))))
    end
    policy action_type(:destroy) do
      authorize_if expr(exists(classroom, exists(classroom_owners, user_id == ^actor(:id))))
    end
    policy action_type(:create) do
      authorize_if expr(exists(classroom, exists(classroom_owners, user_id == ^actor(:id))))
    end
    policy action_type(:read) do
      authorize_if expr(
        exists(classroom, exists(enrollments, exists(student, user_id == ^actor(:id)))) or
        exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
        )
    end
  end
end
