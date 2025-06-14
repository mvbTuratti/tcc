defmodule Backend.Class.Calculations.EventOccurrences do
  def has_occurrence_in_range?(event, query_start, query_end) do
    if !event.is_recurring do
      event_date = DateTime.to_date(event.event_date)
      Date.compare(event_date, query_start) != :lt and Date.compare(event_date, query_end) != :gt
    else
      stream_occurrences(event)
      |> Enum.any?(fn occurrence_date ->
        Date.compare(occurrence_date, query_start) != :lt and Date.compare(occurrence_date, query_end) != :gt
      end)
    end
  end

  defp stream_occurrences(event) do
    event_start_date = DateTime.to_date(event.event_date)
    Stream.iterate(event_start_date, &Date.add(&1, 1))
    |> Stream.take_while(fn date ->
      is_nil(event.recurrence_ends_at) or Date.compare(date, event.recurrence_ends_at) != :gt
    end)
    |> Stream.filter(&matches_recurrence_rule?(&1, event))
  end

  defp matches_recurrence_rule?(date, event) do
    day_of_week_matches? =
      event.recurrence_days_of_week
      |> Enum.map(&day_of_week_to_int/1)
      |> Enum.member?(Date.day_of_week(date))

    if !day_of_week_matches? do
       false
    else
      case event.recurrence_type do
        :weekly -> true
        :monthly ->
          week_of_month_matches?(date, event.recurrence_weeks_of_month)
        _ -> false
      end
    end
  end

  defp week_of_month_matches?(date, allowed_weeks) do
    current_week = div(date.day - 1, 7) + 1
    is_last_week = Date.add(date, 7).month != date.month

    cond do
      0 in allowed_weeks and is_last_week -> true
      current_week in allowed_weeks -> true
      true -> false
    end
  end

  defp day_of_week_to_int(:monday), do: 1
  defp day_of_week_to_int(:tuesday), do: 2
  defp day_of_week_to_int(:wednesday), do: 3
  defp day_of_week_to_int(:thursday), do: 4
  defp day_of_week_to_int(:friday), do: 5
  defp day_of_week_to_int(:saturday), do: 6
  defp day_of_week_to_int(:sunday), do: 7
end
