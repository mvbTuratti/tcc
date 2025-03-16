defmodule Backend.Class.ClassRoom do
  use Ash.Resource,
      domain: Backend.Class,
      data_layer: AshPostgres.DataLayer,
      extensions: [AshJsonApi.Resource]

  json_api do
    type "classroom"
  end

  postgres do
    table "classrooms"
    repo Backend.Repo
  end


  actions do
    defaults [:read, :destroy]
    create :create do
      primary? true
      accept [:name, :description]
    end
    update :update do
      accept [:name, :description]
    end
    read :by_id do
      argument :id, :uuid, allow_nil?: false
      get? true
      filter expr(id == ^arg(:id))
    end
    changes do
      change optimistic_lock(:version), on: [:create, :destroy, :update]
    end
  end

  attributes do
    uuid_primary_key :id
    attribute :version, :integer, allow_nil?: false, default: 1

    attribute :name, :string do
      allow_nil? false
      constraints [
        max_length: 256,
        allow_empty?: false
      ]
      public? true
    end
    attribute :description, :string do
      allow_nil? true
      constraints [
        max_length: 1000,
        allow_empty?: true
      ]
      public? true
    end
    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

end
