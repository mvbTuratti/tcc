defmodule BackendWeb.JsonApiErrorHandler do
  @moduledoc false

  # def handle_error(%Ash.Error.Forbidden{} = error, _conn) do
  #   %{
  #     status: 403,
  #     title: "Forbidden",
  #     detail: Exception.message(error)
  #   }
  # end

  # def handle_error(%Ash.Error.Invalid{} = error, _conn) do
  #   %{
  #     status: 422,
  #     title: "Unprocessable Entity",
  #     detail: Exception.message(error)
  #   }
  # end

  # def handle_error(%Ash.Error.NotFound{} = error, _conn) do
  #   %{
  #     status: 404,
  #     title: "Not Found",
  #     detail: Exception.message(error)
  #   }
  # end

  def handle_error(error, _conn) do
    %{
      status: 500,
      title: "Internal Server Error",
      detail: Exception.message(error)
    }
  end
end
