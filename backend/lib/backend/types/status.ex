defmodule Backend.Types.Status do
  use Ash.Type.Enum,
    values: [:active, :pending, :removed]
end
