# Create a new file for your custom policy checks, e.g., lib/backend/policies/checks.ex
defmodule Backend.Policies.Checks do
  @behaviour Ash.Policy.Check

  @impl true
  # The check function receives 4 arguments:
  # 1. context: The Ash action context (contains :actor, :tenant, etc.)
  # 2. action_type: The type of action being performed (:read, :create, :update, :destroy)
  # 3. resource: The resource module the action is being performed on (e.g., Backend.Class.ClassRoom)
  # 4. options: Any options passed to the policy check (e.g., `authorize MyCheck, some_option: true`)
  def check(context, _action_type, _resource, _options) do # <--- CORRECTED ARITY TO check/4
    case Map.get(context, :actor) do
      nil -> false
      _actor -> true
    end
  end

  def init(opts), do: opts

  @impl true
  # Provides a human-readable description of the check.
  def describe(_options) do
    "Actor is present"
  end

  @impl true
  # Determines if the check should be eagerly evaluated (true)
  # or can be optimized into a filter (false).
  def eager_evaluate?(), do: true

  @impl true
  # Controls how the check is described in expanded form.
  def prefer_expanded_description?(), do: true

  @impl true
  # Indicates if the check requires the original data of the record.
  def requires_original_data?(_action_type, _check_options), do: false

  @impl true
  # Provides a strict check. Often delegates to `check/4`.
  def strict_check(context, opts, _ash_options) do
    # For a simple check, `strict_check` can often just call `check/4`
    check(context, nil, nil, opts) # Pass nil for action_type and resource if not used by strict_check
  end

  @impl true
  # Specifies the type of the check.
  def type(), do: :check
end
