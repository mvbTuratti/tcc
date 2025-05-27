defmodule Backend.Types.FilterByType do
  use Ash.Type.Enum,
    values: [:owner, :enrolled]
end
