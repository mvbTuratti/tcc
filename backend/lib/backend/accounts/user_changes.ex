defmodule Backend.Accounts.UserChanges do
  alias Backend.Accounts.UserIdentity
  alias Ash.Changeset

  def create_identity_after_action(changeset, user, _context) do
    user_info = Changeset.get_argument(changeset, :user_info)
    oauth_tokens = Changeset.get_argument(changeset, :oauth_tokens)
    identity_changeset =
      Backend.Accounts.UserIdentity
      |> Ash.Changeset.for_create(:create_from_oauth, %{
        uid: user_info["sub"],
        strategy: "google",
        access_token: oauth_tokens["access_token"],
        refresh_token: oauth_tokens["refresh_token"],
        access_token_expires_at:
          DateTime.utc_now() |> DateTime.add(oauth_tokens["expires_in"], :second),
        user: user
      })

    IO.inspect(identity_changeset, label: "🟡 Identity Changeset")

    case Ash.create(identity_changeset) do
      {:ok, identity} ->
        IO.puts("✅ Identity criada com sucesso!")
        {:ok, user}

      {:error, error} ->
        IO.puts("❌ ERRO AO INSERIR IDENTITY")
        IO.inspect(error, label: "⛔ Error retornado pelo Ash.create/1")
        {:ok, user} # Evita que o erro impeça o fluxo de login (temporariamente)
    end
  end


end
