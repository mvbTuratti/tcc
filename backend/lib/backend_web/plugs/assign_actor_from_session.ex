defmodule BackendWeb.Plugs.AssignActorFromSession do
  import Plug.Conn
  require Ash.Query
  require Logger

  def init(opts), do: opts

  def call(conn, _opts) do
    with {:ok, token} <- fetch_user_token(conn),
         {:ok, claims, _resource_module} <- AshAuthentication.Jwt.verify(token, Backend.Accounts.User),
          "user?id=" <> id <- claims["sub"] do
          case Ash.get(Backend.Accounts.User, id, action: :read) do
            {:ok, user} ->
              assign(conn, :user, user)
            {:error, error} ->
              Logger.error("AssignActorFromSession: Failed to retrieve user with ID '#{id}' from JWT claims: #{inspect(error)}")
              conn
          end
    else
      token_fetch_error ->
        Logger.debug("AssignActorFromSession: Token fetch failed: #{inspect(token_fetch_error)}")
        conn
    end
  end

  defp fetch_user_token(conn) do
    case get_session(conn, :user_token) do
      nil -> :error
      token -> {:ok, token}
    end
  end
end
