defmodule Backend.Types.RecurrenceInterval do
  use Ash.Type.Enum,
    values: [:weekly, :monthly]
end
