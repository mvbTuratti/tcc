defmodule Backend.Class.Enrollment do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource]

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
      accept [:status, :is_delinquent, :student_id, :classroom_id]
    end

    update :update do
      accept [:status, :is_delinquent]
    end
  end

  attributes do
    uuid_primary_key :id
    attribute :status, Backend.Types.Status, allow_nil?: false
    attribute :is_delinquent, :boolean, default: false

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :student, Backend.Class.Student
    belongs_to :classroom, Backend.Class.ClassRoom
  end
end
