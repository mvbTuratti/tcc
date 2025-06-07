defmodule Backend.Class.Post do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]

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

  includes [:author]
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

    read :keyset do
      prepare(build(sort: {:inserted_at, :desc}))
      pagination(keyset?: true)
    end

    create :create do
      accept [:content, :classroom_id]
      change relate_actor(:author)
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
    attribute :version, :integer, allow_nil?: false, default: 1
    attribute :content, :string do
      allow_nil? false
      constraints max_length: 10000,
              allow_empty?: false
      public? true
    end

    create_timestamp :inserted_at, public?: true
    update_timestamp :updated_at, public?: true
  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom
    belongs_to :author, Backend.Accounts.User, public?: true
    has_many :responses, Backend.Class.Response, destination_attribute: :post_id, public?: true
  end

  policies do
    policy action_type(:update) do
      authorize_if expr(author_id == ^actor(:id))
    end
    policy action_type(:destroy) do
      authorize_if expr(author_id == ^actor(:id) or exists(classroom, exists(classroom_owners, user_id == ^actor(:id))))
    end
    policy action_type(:create) do
      authorize_if Backend.Class.Checks.IsEnrolledOrOwner
    end
    policy action_type(:read) do
      authorize_if expr(
        exists(classroom, exists(enrollments, exists(student, user_id == ^actor(:id)))) or
        exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
        )
    end
  end
end
