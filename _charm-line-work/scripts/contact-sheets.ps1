$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$s   = 'C:\Users\Niels.v\AppData\Local\Temp\claude\E--\1a2ef45c-758e-43a8-8ce9-369a0b031963\scratchpad'
$out = 'E:\image-fixes\ip-sheets'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force $out | Out-Null

$rows = Import-Csv "$s\ip-sheet-index.csv" | Where-Object { $_.Path }

$COLS = 5; $GRID_ROWS = 4; $TILE = 280; $LABEL = 26
$perSheet = $COLS * $GRID_ROWS
$W = $COLS * $TILE
$H = $GRID_ROWS * ($TILE + $LABEL)

$font  = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
$black = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Black)
$grey  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(238,238,238))
$pen   = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(200,200,200))
$fmt   = New-Object System.Drawing.StringFormat
$fmt.Alignment = [System.Drawing.StringAlignment]::Center

$sheet = 0
for ($i = 0; $i -lt $rows.Count; $i += $perSheet) {
  $sheet++
  $chunk = $rows[$i..([Math]::Min($i + $perSheet, $rows.Count) - 1)]
  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  $k = 0
  foreach ($r in $chunk) {
    $cx = ($k % $COLS) * $TILE
    $cy = [Math]::Floor($k / $COLS) * ($TILE + $LABEL)
    try {
      $img = [System.Drawing.Bitmap]::FromFile($r.Path)
      # letterbox into the tile so nothing is cropped away
      $scale = [Math]::Min($TILE / $img.Width, $TILE / $img.Height)
      $dw = [int]($img.Width * $scale); $dh = [int]($img.Height * $scale)
      $g.DrawImage($img, ($cx + ($TILE - $dw) / 2), ($cy + ($TILE - $dh) / 2), $dw, $dh)
      $img.Dispose()
    } catch { }
    $g.FillRectangle($grey, $cx, ($cy + $TILE), $TILE, $LABEL)
    $rect = New-Object System.Drawing.RectangleF $cx, ($cy + $TILE + 5), $TILE, ($LABEL - 5)
    $g.DrawString($r.Sku, $font, $black, $rect, $fmt)
    $g.DrawRectangle($pen, $cx, $cy, $TILE, ($TILE + $LABEL))
    $k++
  }
  $g.Dispose()
  $name = 'sheet-{0:D2}.png' -f $sheet
  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output ("$name  -  " + (($chunk | ForEach-Object { $_.Sku }) -join ' '))
}
Write-Output ("sheets: $sheet   tiles: " + $rows.Count)
