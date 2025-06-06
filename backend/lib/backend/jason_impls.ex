defimpl Jason.Encoder, for: Ash.ForbiddenField do
  def encode(_forbidden_field, _opts) do
    # Produces JSON `null`. For actual omission, the containing map
    # should be processed *before* encoding to remove keys with
    # Ash.ForbiddenField values. This defimpl is a fallback.
    Jason.encode!(nil)
  end
end
