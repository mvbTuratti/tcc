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
  def set_span_context(context) do
    IO.inspect(context, label: "Set span context")
    :ok
  end

  @impl true
  def set_metadata(metadata, value) do
    IO.inspect(metadata, label: "Set metadata METADATA")
    IO.inspect(value, label: "Set metadata VALUE")
    :ok
  end

  @impl true
  def set_error(meta) do
    IO.inspect(meta, label: "ERROR")
    :ok
  end
end
