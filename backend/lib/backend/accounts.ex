defmodule Backend.Accounts do
  use Ash.Domain

  resources do
    resource Backend.Accounts.User
    resource Backend.Accounts.Token
    resource Backend.Accounts.UserIdentity
  end

end
