defmodule BackendWeb.JsonApiRouter do
  use AshJsonApi.Router,
    domains: [Module.concat(["Backend.Class"]),Module.concat(["Backend.Accounts"])],
    open_api: "/open_api"

  # modify_open_api: {__MODULE__, :modify_open_api, []},
  # open_api_file: "priv/static/openapi.json"
end
