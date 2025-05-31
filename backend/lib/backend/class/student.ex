defmodule Backend.Class.Student do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]

  postgres do
    table "students"
    repo Backend.Repo
    references do
      reference :user, on_delete: :delete
    end
  end

  json_api do
    type "student"
  end

  actions do
    defaults [:read, :update, :destroy]
    create :create do
      accept [:email]
    end
  end

  attributes do
    uuid_primary_key :id do
      public? true
    end
    attribute :version, :integer, allow_nil?: false, default: 1
    attribute :email, :ci_string do
      allow_nil? false
      public? true
      constraints max_length: 256,
                allow_empty?: false
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
    changes do
      change optimistic_lock(:version), on: [:create, :destroy, :update]
    end
  end

  relationships do
    has_many :enrollments, Backend.Class.Enrollment
    belongs_to :user, Backend.Accounts.User do
      attribute_writable? true
      allow_nil? true
      public? true
    end
  end

end
