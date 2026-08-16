$ErrorActionPreference = 'Stop'
$s = 'C:\Users\Niels.v\AppData\Local\Temp\claude\E--\1a2ef45c-758e-43a8-8ce9-369a0b031963\scratchpad'

$rows = @(
  @{ gid='gid://shopify/Collection/670160421154'; handle='all-charms'; title='ALL CHARMS'
     tag='One bracelet. Every story.'
     p1='Every charm in the Orloff collection, designed in house and engraved on the bail. Danish icons, Thai motifs, animals, flowers and keepsakes. Each one threads onto any Orloff snake chain bracelet.'
     p2='Start with one. Add to it for years.' },
  @{ gid='gid://shopify/Collection/670160453922'; handle='animal-charms'; title='ANIMAL CHARMS'
     tag='Small creatures, carefully made.'
     p1='Elephants, owls, flamingos, pandas and dogs, worked in 925 sterling silver with enamel and stone detail.'
     p2='Small enough to collect. Made well enough to keep.' },
  @{ gid='gid://shopify/Collection/670160650530'; handle='birthstone-charms'; title='BIRTHSTONE CHARMS'
     tag='A stone for every month.'
     p1='A charm for every month, each set with a 3mm stone in oxidized 925 sterling silver. Garnet in January through turquoise in December.'
     p2='One for you, and one for everyone you would think of first.' },
  @{ gid='gid://shopify/Collection/670160388386'; handle='charm-bracelets'; title='CHARM BRACELETS'
     tag='The chain it all begins with.'
     p1='Snake chain bracelets in 925 sterling silver, made to carry Orloff charms. Available in 17, 19 and 21cm at one price, so the choice is wrist size rather than budget.'
     p2='The bracelet is the beginning. What goes on it is yours.' },
  @{ gid='gid://shopify/Collection/670160584994'; handle='letter-charms'; title='LETTER CHARMS'
     tag='An initial, or a whole name.'
     p1='The full alphabet in 925 sterling silver with an oxidized finish. Wear a single initial or spell out a name across the chain.'
     p2='Initials, names, or a word only you would understand.' },
  @{ gid='gid://shopify/Collection/670160519458'; handle='milestones-and-sentiment'; title='MILESTONES AND SENTIMENT'
     tag='Something to mark it by.'
     p1='Charms for the moments worth keeping. Birthdays, weddings, new babies, family and friendship, in 925 sterling silver.'
     p2='Given more often than they are bought.' },
  @{ gid='gid://shopify/Collection/670160486690'; handle='nature-charms'; title='NATURE CHARMS'
     tag='Growing things, held in silver.'
     p1='Flowers, trees of life, clovers and celestial pieces in 925 sterling silver, some in enamel and some set with stones.'
     p2='Quiet motifs that sit well beside anything else.' },
  @{ gid='gid://shopify/Collection/670160716066'; handle='spacers-and-clips'; title='SPACERS AND CLIPS'
     tag='The pieces that hold it together.'
     p1='Spacers give charms room to sit. Clips grip the chain so a group stays exactly where you place it. Both in 925 sterling silver.'
     p2='Small parts, and the reason the whole thing sits right.' },
  @{ gid='gid://shopify/Collection/670160683298'; handle='sparkle-and-classic'; title='SPARKLE AND CLASSIC'
     tag='The space between the stories.'
     p1='Pave beads, plain hearts and stars in 925 sterling silver. The quieter pieces that sit between the figural charms and let them breathe.'
     p2='Wear them alone, or use them to give the rest room.' },
  @{ gid='gid://shopify/Collection/670160552226'; handle='travel-and-lifestyle'; title='TRAVEL AND LIFESTYLE'
     tag='Wherever you have been.'
     p1='Cameras, coffee, cocktails and carousels. Charms for the places you go and the things you do, in 925 sterling silver.'
     p2='Collected the way postcards used to be.' },
  @{ gid='gid://shopify/Collection/670160617762'; handle='zodiac-charms'; title='ZODIAC CHARMS'
     tag='Your sign, in silver.'
     p1='All twelve star signs in oxidized sterling silver with blue enamel, each 11mm and sized to sit alongside the rest of the collection.'
     p2='Aries through Pisces, all made to the same size.' }
)

$eyebrow = "font-family: Inter, sans-serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #bc973f; margin: 0 0 14px;"
$h2a = "font-family: 'Cormorant Garamond', Cormorant, serif; font-size: 40px; font-weight: 400; color: #ffffff; letter-spacing: 0.06em; line-height: 1.3; margin: 0 auto 32px; text-align: center !important; width: 100%; display: block;"
$h2b = "font-family: 'Cormorant Garamond', Cormorant, serif; font-size: 24px; font-weight: 400; color: #ffffff; letter-spacing: 0.06em; line-height: 1.3; margin-bottom: 32px; font-style: italic; text-align: center !important; width: 100%; display: block;"
$body = "font-family: Inter, sans-serif; font-size: 16px; line-height: 1.9; color: #ffffff;"

$out = @()
foreach ($r in $rows) {
  $html = @"
<div style="background-color: #091b36; width: 100%; padding: 80px 20px; box-sizing: border-box;">
  <div style="max-width: 680px; margin: 0 auto; text-align: center;">
    <p style="$eyebrow">Orloff of Denmark</p>
    <h2 style="$h2a">$($r.title)</h2>
    <h2 style="$h2b"><em>$($r.tag)</em></h2>
    <div style="width: 40px; height: 1px; background: #f2f3f5; margin: 0 auto 32px;"></div>
    <p style="$body margin-bottom: 18px;">$($r.p1)</p>
    <p style="$body margin-bottom: 0;">$($r.p2)</p>
  </div>
</div>
"@
  $out += [pscustomobject]@{ handle = $r.handle; gid = $r.gid; html = $html.Trim() }
}

$out | ConvertTo-Json -Depth 3 | Set-Content "$s\bluebar-payload.json" -Encoding utf8

# emit one aliased mutation for all 11
$decl=@(); $bodyq=@(); $vars=[ordered]@{}; $k=0
foreach ($c in $out) { $k++
  $decl  += "`$i$k`: CollectionInput!"
  $bodyq += "m$k`:collectionUpdate(input:`$i$k){collection{handle} userErrors{field message}}"
  $vars["i$k"] = [ordered]@{ id = $c.gid; descriptionHtml = $c.html }
}
$q = "mutation B(" + ($decl -join ',') + "){" + ($bodyq -join '') + "}"
Set-Content "$s\bluebar.query.txt" -Value $q -Encoding utf8 -NoNewline
$j = ($vars | ConvertTo-Json -Depth 4 -Compress) -replace '\\u003c','<' -replace '\\u003e','>' -replace '\\u0026','&' -replace '\\u0027',"'"
Set-Content "$s\bluebar.vars.json" -Value $j -Encoding utf8 -NoNewline

Write-Output ("collections: " + $out.Count + "   vars bytes: " + (Get-Item "$s\bluebar.vars.json").Length)
Write-Output "=== sample (zodiac) ==="
($out | Where-Object { $_.handle -eq 'zodiac-charms' }).html
