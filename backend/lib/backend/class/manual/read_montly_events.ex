defmodule Backend.Class.Manual.ReadMonthlyEvents do
  use Ash.Resource.ManualRead
  require Ash.Query

  @impl true
  def read(ash_query, _data_layer_query, _opts, context) do
    args = ash_query.arguments
    {:ok, start_date} = Date.new(args.year, args.month, 1)
    end_date = Date.end_of_month(start_date)

    initial_query =
      ash_query.resource
      |> Ash.Query.for_read(:read, %{}, actor: context.actor)

    case Ash.read(initial_query) do
      {:ok, events_from_db} ->
        final_results =
          Enum.filter(events_from_db, fn event ->
            Backend.Class.Calculations.EventOccurrences.has_occurrence_in_range?(
              event,
              start_date,
              end_date
            )
          end)
        {:ok, final_results}
      error ->
        error
    end
  end
end
