defmodule Backend.Class do
  use Ash.Domain,
    validate_config_inclusion?: false,
    extensions: [AshJsonApi.Domain]

  json_api do
    # error_handler BackendWeb.JsonApiErrorHandler
    routes do
      base_route "/classroom", Backend.Class.ClassRoom do
        index :read
        get :by_id
        index :list_owned, route: "/owned"
        index :list_enrolled, route: "/enrolled"

        post(:create, upsert?: true)
        patch(:update, query_params: [:version])
        delete(:destroy)
      end

      base_route "/enrollment", Backend.Class.Enrollment do
        get :me, route: "/me"
        index :list_for_classroom_panel, route: "/members"
        index :read
        post(:create)
        patch(:update)
        delete(:destroy)
        relationship :student, :read
      end

      base_route "/post", Backend.Class.Post do
        index :read
        get :by_id
        post(:create, upsert?: true)
        patch(:update, query_params: [:version])
        delete(:destroy)
      end
      base_route "/billing", Backend.Class.Billing do
        get :by_id
        index :read
        post(:create, upsert?: true)
        patch(:update, query_params: [:version])
        delete(:destroy, query_params: [:version])
      end

      base_route "/response", Backend.Class.Response do
        # get(:read)
        # index :read
        post(:create)
        patch(:update, query_params: [:version])
        delete(:destroy)
      end

      base_route "/event", Backend.Class.Event do
        get(:read)
        index :read
        index :read_month, route: "/month"
        post(:create)
        patch(:update, query_params: [:version])
        delete(:destroy, query_params: [:version])
      end
    end
  end
  resources do
    resource Backend.Class.ClassRoom
    resource Backend.Class.ClassRoomOwner
    resource Backend.Class.Student
    resource Backend.Class.Enrollment
    resource Backend.Class.Post
    resource Backend.Class.Billing
    resource Backend.Class.Response
    resource Backend.Class.Event
  end
end
