defmodule Backend.Policies.Checks.ActorPresent do
  @behaviour Ash.Policy.Check

  @impl true
  def check(context, _action_type, _resource, _options) do
    case Map.get(context, :actor) do
      nil -> false
      _actor -> true
    end
  end

  @impl true
  def init(opts), do: opts

  @impl true
  def describe(_options) do
    "Actor is present"
  end

  @impl true
  def eager_evaluate?(), do: true

  @impl true
  def prefer_expanded_description?(), do: true

  @impl true
  def requires_original_data?(_action_type, _check_options), do: false # THIS MUST BE PRESENT

  @impl true
  def strict_check(context, opts, _ash_options) do
    check(context, nil, nil, opts)
  end

  @impl true
  def type(), do: :check
end
