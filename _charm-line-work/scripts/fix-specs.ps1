$ErrorActionPreference = 'Stop'
$s = 'C:\Users\Niels.v\AppData\Local\Temp\claude\E--\1a2ef45c-758e-43a8-8ce9-369a0b031963\scratchpad'

$live = Get-Content "$s\live4.json" -Raw | ConvertFrom-Json
$rows = Import-Csv 'E:\shopify-charm-line-a.csv' | Where-Object { $_.'Body (HTML)' -ne '' }
$inv  = Import-Csv 'E:\_charm-line-work\data\invoice_extracted.csv' -Header 'row','model','material','metal','stone','size','weight','qty','cost','ext','raw'

# Products where the "stone" column actually captured a MATERIAL fragment
# ("CZ+Enamel", "+Enamel"). The true stone lives in the invoice's raw pipe list.
$materialAsStone = @{}
foreach ($r in $rows) {
    $v = ([regex]::Match($r.'Body (HTML)','<strong>Stone:</strong>\s*([^<]*)')).Groups[1].Value.Trim()
    if ($v -match '^\+?CZ\+Enamel$|^\+Enamel$') {
        $i = $inv | Where-Object { $_.model -eq $r.'Variant SKU' } | Select-Object -First 1
        if ($i) {
            $f = ($i.raw -split '\|' | Where-Object { $_ -match 'Stone\s*:' } | Select-Object -First 1)
            if ($f) { $materialAsStone[$r.Handle] = ($f -replace '\s+',' ').Trim() }
        }
    }
}
# This one was truncated mid-value by the extractor; the invoice continues it on
# the next physical line (inv_table.txt, row 211). Set verbatim.
$LITERAL = @{ 'hot-air-balloon-charm' = 'Pink &amp; White CZ, Green, Pink, Yellow &amp; Blue Enamel' }

function Format-List2([string]$v) {
    # Split on + and & into items, then rejoin in list style:
    # 1 item -> as is; 2 -> "A & B"; 3+ -> "A, B & C".
    $v = $v -replace '&amp;', '&'
    $parts = @($v -split '\s*[+&]\s*' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' })
    if ($parts.Count -eq 0) { return '' }
    if ($parts.Count -eq 1)      { $out = $parts[0] }
    elseif ($parts.Count -eq 2)  { $out = $parts[0] + ' & ' + $parts[1] }
    else { $out = ($parts[0..($parts.Count-2)] -join ', ') + ' & ' + $parts[-1] }
    $out = $out -replace '(?i)\bmu(l)?ti-?colou?rs?\b', 'Multicolour'
    $out = ($out -split ' ' | ForEach-Object {
        if ($_ -cmatch '^[a-z]') { $_.Substring(0,1).ToUpper() + $_.Substring(1) } else { $_ }
    }) -join ' '
    $out = $out -replace '\s{2,}', ' '
    return ($out -replace '&', '&amp;')
}

$results = @()
foreach ($r in $rows) {
    $h = $r.Handle
    $b = if ($live.PSObject.Properties.Name -contains $h) { $live.$h } else { $r.'Body (HTML)' }
    $orig = $b

    # --- Stone row -------------------------------------------------------
    $m = [regex]::Match($b, '<strong>Stone:</strong>\s*(?<val>[^<]*)(?<post><br>\r?\n?|</p>)')
    if ($m.Success) {
        $val = $m.Groups['val'].Value.Trim()
        if ($materialAsStone.ContainsKey($h)) { $val = $materialAsStone[$h] }

        $stone = $null; $enamel = $null
        if     ($val -match '^Stone:\s*NA\s*/\s*Enamel:\s*(?<e>.+)$')        { $enamel = $Matches['e'] }
        elseif ($val -match '^Stone:\s*(?<v>.*?)\s*/\s*Enamel:\s*(?<e>.+)$') { $stone = $Matches['v']; $enamel = $Matches['e'] }
        elseif ($val -match '^Stone:\s*(?<v>.*)$')                           { $stone = $Matches['v'] }
        else                                                                 { $stone = $val }

        $lines = @()
        if ($LITERAL.ContainsKey($h)) {
            $lines += "<strong>Stone:</strong> " + $LITERAL[$h]
        } else {
            if ($stone)  { $f = Format-List2 $stone;  if ($f -and $f -notmatch '^(None|Na|N/A)$') { $lines += "<strong>Stone:</strong> $f" } }
            if ($enamel) { $f = Format-List2 $enamel; if ($f -and $f -notmatch '^(None|Na|N/A)$') { $lines += "<strong>Enamel:</strong> $f" } }
        }

        $post = $m.Groups['post'].Value
        if ($lines.Count -eq 0) {
            $b = $b.Remove($m.Index, $m.Length)
        } else {
            $repl = ($lines -join "<br>`n") + $post
            $b = $b.Remove($m.Index, $m.Length).Insert($m.Index, $repl)
        }
    }

    # --- Finish row ------------------------------------------------------
    $mf = [regex]::Match($b, '<strong>Finish:</strong>\s*(?<val>[^<]*)(?<post><br>\r?\n?|</p>)')
    if ($mf.Success) {
        $fv  = $mf.Groups['val'].Value.Trim()
        $new = $fv
        $new = $new -replace '^Oxidized Silver,\s*Highly$', 'Heavily Oxidized Silver'
        $new = $new -replace '^Silver Oxidation$',          'Oxidized Silver'
        $new = $new -replace 'Rhodium Plating',             'Rhodium Plated'
        $new = $new -replace 'Silver Plating',              'Silver Plated'
        $new = $new -replace 'Rosegold',                    'Rose Gold'
        $new = $new -replace '&amp;', '&'
        $new = $new -replace '\s*&\s*', ' &amp; '
        $new = $new -replace '\s{2,}', ' '
        if ($new -ne $fv) {
            $repl = "<strong>Finish:</strong> $new" + $mf.Groups['post'].Value
            $b = $b.Remove($mf.Index, $mf.Length).Insert($mf.Index, $repl)
        }
    }

    if ($b -ne $orig) {
        $results += [pscustomobject]@{
            handle    = $h
            oldStone  = ([regex]::Match($orig,'<strong>Stone:</strong>\s*([^<]*)')).Groups[1].Value.Trim()
            newStone  = ([regex]::Match($b,   '<strong>Stone:</strong>\s*([^<]*)')).Groups[1].Value.Trim()
            newEnamel = ([regex]::Match($b,   '<strong>Enamel:</strong>\s*([^<]*)')).Groups[1].Value.Trim()
            oldFinish = ([regex]::Match($orig,'<strong>Finish:</strong>\s*([^<]*)')).Groups[1].Value.Trim()
            newFinish = ([regex]::Match($b,   '<strong>Finish:</strong>\s*([^<]*)')).Groups[1].Value.Trim()
            html      = $b
        }
    }
}

$results | Select-Object handle,oldStone,newStone,newEnamel,oldFinish,newFinish |
    Export-Csv "$s\spec-fix-preview.csv" -NoTypeInformation -Encoding UTF8
$results | ConvertTo-Json -Depth 3 | Set-Content "$s\spec-fix-payload.json" -Encoding UTF8

Write-Output ("products changed: " + $results.Count)
Write-Output "=== Finish transitions ==="
$results | Where-Object { $_.oldFinish -ne $_.newFinish } |
    Group-Object { '"' + $_.oldFinish + '" -> "' + $_.newFinish + '"' } |
    Sort-Object Count -Descending | Select-Object Count,Name | Format-Table -AutoSize -Wrap
Write-Output "=== sanity: any residual junk in the new HTML? ==="
$bad = $results | Where-Object { $_.html -match 'Stone:</strong>\s*Stone:|Muti|Multicolor\b|Multi-Colors|\+|Rosegold|Oxidized Silver, Highly|Rhodium Plating|&amp;amp;|<strong>(Stone|Enamel):</strong>\s*(<br>|</p>)' }
Write-Output ("residual: " + $bad.Count)
$bad | Select-Object handle,newStone,newEnamel,newFinish | Format-Table -AutoSize
Write-Output "=== sample output ==="
($results | Where-Object { $_.handle -eq 'hot-air-balloon-charm' }).html
Write-Output '---'
($results | Where-Object { $_.handle -eq 'heart-charm-light-blue-enamel' }).html
Write-Output '---'
($results | Where-Object { $_.handle -eq 'primrose-charm-light-blue' }).html
Write-Output '---'
($results | Where-Object { $_.handle -eq 'tree-of-life-charm-engraved' }).html
