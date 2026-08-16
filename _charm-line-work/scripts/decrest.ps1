param(
  [string]$Src = 'E:\shopify-upload-v2',
  [string]$Out = 'E:\image-fixes\logo-removed',
  [switch]$Apply
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Removing the ORLOFF crest from the upper-left corner of the product shots.
#
# Only safe where the background behind the stamp is plain. The ribbon and
# lifestyle shots need a real repaint and are skipped, by design.
#
# The box is anchored to the CREST, not to "ink near the corner". The first
# version grew a box around every non-white pixel in a corner rectangle, which
# swallowed the bail of the Lao Tzu dangles and the gold bail of the yin-yang
# tag - both on plain white, both wrongly skipped. Navy is unique to the shield
# in this corner, so the shield is found first and the box then grows DOWN ONLY,
# inside the shield's own x-range, to pick up the ORLOFF OF DENMARK wordmark.
# The piece is never inside that column, so it can never widen the box.

$SCAN_W   = 0.34   # how far right to look for the shield
$SCAN_H   = 0.34   # how far down to look for the shield
$WHITE    = 244    # min channel to count as background
$PAD      = 6      # margin added around the stamp
$RING     = 10     # width of the ring checked for uniformity outside the box
$GAP      = 14     # consecutive clean rows that end the wordmark

function Get-Pixels([System.Drawing.Bitmap]$bmp) {
  $r = New-Object System.Drawing.Rectangle 0,0,$bmp.Width,$bmp.Height
  $d = $bmp.LockBits($r, [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
                     [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $bytes = New-Object byte[] ($d.Stride * $bmp.Height)
  [System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $bytes, 0, $bytes.Length)
  $bmp.UnlockBits($d)
  return @{ b = $bytes; stride = $d.Stride }
}

$files = Get-ChildItem $Src -File -Include *.jpg,*.jpeg -Recurse
$report = @()

foreach ($f in $files) {
  $bmp = $null
  try { $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName) } catch { continue }
  $W = $bmp.Width; $H = $bmp.Height
  $px = Get-Pixels $bmp; $buf = $px.b; $stride = $px.stride

  $sw = [int]($W * $SCAN_W); $sh = [int]($H * $SCAN_H)

  # --- 1. find the shield by its navy, and confirm the gold ---
  $nX0 = [int]::MaxValue; $nY0 = [int]::MaxValue; $nX1 = -1; $nY1 = -1
  $navy = 0; $gold = 0
  for ($y = 0; $y -lt $sh; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $sw; $x++) {
      $i = $row + $x * 3
      $B = $buf[$i]; $G = $buf[$i+1]; $R = $buf[$i+2]
      if ($B -gt ($R + 45) -and $B -gt 70) {
        $navy++
        if ($x -lt $nX0) { $nX0 = $x }; if ($x -gt $nX1) { $nX1 = $x }
        if ($y -lt $nY0) { $nY0 = $y }; if ($y -gt $nY1) { $nY1 = $y }
      }
      if ($R -gt 140 -and $G -gt 100 -and $B -lt 100) { $gold++ }
    }
  }

  if ($navy -lt 300 -or $gold -lt 100) {
    $report += [pscustomobject]@{ File=$f.Name; Verdict='no-crest'; Box=''; W=0; H=0; Navy=$navy; Gold=$gold; Detail='no crest in the corner' }
    $bmp.Dispose(); continue
  }

  # --- 2. grow the stamp outwards until it is ringed by white ---
  # The wordmark is wider than the shield, so the box cannot be capped at the
  # shield's width. Grow instead: extend an edge while ink appears within GAP
  # pixels of it, and stop at the first clear gap. The stamp is separated from
  # the jewellery by white, so growth halts before it reaches the piece. If a
  # piece ever sat closer than GAP, the surround test below rejects the file.
  $left = $nX0; $right = $nX1; $bottom = $nY1; $top = 0
  function Test-Ink($buf,$stride,$WHITE,$x,$y) {
    $i = $y * $stride + $x * 3
    return ($buf[$i] -lt $WHITE -or $buf[$i+1] -lt $WHITE -or $buf[$i+2] -lt $WHITE)
  }
  $changed = $true; $guard = 0
  while ($changed -and $guard -lt 400) {
    $changed = $false; $guard++

    for ($d = 1; $d -le $GAP; $d++) {
      $x = $right + $d; if ($x -ge $W) { break }
      $hit = $false
      for ($y = $top; $y -le $bottom; $y++) { if (Test-Ink $buf $stride $WHITE $x $y) { $hit = $true; break } }
      if ($hit) { $right = $x; $changed = $true }
    }
    for ($d = 1; $d -le $GAP; $d++) {
      $x = $left - $d; if ($x -lt 0) { break }
      $hit = $false
      for ($y = $top; $y -le $bottom; $y++) { if (Test-Ink $buf $stride $WHITE $x $y) { $hit = $true; break } }
      if ($hit) { $left = $x; $changed = $true }
    }
    for ($d = 1; $d -le $GAP; $d++) {
      $y = $bottom + $d; if ($y -ge $H) { break }
      $hit = $false
      for ($x = $left; $x -le $right; $x++) { if (Test-Ink $buf $stride $WHITE $x $y) { $hit = $true; break } }
      if ($hit) { $bottom = $y; $changed = $true }
    }
  }

  $x0 = [Math]::Max(0, $left - $PAD);       $y0 = 0
  $x1 = [Math]::Min($W - 1, $right + $PAD); $y1 = [Math]::Min($H - 1, $bottom + $PAD)

  # --- 4. is the surround plain? ---
  $rx0 = [Math]::Max(0, $x0 - $RING); $ry0 = [Math]::Max(0, $y0 - $RING)
  $rx1 = [Math]::Min($W - 1, $x1 + $RING); $ry1 = [Math]::Min($H - 1, $y1 + $RING)
  $sum = 0; $n = 0; $minV = 255; $dirty = 0
  for ($y = $ry0; $y -le $ry1; $y++) {
    for ($x = $rx0; $x -le $rx1; $x++) {
      if ($x -ge $x0 -and $x -le $x1 -and $y -ge $y0 -and $y -le $y1) { continue }
      $i = $y * $stride + $x * 3
      $v = [Math]::Min([Math]::Min($buf[$i], $buf[$i+1]), $buf[$i+2])
      $sum += $v; $n++
      if ($v -lt $minV) { $minV = $v }
      if ($v -lt $WHITE) { $dirty++ }
    }
  }
  $dirtyPct = if ($n) { [Math]::Round(100.0 * $dirty / $n, 1) } else { 100 }

  # A textured background lets the grow run to the edge of the frame, and then the
  # ring is off-image and passes vacuously - which would white out the whole
  # photograph. The stamp measures at most 206x273 on the 1001px files, so
  # anything much larger is a runaway, not a stamp.
  $bw = $x1 - $x0 + 1; $bh = $y1 - $y0 + 1
  $tooBig = ($bw -gt ($W * 0.30)) -or ($bh -gt ($H * 0.35))

  $safe = ($dirtyPct -le 1.0) -and ($minV -ge 235) -and ($n -gt 0) -and (-not $tooBig)

  $why = @()
  if ($tooBig)           { $why += "grow ran away ($bw x $bh) - background is not plain" }
  if ($dirtyPct -gt 1.0) { $why += "surround not plain ($dirtyPct% non-white)" }
  if ($minV -lt 235)     { $why += "dark pixel touching the stamp (min $minV)" }

  $verdict = if ($safe) { 'FILL-SAFE' } else { 'needs-repaint' }
  $report += [pscustomobject]@{
    File=$f.Name; Verdict=$verdict
    Box="$x0,$y0 -> $x1,$y1"; W=($x1-$x0+1); H=($y1-$y0+1)
    Navy=$navy; Gold=$gold; Detail=($why -join '; ')
  }

  if ($safe -and $Apply) {
    if (-not (Test-Path $Out)) { New-Item -ItemType Directory -Force $Out | Out-Null }
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    # Paint with the surround's own value, not pure #fff, so the patch still
    # matches if the sweep is a shade off white.
    $avg = [int][Math]::Round($sum / $n)
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($avg,$avg,$avg))
    $g.FillRectangle($brush, $x0, $y0, ($x1-$x0+1), ($y1-$y0+1))
    $g.Dispose(); $brush.Dispose()
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $ps = New-Object System.Drawing.Imaging.EncoderParameters 1
    $ps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, 95L)
    $bmp.Save((Join-Path $Out $f.Name), $enc, $ps)
    $ps.Dispose()
  }
  $bmp.Dispose()
}

$report | Export-Csv 'C:\Users\Niels.v\AppData\Local\Temp\claude\E--\1a2ef45c-758e-43a8-8ce9-369a0b031963\scratchpad\decrest-report.csv' -NoTypeInformation -Encoding UTF8
Write-Output ("scanned: " + $report.Count)
$report | Group-Object Verdict | Select-Object Count,Name | Format-Table -AutoSize
Write-Output "--- box sizes actually used ---"
$report | Where-Object { $_.Verdict -eq 'FILL-SAFE' } | Group-Object { "$($_.W)x$($_.H)" } | Sort-Object Count -Descending | Select-Object -First 6 Count,Name | Format-Table -AutoSize
Write-Output "--- still skipped, by reason ---"
$report | Where-Object { $_.Verdict -eq 'needs-repaint' } | ForEach-Object {
  $m=[regex]::Match($_.Detail,'not plain \(([\d.]+)%'); $p = if($m.Success){[double]$m.Groups[1].Value}else{-1}
  if($p -ge 50){'coloured or ribbon background'} elseif($p -ge 0){'mostly white but something touches the stamp'} else {'other'}
} | Group-Object | Select-Object Count,Name | Format-Table -AutoSize
