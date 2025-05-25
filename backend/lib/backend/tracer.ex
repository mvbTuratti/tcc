defmodule Backend.Tracer do
  @behaviour Ash.Tracer

  @impl true
  def start_span(name, metadata) do
    IO.puts("[TRACE] START: #{inspect(name)}")
    IO.inspect(metadata, label: "Trace Metadata")
    :ok
  end

  @impl true
  def stop_span do
    IO.puts("[TRACE] STOP")
    :ok
  end

  @impl true
  def get_span_context do
    :ok
  end

  @impl true
  def set_span_context(_context) do
    :ok
  end

  @impl true
  def set_metadata(_metadata, _value) do
    :ok
  end
end
