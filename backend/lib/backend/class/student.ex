defmodule Backend.Class.Student do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource]

  postgres do
    table "students"
    repo Backend.Repo
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
    uuid_primary_key :id
    attribute :email, :string, allow_nil?: false

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    has_many :enrollments, Backend.Class.Enrollment
    belongs_to :user, Backend.Accounts.User do
      attribute_writable? true
      allow_nil? true
    end
  end

end
