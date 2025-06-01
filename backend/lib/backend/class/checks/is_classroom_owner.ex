
defmodule Backend.Class.Checks.IsClassroomOwner do
  use Ash.Policy.Check

  @impl true
  def strict_check(_changeset, %{actor: nil}, _opts), do: {:ok, false}

  def strict_check(_subject, context, _opts) do
    actor = context.actor
    changeset = context.changeset

    if !actor || !changeset do
      {:ok, false}
    else
      classroom_id = Ash.Changeset.get_attribute(changeset, :classroom_id)

      if classroom_id do
        is_owner? =
          Backend.Class.ClassRoomOwner
          |> Ash.Query.filter(classroom_id: classroom_id, user_id: actor.id)
          |> Ash.exists?()

        {:ok, is_owner?}
      else
        {:ok, false}
      end
    end
  end
end
