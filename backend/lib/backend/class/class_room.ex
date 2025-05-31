defmodule Backend.Class.ClassRoom do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]

  postgres do
    table "classrooms"
    repo Backend.Repo

  end

  json_api do
    type "classroom"
  end

  actions do
    defaults [:destroy]

    read :read do
      primary?(true)
      prepare build(sort: {:inserted_at, :desc})
      pagination keyset?: true, offset?: true, required?: false, countable: true
    end

    read :list_owned do
      prepare build(sort: {:inserted_at, :desc})
      pagination keyset?: true, offset?: true, required?: false, countable: true
    end

    read :list_enrolled do
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
      primary? true
      accept [:name, :description, :is_external]
      change fn changeset, context ->
        if actor = context.actor do
          owner_data = %{user_id: actor.id}
          Ash.Changeset.manage_relationship(changeset, :classroom_owners, [owner_data], type: :create)
        else
          Ash.Changeset.add_error(changeset, field: :actor, message: "must be present")
        end
      end
    end
    # create :create do
    #   primary? true
    #   accept [:name, :description, :is_external]
    #   change after_action(fn changeset, result, ctx ->
    #     actor = ctx.actor
    #     if actor do
    #       {:ok, _} =
    #         Backend.Class.ClassRoomOwner
    #         |> Ash.Changeset.for_create(:create, %{
    #           classroom_id: result.id,
    #           user_id: actor.id
    #         })
    #         |> Ash.create()

    #       {:ok, result}
    #     else
    #       {:error, "Actor not found"}
    #     end
    #   end)
    # end

    update :update do
      accept [:name, :description]
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

      constraints max_length: 256,
                  allow_empty?: false

      public? true
    end
    attribute :is_external, :boolean, default: true, public?: true, allow_nil?: true

    attribute :description, :string do
      allow_nil? true

      constraints max_length: 1000,
                  allow_empty?: true

      public? true
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  policies do

    policy action(:read) do
      authorize_if expr(
        exists(classroom_owners, user_id == ^actor(:id)) or
        exists(enrollments, exists(student, user_id == ^actor(:id)))
      )
    end
    policy action(:by_id) do
      authorize_if expr(
        exists(classroom_owners, user_id == ^actor(:id)) or
        exists(enrollments, exists(student, user_id == ^actor(:id)))
      )
    end
    policy action(:keyset) do
      authorize_if expr(
        exists(classroom_owners, user_id == ^actor(:id)) or
        exists(enrollments, exists(student, user_id == ^actor(:id)))
      )
    end

    policy action(:list_owned) do
      authorize_if expr(
        exists(classroom_owners, user_id == ^actor(:id)))
    end

    policy action(:list_enrolled) do
      authorize_if expr(exists(enrollments, exists(student, user_id == ^actor(:id))))
    end

    policy action_type(:create) do
      authorize_if always()
    end

    # Example: Only owners can update or delete
    policy action_type(:update) do
      authorize_if expr(exists(classroom_owners, user_id == ^actor(:id)))
    end

    policy action_type(:destroy) do
      authorize_if expr(exists(classroom_owners, user_id == ^actor(:id)))
    end

  end

  relationships do
    has_many :enrollments, Backend.Class.Enrollment do
      destination_attribute :classroom_id
      public? true
    end
    has_many :classroom_owners, Backend.Class.ClassRoomOwner do
      destination_attribute :classroom_id
      public? true
    end
    has_one :billing, Backend.Class.Billing do
      destination_attribute :classroom_id
      public? true
    end
  end
end
