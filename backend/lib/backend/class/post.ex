defmodule Backend.Class.Post do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource]

  postgres do
    table "posts"
    repo Backend.Repo

    references do
      reference :classroom, on_delete: :delete
      reference :author, on_delete: :delete
    end
  end

  json_api do
    type "post"
  end

  actions do
    defaults [:read, :destroy]
    create :create do
      accept [:content, :classroom_id, :author_id]
    end

    update :update do
      accept [:content]
    end
  end

  attributes do
    uuid_primary_key :id
    attribute :content, :string, allow_nil?: false

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom
    belongs_to :author, Backend.Accounts.User
  end
end
