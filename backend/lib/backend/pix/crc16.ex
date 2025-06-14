defmodule Backend.Utils.CRC16 do
  import Bitwise
  @poly 0x1021

  def ccitt_false(data) when is_binary(data) do
    for <<byte <- data>>, reduce: 0xFFFF do
      crc ->
        crc = Bitwise.bxor(crc, byte <<< 8)
        for _ <- 0..7, reduce: crc do
          acc ->
            if (acc &&& 0x8000) != 0 do
              Bitwise.bxor(acc <<< 1, @poly)
            else
              acc <<< 1
            end &&& 0xFFFF
        end
    end
  end
end
