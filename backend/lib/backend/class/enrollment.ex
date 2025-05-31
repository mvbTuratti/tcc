defmodule Backend.Class.Enrollment do
  use Ash.Resource,
    domain: Backend.Class,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource],
    authorizers: [
      Ash.Policy.Authorizer
    ]

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
    changes do
      change optimistic_lock(:version), on: [:create, :destroy, :update]
    end
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
end
