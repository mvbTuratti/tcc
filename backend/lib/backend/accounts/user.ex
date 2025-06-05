defmodule Backend.Accounts.User do
  require Ash.Resource.Change.Builtins
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAuthentication, AshJsonApi.Resource],
    authorizers: [Ash.Policy.Authorizer],
    domain: Backend.Accounts
  require Ash.Query

  json_api do
    type "user"
  end

  postgres do
    table "users"
    repo Backend.Repo
  end

  attributes do
    uuid_primary_key :id do
      public? true
    end
    attribute :email, :ci_string do
      allow_nil? false
      public? true
      constraints max_length: 256,
        allow_empty?: false
    end
    attribute :name, :string, allow_nil?: false, public?: true
    attribute :picture, :string, allow_nil?: true, public?: true
  end
  identities do
    identity :unique_email, [:email]
    identity :id_identity, [:id]
  end

  authentication do
    tokens do
      enabled? true
      token_resource Backend.Accounts.Token
      store_all_tokens? true
      require_token_presence_for_authentication? true
      signing_secret fn _, _ ->
        {:ok, Application.fetch_env!(:backend, :token_signing_secret)}
      end
      # subject_name :id
    end
    strategies do
      google do
        client_id Backend.Secrets
        redirect_uri Backend.Secrets
        client_secret Backend.Secrets
        authorization_params [scope: "email profile"]
        # authorization_params [scope: "email profile https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/calendar.freebusy"]
        # authorization_params [scope: "https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/calendar.freebusy"]
      end
    end
  end

  actions do
    defaults [:read]
    read :reads do
      argument :id, :string
    end
    create :register_with_google do
      argument :user_info, :map, allow_nil?: false
      argument :oauth_tokens, :map, allow_nil?: false
      upsert? true
      upsert_identity :unique_email

      change AshAuthentication.GenerateTokenChange

      # # Required if you have the `identity_resource` configuration enabled. <- not working, changed to manual
      # change AshAuthentication.Strategy.OAuth2.IdentityChange
      change after_action(&Backend.Accounts.UserChanges.create_identity_after_action/3)

      change fn changeset, _ ->
        user_info = Ash.Changeset.get_argument(changeset, :user_info)
        changeset = Ash.Changeset.change_attributes(changeset, Map.take(user_info, ["email", "name", "picture"]))
        IO.inspect(changeset, label: "CHG FINAL")
        changeset
      end
      change after_action(fn _changeset, user, context ->
        case Backend.Class.Student
             |> Ash.Query.filter(expr(email == ^user.email and is_nil(user_id)))
             |> Ash.read_one(actor: user, tenant: context.tenant) do

          {:ok, student} when not is_nil(student) ->
            Ash.update(student, %{user_id: user.id}, actor: user, tenant: context.tenant)
          _ ->
            :ok
        end
        {:ok, user}
      end)
    end

    read :by_id do
      argument :id, :uuid, allow_nil?: false
      filter expr(id == ^arg(:id))
    end

    read :me do
      get? true
      filter expr(id == ^actor(:id))
    end
  end

  # You can customize this if you wish, but this is a safe default that
  # only allows user data to be interacted with via AshAuthentication.
  policies do
    bypass AshAuthentication.Checks.AshAuthenticationInteraction do
      authorize_if always()
    end

    policy always() do
      authorize_if always()
    end
  end

  relationships do
    has_many :posts, Backend.Class.Post, destination_attribute: :author_id
    has_many :responses, Backend.Class.Response, destination_attribute: :author_id
    has_many :classroom_owners, Backend.Class.ClassRoomOwner
    has_many :student, Backend.Class.Student, destination_attribute: :user_id
  end

end
