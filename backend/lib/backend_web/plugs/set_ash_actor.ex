defmodule BackendWeb.Plugs.SetAshActor do
  require Plug.Conn
  require Ash.PlugHelpers # To use get_actor

  def init(opts), do: opts

  def call(conn, _opts) do
    case Map.get(conn.assigns, :user) do
      nil ->
        IO.warn("BackendWeb.Plugs.SetAshActor: No user found in conn.assigns.user. Actor will not be set.")
        conn # Return conn unchanged if no user
      user ->
        Ash.PlugHelpers.set_actor(conn, user)
    end
  end
end
