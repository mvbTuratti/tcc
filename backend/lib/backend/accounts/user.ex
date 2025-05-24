defmodule Backend.Accounts.User do
  require Ash.Resource.Change.Builtins
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAuthentication],
    authorizers: [Ash.Policy.Authorizer],
    domain: Backend.Accounts

  postgres do
    table "users"
    repo Backend.Repo
  end

  attributes do
    uuid_primary_key :id
    attribute :email, :ci_string, allow_nil?: false
    attribute :name, :string, allow_nil?: false
    attribute :picture, :string, allow_nil?: true
  end
  identities do
    identity :unique_email, [:email]
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
    end
    strategies do
      google do
        client_id Backend.Secrets
        redirect_uri Backend.Secrets
        client_secret Backend.Secrets
        authorization_params [scope: "email profile https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/calendar.freebusy"]
        # authorization_params [scope: "https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/calendar.freebusy"]
      end
    end
  end
  actions do
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
    end
  end

  # You can customize this if you wish, but this is a safe default that
  # only allows user data to be interacted with via AshAuthentication.
  policies do
    bypass AshAuthentication.Checks.AshAuthenticationInteraction do
      authorize_if always()
    end

    policy always() do
      forbid_if always()
    end
  end

end
