defmodule Backend.Class.ClassRoomOwner do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource]
    # authorizers: [
    #   Ash.Policy.Authorizer
    # ]

  postgres do
    table "classroom_owners"
    repo Backend.Repo
    references do
      reference :classroom, on_delete: :delete
      reference :user, on_delete: :delete
    end
  end

  attributes do
    uuid_primary_key :id do
      public? true
    end
    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom do
      attribute_writable? true
      public? true
    end

    belongs_to :user, Backend.Accounts.User do
      attribute_writable? true
      public? true
    end
  end

  actions do
    defaults [:read, :update, :destroy]
    create :create do
      accept [:user_id, :classroom_id]
    end
  end
end
