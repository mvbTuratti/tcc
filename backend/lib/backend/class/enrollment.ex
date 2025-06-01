defmodule Backend.Class.Enrollment do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]
  require Ash.Query


  postgres do
    table "enrollments"
    repo Backend.Repo
    references do
      reference :classroom, on_delete: :delete
      reference :student, on_delete: :delete
    end
  end

  json_api do
    type "enrollment"
  end

  actions do
    defaults [:read, :destroy]
    create :create do
      argument :student_email, :ci_string, allow_nil?: false
      accept [:status, :is_delinquent, :classroom_id]
      change fn changeset, _context ->
        student_email = Ash.Changeset.get_argument(changeset, :student_email)
        Ash.Changeset.manage_relationship(
          changeset,
          :student,
          %{email: student_email},
          type: :create,
          on_lookup: :relate,
          on_no_match: :create,
          authorize?: false
        )
      end
    end


    update :update do
      accept [:status, :is_delinquent]
    end
    changes do
      change optimistic_lock(:version), on: [:create, :destroy, :update]
    end
  end
  identities do
    identity :unique_student_classroom, [:student_id, :classroom_id]
  end

  attributes do
    uuid_primary_key :id do
      public? true
    end
    attribute :version, :integer, allow_nil?: false, default: 1
    attribute :status, Backend.Types.Status do
      allow_nil? false
      public? true
    end
    attribute :is_delinquent, :boolean do
      default false
      public? true
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :student, Backend.Class.Student
    belongs_to :classroom, Backend.Class.ClassRoom
  end
  policies do
    policy action_type(:create) do
      authorize_if Backend.Class.Checks.IsClassroomOwner
    end

    policy action_type(:read) do
      authorize_if expr(
        student.user_id == ^actor(:id) or
        exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
      )
    end
    policy action_type(:destroy) do
      authorize_if expr(
        student.user_id == ^actor(:id) or
        exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
      )
    end
    policy action_type(:update) do
      authorize_if expr(
        exists(classroom, exists(classroom_owners, user_id == ^actor(:id)))
      )
    end
  end
end
