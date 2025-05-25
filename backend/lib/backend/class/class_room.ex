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
    defaults [:read, :destroy]

    create :create do
      primary? true
      accept [:name, :description]
      change after_action(fn changeset, result, ctx ->
        IO.inspect(ctx, label: "ctx")
        IO.inspect(changeset, label: "changeset")
        actor = ctx.actor
        IO.inspect(actor, label: "Here in create after action")
        if actor do
          {:ok, _} =
            Backend.Class.ClassRoomOwner
            |> Ash.Changeset.for_create(:create, %{
              classroom_id: result.id,
              user_id: actor.id
            })
            |> Ash.create()

          {:ok, result}
        else
          {:error, "Actor not found"}
        end
      end)

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

      constraints max_length: 256,
                  allow_empty?: false

      public? true
    end

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
    policy always() do
      # authorize_if expr(actor != nil)
      authorize_if always()
    end
  end

  relationships do
    has_many :enrollments, Backend.Class.Enrollment do
      destination_attribute :classroom_id
    end
    has_many :classroom_owners, Backend.Class.ClassRoomOwner do
      destination_attribute :classroom_id
    end
  end
end
