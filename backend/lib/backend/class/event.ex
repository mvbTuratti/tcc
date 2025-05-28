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
    defaults [:read, :destroy]
    create :create do
      accept [:event_date, :start_time, :end_time, :event_type, :description, :is_recurring, :recurrence_interval, :classroom_id]
    end

    update :update do
      accept [:event_date, :start_time, :end_time, :event_type, :description, :is_recurring, :recurrence_interval]
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
    attribute :event_type, Backend.Types.EventType, allow_nil?: false, public?: true
    attribute :description, :string, allow_nil?: true, public?: true
    attribute :is_recurring, :boolean, default: false, allow_nil?: true, public?: true
    attribute :recurrence_interval, Backend.Types.RecurrenceInterval, allow_nil?: true, public?: true

    create_timestamp :inserted_at
    update_timestamp :updated_at

  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom
  end
end
