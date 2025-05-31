defmodule BackendWeb.Router do
  use BackendWeb, :router
  use AshAuthentication.Phoenix.Router

  import AshAuthentication.Plug.Helpers
  use AshAuthentication.Phoenix.Router

  pipeline :public_browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {BackendWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :load_from_session
  end
  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {BackendWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :load_from_session
    plug BackendWeb.Plugs.RequireUserSession
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :load_from_bearer
    plug :set_actor, :user
  end

  pipeline :api_with_actor do
    plug :accepts, ["json"]
    plug :fetch_session
    plug BackendWeb.Plugs.AssignActorFromSession
    plug BackendWeb.Plugs.SetAshActor
  end

  # scope "/", BackendWeb do
  #   pipe_through [:browser, BackendWeb.Plugs.RequireUserSession]

  #   ash_authentication_live_session :authenticated_routes do
  #     # in each liveview, add one of the following at the top of the module:
  #     #
  #     # If an authenticated user must be present:
  #     # on_mount {BackendWeb.LiveUserAuth, :live_user_required}
  #     #
  #     # If an authenticated user *may* be present:
  #     # on_mount {BackendWeb.LiveUserAuth, :live_user_optional}
  #     #
  #     # If an authenticated user must *not* be present:
  #     # on_mount {BackendWeb.LiveUserAuth, :live_no_user}
  #   end
  # end

  scope "/api" do
    pipe_through [:api_with_actor]

    forward "/v1/swaggerui",
            OpenApiSpex.Plug.SwaggerUI,
            path: "/api/v1/open_api",
            default_model_expand_depth: 4

    forward "/v1/redoc",
            Redoc.Plug.RedocUI,
            spec_url: "/api/v1/open_api"
    forward "/v1", BackendWeb.JsonApiRouter
  end

  scope "/", BackendWeb do
    pipe_through :public_browser
    # auth_routes AuthController, BackendWeb.Accounts.User, path: "/auth"
    auth_routes AuthController, Backend.Accounts.User, path: "/auth"
    sign_out_route AuthController

    # Remove these if you'd like to use your own authentication views
    sign_in_route register_path: "/register",
                  auth_routes_prefix: "/auth",
                  on_mount: [{BackendWeb.LiveUserAuth, :live_no_user}],
                  overrides: [
                    BackendWeb.AuthOverrides,
                    AshAuthentication.Phoenix.Overrides.Default
                  ]
  end
  scope "/", BackendWeb do
    pipe_through [:browser]
    get "/", PageController, :home

  end

  # Other scopes may use custom stacks.
  # scope "/api", BackendWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:backend, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: BackendWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
