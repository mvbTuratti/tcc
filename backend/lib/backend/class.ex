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

      base_route "/student", Backend.Class.Student do
        get(:read)
        index :read
        post(:create)
        patch(:update)
        delete(:destroy)
      end

      base_route "/enrollment", Backend.Class.Enrollment do
        get(:read)
        index :read
        post(:create)
        patch(:update)
        delete(:destroy)
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
        post(:create, upsert?: true)
        patch(:update, query_params: [:version])
        delete(:destroy)
      end

      base_route "/response", Backend.Class.Response do
        get(:read)
        index :read
        post(:create)
        patch(:update)
        delete(:destroy)
      end

      base_route "/event", Backend.Class.Event do
        get(:read)
        index :read
        post(:create)
        patch(:update)
        delete(:destroy)
      end
    end
  end

  resources do
    resource Backend.Class.ClassRoom do
      define :create_class, action: :create, args: [:name, :description]
      define :update_class, action: :update
      define :get_class, args: [:id], action: :by_id
      define :delete_class, action: :destroy
    end

    resource Backend.Class.ClassRoomOwner do
      define :assign_owner, action: :create
      define :delete_entry, action: :destroy
      define :get_professors, action: :read
    end

    resource Backend.Class.Student do
      define :create_student, action: :create, args: [:email]
      define :read_students, action: :read
      define :update_student, action: :update
      define :delete_student, action: :destroy
    end

    resource Backend.Class.Enrollment do
      define :create_enrollment, action: :create, args: [:student_id, :classroom_id, :status, :is_delinquent]
      define :read_enrollments, action: :read
      define :update_enrollment, action: :update
      define :delete_enrollment, action: :destroy
    end

    resource Backend.Class.Post do
      # define :create_post, action: :create, args: [:content, :classroom_id, :author_id]
      # define :read_posts, action: :read
      # define :update_post, action: :update
      # define :delete_post, action: :destroy
    end
    resource Backend.Class.Billing do
      # define :create_post, action: :create, args: [:content, :classroom_id, :author_id]
      # define :read_posts, action: :read
      # define :update_post, action: :update
      # define :delete_post, action: :destroy
    end

    resource Backend.Class.Response do
      # define :create_post, action: :create, args: [:content, :classroom_id, :author_id]
      # define :read_posts, action: :read
      # define :update_post, action: :update
      # define :delete_post, action: :destroy
    end

    resource Backend.Class.Event do
      define :create_event, action: :create, args: [:event_date, :start_time, :end_time, :event_type, :description, :is_recurring, :recurrence_interval, :classroom_id]
      define :read_events, action: :read
      define :update_event, action: :update
      define :delete_event, action: :destroy
    end
  end
end
