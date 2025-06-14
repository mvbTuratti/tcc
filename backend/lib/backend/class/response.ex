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
    includes :author
  end

  actions do
    defaults [:read, :destroy]
    create :create do
      accept [:content, :post_id]
      change relate_actor(:author)
    end

    update :update do
      accept [:content]
    end
    changes do
      change optimistic_lock(:version), on: [:destroy, :update]
    end
  end

  attributes do
    uuid_primary_key :id do
      public? true
    end
    attribute :version, :integer, allow_nil?: false, default: 1
    attribute :content, :string do
      allow_nil? false
      public? true
      constraints max_length: 500,
              allow_empty?: false
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at, public?: true
  end

  relationships do
    belongs_to :author, Backend.Accounts.User, public?: true
    belongs_to :post, Backend.Class.Post
  end
  policies do
    # policy action_type(:update) do
    #   authorize_if expr(author_id == ^actor(:id))
    # end
    # policy action_type(:destroy) do
    #   authorize_if expr(author_id == ^actor(:id) or exists(classroom, exists(classroom_owners, user_id == ^actor(:id))))
    # end
    # policy action_type(:create) do
    #   authorize_if Backend.Class.Checks.IsEnrolledOrOwner
    # end
    # policy action_type(:read) do
    #   authorize_if expr(
    #     exists(classroom, exists(enrollments, exists(student, user_id == ^actor(:id)))) or
    #     exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
    #     )
    # end
    policy always() do
      authorize_if always()
    end
  end
end
