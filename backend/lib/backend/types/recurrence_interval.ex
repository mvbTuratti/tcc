defmodule Backend.Types.RecurrenceInterval do
  use Ash.Type.Enum,
    values: [:daily, :weekly, :monthly]
end
