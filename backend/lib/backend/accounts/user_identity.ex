defmodule Backend.Accounts.UserIdentity do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAuthentication.UserIdentity],
    authorizers: [Ash.Policy.Authorizer],
    domain: Backend.Accounts

  user_identity do
    user_resource Backend.Accounts.User
  end

  postgres do
    table "user_identities"
    repo Backend.Repo
  end
  identities do
    identity :unique_identity, [:uid, :strategy]
  end

  actions do
    create :create_from_oauth do
      argument :uid, :string, allow_nil?: false
      argument :strategy, :string, allow_nil?: false
      argument :access_token, :string
      argument :refresh_token, :string
      argument :access_token_expires_at, :utc_datetime
      argument :user, :map, allow_nil?: false

      upsert? true
      upsert_identity :unique_identity

      change fn changeset, _ ->
        user = Ash.Changeset.get_argument(changeset, :user)

        Ash.Changeset.change_attributes(changeset, %{
          uid: Ash.Changeset.get_argument(changeset, :uid),
          strategy: Ash.Changeset.get_argument(changeset, :strategy),
          access_token: Ash.Changeset.get_argument(changeset, :access_token),
          refresh_token: Ash.Changeset.get_argument(changeset, :refresh_token),
          access_token_expires_at: Ash.Changeset.get_argument(changeset, :access_token_expires_at),
          user_id: user.id
        })
      end
    end
  end

  policies do
    bypass AshAuthentication.Checks.AshAuthenticationInteraction do
      authorize_if always()
    end
    policy action(:create_from_oauth) do
      authorize_if always()
    end
  end
end
