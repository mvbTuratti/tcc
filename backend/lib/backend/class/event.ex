defmodule Backend.Class.Event do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]

  postgres do
    table "events"
    repo Backend.Repo
    references do
      reference :classroom, on_delete: :delete
    end
  end

  json_api do
    type "event"
  end

  actions do
    defaults [:update, :destroy]
    read :read do
      primary?(true)
      prepare build(sort: :event_date)
      pagination keyset?: true, offset?: true, required?: false, countable: true
    end
    create :create do
      accept [:event_date, :start_time, :end_time, :url, :event_type, :description, :is_recurring,
      :recurrence_days_of_week, :recurrence_ends_at, :classroom_id]
    end
    changes do
      # change optimistic_lock(:version), on: [:create, :destroy, :update]
      change optimistic_lock(:version), on: [:destroy, :update]
    end
  end

  attributes do
    uuid_primary_key :id
    attribute :version, :integer, allow_nil?: false, default: 1
    attribute :event_date, :utc_datetime, allow_nil?: false, public?: true
    attribute :start_time, :time, allow_nil?: false, public?: true
    attribute :end_time, :time, allow_nil?: false, public?: true
    attribute :url, :string, allow_nil?: false, public?: true
    attribute :event_type, Backend.Types.EventType, allow_nil?: false, public?: true
    attribute :description, :string, allow_nil?: true, public?: true
    attribute :is_recurring, :boolean, default: false, allow_nil?: true, public?: true
    attribute :recurrence_days_of_week, {:array, Backend.Types.DayOfWeek} do
      allow_nil? true
      public? true
      constraints [
        max_length: 7
      ]
    end
    attribute :recurrence_ends_at, :date, allow_nil?: true, public?: true

    create_timestamp :inserted_at
    update_timestamp :updated_at

  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom
  end
  policies do
    policy action_type(:update) do
      authorize_if Backend.Class.Checks.IsOwner
    end
    policy action_type(:destroy) do
      authorize_if Backend.Class.Checks.IsOwner
    end
    policy action_type(:create) do
      authorize_if Backend.Class.Checks.IsOwner
    end
    policy action_type(:read) do
      authorize_if expr(
        exists(classroom, exists(enrollments, exists(student, user_id == ^actor(:id)))) or
        exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
        )
    end
  end
end
