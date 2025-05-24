defmodule Backend.Class.Event do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource]

  postgres do
    table "events"
    repo Backend.Repo
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
  end

  attributes do
    uuid_primary_key :id
    attribute :event_date, :date, allow_nil?: false
    attribute :start_time, :time, allow_nil?: false
    attribute :end_time, :time, allow_nil?: false
    attribute :event_type, Backend.Types.EventType, allow_nil?: false
    attribute :description, :string
    attribute :is_recurring, :boolean, default: false
    attribute :recurrence_interval, Backend.Types.RecurrenceInterval

    create_timestamp :inserted_at
    update_timestamp :updated_at

  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom
  end
end
