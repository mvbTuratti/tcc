defmodule Backend.Secrets do
  use AshAuthentication.Secret
  # Handles fetching the client_id for the Google strategy.
  def secret_for([:authentication, :strategies, :google, :client_id], Backend.Accounts.User, _opts) do
    Application.fetch_env(:backend, :google_client_id)
  end

  # Handles fetching the client_secret for the Google strategy.
  def secret_for([:authentication, :strategies, :google, :client_secret], Backend.Accounts.User, _opts) do
    Application.fetch_env(:backend, :google_client_secret)
  end

  # Handles fetching the redirect_uri for the Google strategy.
  def secret_for([:authentication, :strategies, :google, :redirect_uri], Backend.Accounts.User, _opts) do
    Application.fetch_env(:backend, :google_redirect_uri)
  end

  # You may add fallback clauses if necessary.
  def secret_for(key, _resource, _opts) do
    raise "No secret defined for key #{inspect(key)}"
  end
end
