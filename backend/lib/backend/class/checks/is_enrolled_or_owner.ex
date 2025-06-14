
defmodule Backend.Class.Checks.IsEnrolledOrOwner do
  use Ash.Policy.Check

  @impl true
  def describe(_opts) do
    "actor is the enrolled in the classroom"
  end

  @impl true
  def strict_check(_changeset, %{actor: nil}, _opts), do: {:ok, false}

  def strict_check(_subject, context, _opts) do
    actor = context.actor
    changeset = context.changeset
    if !actor || !changeset do
      {:ok, false}
    else
      IO.inspect(actor, label: "STRICT CHECK: ACTOR")
      classroom_id = Ash.Changeset.get_attribute(changeset, :classroom_id)
      student_id = check_student_id(actor.id)
      cond do
        classroom_id ->
          is_owner_or_enrolled? = is_owner?(classroom_id,actor.id) || ( student_id && is_enrolled?(classroom_id,student_id))
          {:ok, is_owner_or_enrolled?}
        true ->
          {:ok, false}
      end
    end
  end

  defp check_student_id(actor_id) do
    Backend.Class.Student
    |> Ash.Query.filter(user_id: actor_id)
    |> Ash.read_one()
    |> case do
      {:ok, nil} -> nil
      {:ok, student} -> student.id
      _ -> nil
    end
  end
  defp is_enrolled?(classroom_id, student_id) do
    Backend.Class.Enrollment
    |> Ash.Query.filter(classroom_id: classroom_id, student_id: student_id)
    |> Ash.exists?(authorize?: false)
  end
  defp is_owner?(classroom_id, user_id) do
    Backend.Class.ClassRoomOwner
    |> Ash.Query.filter(classroom_id: classroom_id, user_id: user_id)
    |> Ash.exists?(authorize?: false)
  end
end
