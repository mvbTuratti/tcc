defmodule Backend.Class.ClassRoomOwner do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer

  postgres do
    table "classroom_owners"
    repo Backend.Repo
  end

  attributes do
    uuid_primary_key :id
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
