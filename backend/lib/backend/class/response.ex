defmodule Backend.Class.Response do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]

  postgres do
    table "responses"
    repo Backend.Repo

    references do
      reference :post, on_delete: :delete
      reference :author, on_delete: :delete
    end
  end

  json_api do
    type "response"
  end

  actions do
    defaults [:read, :destroy]
    create :create do
      accept [:content, :post_id, :author_id]
    end

    update :update do
      accept [:content]
    end
    changes do
      change optimistic_lock(:version), on: [:create, :destroy, :update]
    end
  end

  attributes do
    uuid_primary_key :id do
      public? true
    end
    attribute :content, :string do
      allow_nil? false

      constraints max_length: 10000,
              allow_empty?: false
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :author, Backend.Accounts.User
    belongs_to :post, Backend.Class.Post
  end
end
