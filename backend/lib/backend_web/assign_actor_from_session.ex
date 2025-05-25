defmodule BackendWeb.AssignActorFromSession do
  import Plug.Conn
  require Ash.Query

  def init(opts), do: opts

  def call(conn, _opts) do
    with {:ok, token} <- fetch_user_token(conn),
         {:ok, claims, _resource_module} <- AshAuthentication.Jwt.verify(token, Backend.Accounts.User) do
          "user?id=" <> id = claims["sub"]
          IO.inspect(id, label: "here")
          user = Ash.get!(Backend.Accounts.User, id, action: :read)

          conn = assign(conn, :current_user, user)
          IO.inspect(conn)
          conn
        end
      else
        _ ->
          IO.inspect("failed")
          conn
  end

  defp fetch_user_token(conn) do
    case get_session(conn, :user_token) do
      nil -> :error
      token -> {:ok, token}
    end
  end
end
