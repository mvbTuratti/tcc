defmodule Backend.Accounts do
  use Ash.Domain,
    extensions: [AshJsonApi.Domain]

  json_api do
    routes do
      base_route "/user", Backend.Accounts.User do
        index :me, route: "/me"        
        end
      end
    end

  resources do
    resource Backend.Accounts.User
    resource Backend.Accounts.Token
    resource Backend.Accounts.UserIdentity
  end

end
