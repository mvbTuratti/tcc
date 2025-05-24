defmodule BackendWeb.AuthController do
  use BackendWeb, :controller
  use AshAuthentication.Phoenix.Controller
  import Ash.Query

  def success(conn, activity, user, _token) do
    return_to = get_session(conn, :return_to) || ~p"/"

    message =
      case activity do
        {:confirm_new_user, :confirm} -> "Your email address has now been confirmed"
        {:password, :reset} -> "Your password has successfully been reset"
        _ -> "You are now signed in"
      end

    conn
    |> delete_session(:return_to)
    |> store_in_session(user)
    # If your resource has a different name, update the assign name here (i.e :current_admin)
    |> assign(:current_user, user)
    |> put_flash(:info, message)
    |> redirect(to: return_to)
  end

  def failure(conn, activity, reason) do
    message =
      case {activity, reason} do
        {_,
         %AshAuthentication.Errors.AuthenticationFailed{
           caused_by: %Ash.Error.Forbidden{
             errors: [%AshAuthentication.Errors.CannotConfirmUnconfirmedUser{}]
           }
         }} ->
          """
          You have already signed in another way, but have not confirmed your account.
          You can confirm your account using the link we sent to you, or by resetting your password.
          """

        _ ->
          "Incorrect email or password"
      end

    conn
    |> put_flash(:error, message)
    |> redirect(to: ~p"/sign-in")
  end

  def sign_out(conn, _params) do
    return_to = get_session(conn, :return_to) || ~p"/"

    conn
    |> clear_session()
    |> put_flash(:info, "You are now signed out")
    |> redirect(to: return_to)
  end
  # def sign_out(conn, _params) do
  #   # if current_user = conn.assigns[:current_user] do
  #   #   # Opcional: revogar manualmente tokens do banco
  #   #   Backend.Accounts.revoke_tokens_for(current_user)
  #   # end

  #   conn
  #   |> clear_session()
  #   |> put_flash(:info, "Você saiu com sucesso")
  #   |> redirect(to: "/sign-in")
  # end

  # def revoke_tokens_for(user) do
  #   Backend.Accounts.Token
  #   |> filter(field(:subject) == ^user.id)
  #   |> Backend.Accounts.read!()
  #   |> Enum.each(&Backend.Accounts.destroy!/1)
  # end


end
