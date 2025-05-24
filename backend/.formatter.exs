[
  import_deps: [
    :ash_authentication_phoenix,
    :ash,
    :ecto,
    :ecto_sql,
    :phoenix,
    :ash_postgres,
    :ash_authentication
  ],
  subdirectories: ["priv/*/migrations"],
  plugins: [Spark.Formatter, Phoenix.LiveView.HTMLFormatter],
  inputs: ["*.{heex,ex,exs}", "{config,lib,test}/**/*.{heex,ex,exs}", "priv/*/seeds.exs"]
]
