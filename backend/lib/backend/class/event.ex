defmodule Backend.Class.Event do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]
  require Ash.Query

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
    defaults [:destroy]
    read :read do
      primary?(true)
      prepare build(sort: :event_date)
      pagination keyset?: true, offset?: true, required?: false, countable: true
    end
    read :read_month do
      argument :year, :integer, allow_nil?: false, constraints: [min: 1970, max: 3000]
      argument :month, :integer, allow_nil?: false, constraints: [min: 1, max: 12]
      manual Backend.Class.Manual.ReadMonthlyEvents
    end

    create :create do
        accept [:event_date, :start_time, :end_time, :url, :event_type, :description, :is_recurring,
        :recurrence_type, :recurrence_days_of_week, :recurrence_weeks_of_month, :recurrence_ends_at, :classroom_id]
    end
    create :create_for_user do
      accept [:event_date, :start_time, :end_time, :url, :event_type, :description, :is_recurring,
      :recurrence_type, :recurrence_days_of_week, :recurrence_weeks_of_month, :recurrence_ends_at, :user_id]
    end
    update :update do
      accept [
        :event_date, :start_time, :end_time, :url, :event_type, :description, :is_recurring,
        :recurrence_type, :recurrence_days_of_week, :recurrence_weeks_of_month, :recurrence_ends_at
      ]
      require_atomic? false
    end

    changes do
      change fn changeset, _context ->
        changeset
        |> validate_ownership()
        |> validate_recurrence_rules()
      end
      change optimistic_lock(:version), on: [:destroy, :update]
    end
  end
  calculations do
    calculate :occurs_in_range?, :boolean,
      module: Backend.Class.Calculations.EventOccurrences do
      argument :start_date, :date do
        allow_nil? false
      end
      argument :end_date, :date do
        allow_nil? false
      end
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
    attribute :recurrence_type, Backend.Types.RecurrenceInterval, allow_nil?: true, public?: true
    attribute :recurrence_days_of_week, {:array, Backend.Types.DayOfWeek} do
      allow_nil? true
      public? true
      constraints max_length: 7
    end
    attribute :recurrence_weeks_of_month, {:array, :integer} do
      allow_nil? true
      public? true
      constraints items: [min: 0, max: 4]
    end
    attribute :recurrence_ends_at, :date, allow_nil?: true, public?: true

    create_timestamp :inserted_at
    update_timestamp :updated_at

  end

  relationships do
    belongs_to :classroom, Backend.Class.ClassRoom do
      allow_nil? true
      public? true
    end
    belongs_to :user, Backend.Accounts.User do
      allow_nil? true
      public? true
    end
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
          exists(classroom, exists(classroom_owners, user_id == ^actor(:id))) or
          expr(user_id == ^actor(:id))
        )
    end
  end

  defp validate_ownership(changeset) do
    user_id = Ash.Changeset.get_attribute(changeset, :user_id)
    classroom_id = Ash.Changeset.get_attribute(changeset, :classroom_id)
    cond do
      is_nil(user_id) and is_nil(classroom_id) ->
        Ash.Changeset.add_error(changeset, :base, "Um evento deve pertencer a um usuário ou a uma sala de aula.")
      not is_nil(user_id) and not is_nil(classroom_id) ->
        Ash.Changeset.add_error(changeset, :base, "Um evento não pode pertencer a um usuário e a uma sala de aula ao mesmo tempo.")
      true ->
        changeset
    end
  end
  defp validate_recurrence_rules(changeset) do
    if changeset.valid? == false do
      changeset
    else
      is_recurring = Ash.Changeset.get_attribute(changeset, :is_recurring)
      type = Ash.Changeset.get_attribute(changeset, :recurrence_type)
      days_of_week = Ash.Changeset.get_attribute(changeset, :recurrence_days_of_week)
      weeks_of_month = Ash.Changeset.get_attribute(changeset, :recurrence_weeks_of_month)

      case is_recurring do
        false ->
          if type || days_of_week || weeks_of_month do
            Ash.Changeset.add_error(changeset, :is_recurring, "não pode ter atributos de recorrência quando `is_recurring` é falso.")
          else
            changeset
          end
        true ->
          validate_recurring_type(changeset, type, days_of_week, weeks_of_month)
      end
    end
  end

  defp validate_recurring_type(changeset, type, days_of_week, weeks_of_month) do
    case type do
      :weekly ->
        cond do
          is_nil(days_of_week) or days_of_week == [] ->
            Ash.Changeset.add_error(changeset, :recurrence_days_of_week, "é obrigatório para recorrência semanal.")
          not is_nil(weeks_of_month) ->
            Ash.Changeset.add_error(changeset, :recurrence_weeks_of_month, "só pode ser usado com recorrência mensal.")
          true ->
            changeset
        end
      :monthly ->
        cond do
          is_nil(days_of_week) or days_of_week == [] ->
            Ash.Changeset.add_error(changeset, :recurrence_days_of_week, "é obrigatório para recorrência mensal.")
          is_nil(weeks_of_month) or weeks_of_month == [] ->
            Ash.Changeset.add_error(changeset, :recurrence_weeks_of_month, "é obrigatório para recorrência mensal.")
          true ->
            changeset
        end
      nil ->
        Ash.Changeset.add_error(changeset, :recurrence_type, "é obrigatório quando `is_recurring` é verdadeiro.")
    end
  end
end
