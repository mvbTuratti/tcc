defmodule Backend.Class.Student do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]
  require Ash.Query

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
    defaults [:destroy]
    create :create do
      primary?(true)
      upsert? true
      upsert_identity :unique_email
      accept [:email]
      change fn changeset, _context ->
        student_email = Ash.Changeset.get_attribute(changeset, :email)
        case Backend.Accounts.User
             |> Ash.Query.filter(expr(email == ^student_email))
             |> Ash.read_one() do
          {:ok, user} when not is_nil(user) ->
            Ash.Changeset.change_attribute(changeset, :user_id, user.id)
          _ ->
            changeset
        end
      end
    end
    update :update do
      accept [:email]
    end
    read :read do
      primary?(true)
      prepare build(sort: {:inserted_at, :desc})
      pagination keyset?: true, offset?: true, required?: false, countable: true
    end
    update :claim_for_user do
      primary?(true)
      accept [:user_id]
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
      change optimistic_lock(:version), on: [:destroy, :update]
    end
  end
  identities do
    identity :unique_email, [:email]
  end

  relationships do
    has_many :enrollments, Backend.Class.Enrollment
    belongs_to :user, Backend.Accounts.User do
      attribute_writable? true
      allow_nil? true
      public? true
    end
  end
  policies do
    policy action(:update) do
      authorize_if expr(exists(enrollment, exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))))
    end
    policy action(:claim_for_user) do
      authorize_if always()
    end
    policy action_type(:destroy) do
      authorize_if expr(exists(enrollment, exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))))
    end
    policy action_type(:create) do
      # authorize_if expr(exists(enrollment, exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))))
      authorize_if always()
    end
    policy action_type(:read) do
      authorize_if expr(
        exists(user_id == ^actor(:id)) or
        exists(enrollment, exists(classroom, exists(classroom_owners, user_id == ^actor(:id))))
      )
      # authorize_if always()
    end
  end

end
