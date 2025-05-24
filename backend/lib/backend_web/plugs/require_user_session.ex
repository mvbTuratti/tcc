defmodule BackendWeb.Plugs.RequireUserSession do
  import Plug.Conn
  import Phoenix.Controller

  def init(default), do: default

  def call(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
      |> put_flash(:error, "Faça login para continuar")
      |> redirect(to: "/sign-in")
      |> halt()
    end
  end
end
