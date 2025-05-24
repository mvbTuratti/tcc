defmodule Backend.Class do
  use Ash.Domain,
    validate_config_inclusion?: false,
    extensions: [AshJsonApi.Domain]

  json_api do
    error_handler BackendWeb.JsonApiErrorHandler
    routes do
      base_route "/classroom", Backend.Class.ClassRoom do
        get(:read)
        index :read
        post(:create, upsert?: true)
        patch(:update, query_params: [:version])
        delete(:destroy)
      end
    end
  end

  resources do
    resource Backend.Class.ClassRoom do
      define :create_class, action: :create, args: [:name, :description]
      define :read_classes, action: :read
      define :update_class, action: :update
      define :get_class, args: [:id], action: :by_id
      define :delete_class, action: :destroy
    end
  end
end
