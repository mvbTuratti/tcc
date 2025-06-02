
defmodule Backend.Class.Checks.IsOwnerAndNotThemselves do
  use Ash.Policy.Check

  @impl true
  def describe(_opts) do
    "actor is the classroom owner and not enrolling themselves"
  end

  @impl true
  def strict_check(_changeset, %{actor: nil}, _opts), do: {:ok, false}

  def strict_check(_subject, context, _opts) do
    actor = context.actor
    changeset = context.changeset

    if !actor || !changeset do
      {:ok, false}
    else
      classroom_id = Ash.Changeset.get_attribute(changeset, :classroom_id)
      student_email_from_args = Ash.Changeset.get_argument(changeset, :student_email)
      cond do
        student_email_from_args && actor.email == student_email_from_args ->
          {:ok, false} # Owner cannot enroll themselves
        classroom_id ->
          is_owner? =
            Backend.Class.ClassRoomOwner
            |> Ash.Query.filter(classroom_id: classroom_id, user_id: actor.id)
            |> Ash.exists?()
          {:ok, is_owner?}
        true ->
          {:ok, false}
      end
    end
  end
end
