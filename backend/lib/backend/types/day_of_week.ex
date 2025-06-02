defmodule Backend.Types.DayOfWeek do
  use Ash.Type.Enum,
    values: [:sunday, :monday, :tuesday, :wednesday, :thursday, :friday, :saturday]
end
