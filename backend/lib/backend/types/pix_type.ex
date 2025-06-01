defmodule Backend.Types.PixType do
  use Ash.Type.Enum,
    values: [:cpf, :cellphone, :aleatory, :email, :cnpj]
end
