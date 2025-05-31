defmodule Backend.Repo.Migrations.AddStudentEmailUserEmailConstraint do
  use Ecto.Migration

  def up do
    # 1. Create the validation function
    execute("""
    CREATE OR REPLACE FUNCTION validate_student_user_email_match(
        p_student_email TEXT,
        p_user_id UUID
    )
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    STABLE -- Important: Function does not modify database state and always returns the same result for same inputs
    AS $$
    DECLARE
        user_email TEXT;
    BEGIN
        IF p_user_id IS NULL THEN
            -- If user_id is NULL, no matching is required. Validation passes.
            RETURN TRUE;
        END IF;

        -- Retrieve the user's email
        SELECT email INTO user_email FROM users WHERE id = p_user_id;

        -- If user_id exists (and thus user_email is found)
        IF FOUND THEN
            -- Check if the student's email matches the user's email
            RETURN p_student_email = user_email;
        ELSE
            -- This case technically shouldn't happen if foreign key is active,
            -- as the p_user_id should exist in 'users'.
            -- However, returning FALSE ensures that if somehow a non-existent
            -- user_id is attempted (e.g., if FK is temporarily deferred), it fails.
            -- Or, if you prefer, you could RETURN TRUE here if a non-existent user_id
            -- implicitly means no email check is possible (but FK already handles this).
            -- For strictness, returning FALSE is safer for the email match logic itself.
            RETURN FALSE; -- User ID not found, so email cannot match (or FK handles it)
        END IF;
    END;
    $$;
    """)

    execute("""
    ALTER TABLE students
    ADD CONSTRAINT chk_student_user_email_match
    CHECK (validate_student_user_email_match(email, user_id));
    """)
  end

  def down do
    execute("ALTER TABLE students DROP CONSTRAINT IF EXISTS chk_student_user_email_match;")
    execute("DROP FUNCTION IF EXISTS validate_student_user_email_match(TEXT, UUID);")
  end
end
