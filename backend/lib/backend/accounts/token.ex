defmodule Backend.Accounts.Token do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAuthentication.TokenResource],
    # If using policies, enable the policy authorizer:
    authorizers: [Ash.Policy.Authorizer],
    domain: Backend.Accounts

  postgres do
    table "tokens"
    repo Backend.Repo
  end

  policies do
    bypass AshAuthentication.Checks.AshAuthenticationInteraction do
      authorize_if always()
    end
  end
end
