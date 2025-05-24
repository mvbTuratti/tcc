defmodule Backend.Types.EventType do
  use Ash.Type.Enum,
    values: [:success, :warning, :error]
end
