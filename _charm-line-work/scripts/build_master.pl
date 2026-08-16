#!/usr/bin/perl
# Build the Line A master from the verified invoice extraction.
#
# Decisions confirmed by Viktor 30 Jul 2026:
#   1. v2 short description style approved
#   2. Quote charm names shortened; the quote stays verbatim in the description
#   3. No ORL- prefix. SKU is the model number.
#   4. Taxonomy list confirmed
#   5. Charms with no photography are kept in a separate group
use strict; use warnings;

my %ZODIAC = (Ari=>'Aries', Tau=>'Taurus', Gem=>'Gemini', Cnc=>'Cancer',
  Leo=>'Leo', Vir=>'Virgo', Lib=>'Libra', Sco=>'Scorpio', Sgr=>'Sagittarius',
  Cap=>'Capricorn', Agr=>'Aquarius', Psc=>'Pisces');

my %BIRTH = (R=>['January','Garnet'], P=>['February','Amethyst'], Q=>['March','Aquamarine'],
  W=>['April','White'], LV=>['May','Emerald'], PL=>['June','Alexandrite'],
  M=>['July','Ruby'], G=>['August','Peridot'], BL=>['September','Sapphire'],
  F=>['October','Tourmaline'], X=>['November','Yellow Topaz'], L=>['December','Turquoise']);

my %BCOLOUR = (W=>'White', R=>'Red', K=>'Black', B=>'Blue', G=>'Flower');

# name, category, description sentence(s). Named from the product photography.
my %SPACER = (
  'ORPA0010' => ['Fluted Clip, Clear Stone', 'A fluted silver band set with a single clear stone. Clips grip the chain, so your charms stay where you put them.'],
  'ORPA034'  => ['Polished Dome Spacer', 'A plain polished dome in 925 sterling silver. Sits between charms to give them room.'],
  'ORPA0035' => ['Polished Spacer, Pink Stone', 'A polished silver band set with a single pink stone. Sits between charms to give them room.'],
  'ORPA0094' => ['Pink Enamel Spacer', 'A slim silver ring finished in pale pink enamel. Sits between charms to give them room.'],
  'ORPA0097' => ['Lilac Daisy Spacer', 'Daisies in lilac and white enamel with clear stone centres, set around a silver ring.'],
  'ORPA0107' => ['Dragonfly Clip, Blue Enamel', 'A silver dragonfly with pale blue enamel wings. Clips grip the chain, so your charms stay where you put them.'],
  'ORPA0123' => ['Starry Night Spacer, Blue Enamel', 'Deep blue enamel with silver stars and a crescent moon.'],
  'ORPA0132' => ['Butterfly Clip, Red Stone', 'A butterfly set with clear stones beside an oval red stone. Clips grip the chain, so your charms stay where you put them.'],
  'ORPA0142' => ['Tulip Spacer, Pink Stone', 'Oxidized tulips with a pink stone at the bud, set around a polished silver ring.'],
  'ORPA0147' => ['Butterfly Spacer, Clear Stones', 'Two oxidized butterflies with clear stones, set around a polished silver ring.'],
  'ORPA0149' => ['Scroll Spacer, Oxidized Silver', 'A repeating scroll pattern in oxidized silver on a polished band.'],
);

# Short titles for the engraved quote tags. Full quote goes in the description.
my %QUOTE_TITLE = (
  'ORGCB182-1'=>'Discipline', 'ORGCB182-2'=>'Happiness', 'ORGCB182-3'=>'Friendship',
  'ORGCB182-5'=>'Knowledge', 'ORGCB182-6'=>'Education', 'ORGCB182-7'=>'Purpose',
  'ORGCB182-8'=>'Wisdom',
  'ORGCB184-1'=>'The Journey', 'ORGCB184-2'=>'Freedom', 'ORGCB184-3'=>'Silence',
  'ORGCB184-4'=>'The Flame', 'ORGCB184-5'=>'Love', 'ORGCB184-6'=>'The Traveller',
  'ORGCB184-7'=>'Calm',
  'ORGCB186-1'=>'A Smile', 'ORGCB186-2'=>'The Mirror',
  'ORGCB187-14K-1'=>'The Moon', 'ORGCB187-14K-2'=>'Possible',
);

sub csvsplit { my @f; my $c=''; my $q=0;
  for my $ch (split //, shift) {
    if ($ch eq '"') { $q=!$q } elsif ($ch eq ',' && !$q) { push @f,$c; $c='' } else { $c.=$ch } }
  push @f,$c; @f }

sub handle { my $s = lc shift; $s =~ s/["'.,]//g; $s =~ s/[^a-z0-9]+/-/g; $s =~ s/^-|-$//g; $s }

# House style. No em dashes. Two or three short sentences, then the spec block.
sub describe {
    my ($body, $f, $type) = @_;
    my $P = '<p style="font-family: Inter, sans-serif;">';
    my @spec = ("<strong>Material:</strong> 925 Sterling Silver");
    push @spec, "<strong>Finish:</strong> $f->{finish}"          if $f->{finish} =~ /\S/;
    push @spec, "<strong>Stone:</strong> $f->{stone}"            if $f->{stone}  =~ /\S/;
    push @spec, ($type eq 'Bracelet' ? "<strong>Length:</strong> $f->{size}"
                                     : "<strong>Size:</strong> $f->{size}")  if $f->{size} =~ /\S/;
    push @spec, "<strong>Weight:</strong> $f->{weight}g"         if $f->{weight} =~ /\S/;
    my $fit = $type eq 'Bracelet' ? 'Takes all Orloff charms.'
                                  : 'Fits all Orloff snake chain bracelets.';
    return join("\n\n",
        "$P$body</p>",
        $P . join("<br>\n", @spec) . "</p>",
        "$P<strong>$fit</strong></p>",
        "$P<strong>ORLOFF OF DENMARK.</strong></p>");
}

# row -> invoice image
my %rowimg;
if (open my $ri, '<', 'invoice_row_images.tsv') { <$ri>;
    while (<$ri>) { chomp; my @c = split /\t/; $rowimg{$c[0]} = $c[3] if defined $c[3] } close $ri }

# Dangle charms identified by eye from the invoice photographs.
my %DANGLE;
for my $src ('dangle_ids.tsv', 'charm_ids.tsv') {
    next unless open my $dg, '<', $src;
    <$dg>;
    while (<$dg>) { chomp; s/\r$//; my @c = split /\t/;
        next unless $c[0];
        $DANGLE{$c[0]} = { name=>$c[1], cat=>$c[2]//'', conf=>$c[3]//'', note=>$c[4]//'' } }
    close $dg;
}

# SKUs that have real product photography
my %HASPHOTO;
if (open my $m, '<', 'image_sku_map.csv') { <$m>;
    while (<$m>) { my @c = csvsplit($_); $HASPHOTO{$c[0]} = 1 if defined $c[1] && $c[1] eq 'YES' } close $m }

open my $in, '<', 'invoice_appendix_a.csv' or die $!;
my $hdr = <$in>; my @out;
while (my $l = <$in>) {
    chomp $l; $l =~ s/\r$//; next unless $l =~ /\S/;
    my @f = csvsplit($l);
    my ($row,$model,$mat,$fin,$stone,$size,$w,$q,$u,$tot,$raw) = @f;
    $stone =~ s/^\s*Main\s+Stone\s*:\s*//i;
    $fin   =~ s/^\s*(?:Metal|Plaing|Plating)\s*:?\s*//i;
    s/^\s+|\s+$//g for ($stone,$fin,$mat,$size);

    # Tidy the invoice's shorthand for display.
    # "Rhodium plated+sand effect" -> "Rhodium Plated, Sand Effect"
    $fin =~ s/\s*\+\s*/, /g;
    $fin =~ s/(\w+)/\u\L$1/g;
    $fin =~ s/\bCz\b/CZ/g; $fin =~ s/\b18k\b/18K/gi; $fin =~ s/\b14k\b/14K/gi;
    # The invoice misspells "plating" two different ways.
    $fin =~ s/\bPalting\b/Plating/gi; $fin =~ s/\bPlaing\b/Plating/gi;
    # "12*17*2.5mm" -> "12 x 17 x 2.5mm";  "8.2*10.3mm" -> "8.2 x 10.3mm"
    $size =~ s/\s*\*\s*/ x /g;
    $size =~ s/(\d)\s+(cm|mm)\b/$1$2/g;          # "17 cm" -> "17cm"
    $size .= 'mm' if $size =~ /\d/ && $size !~ /(mm|cm|inch)/i;   # bare "4.4 x 10.2"

    my ($name,$type,$cat,$tier,$note,$body) = ('','Charm','','','','');

    my $quote = '';
    if ($model =~ /^ORGCB(182|184|186|187)/) {
        my @v = split / \| /, $raw;
        my @keep = grep { !/^925 Sterling/ && !/^Metal[:\s]/i && !/^[\d.]+\s*[*x]/ && !/^enamel$/i } @v;
        $quote = join ' ', @keep; $quote =~ s/\s+/ /g; $quote =~ s/^\s+|\s+$//g;
        $quote =~ s/\s*[-\x{2013}]?\s*(Aristotle|Lao\s*Tzu)\s*$//i;
        $quote =~ s/^\s*"+\s*|\s*"+\s*$//g; $quote =~ s/^\s+|\s+$//g;
    }

    if ($model =~ /^ORCBB01-(\d+)$/) {
        $name = "Snake Chain Bracelet, $1cm"; $type='Bracelet'; $tier='Base';
        $body = "A ${1}cm snake chain in 925 sterling silver with a round clasp set with clear stones. Rhodium plated.";
    }
    elsif ($model =~ /^ORGCBB1-(\d+)-([A-Z]+)$/) {
        my ($sz,$c) = ($1,$BCOLOUR{$2});
        $name = "Snake Chain Bracelet with Enamel Accent, ${sz}cm, $c";
        $type='Bracelet'; $tier='Base';
        $body = lc($c) eq 'flower'
            ? "A ${sz}cm sterling silver snake chain with a flower enamel bead at the clasp. Rhodium plated."
            : "A ${sz}cm sterling silver snake chain with a " . lc($c) . " enamel bead at the clasp. Rhodium plated.";
        $note = 'Model as real Shopify variants (Colour x Size), per Appendix A9';
    }
    elsif ($model =~ /^ORCB183-([A-Z])$/) {
        $name = "Letter $1 Charm"; $cat='Personal — Letters'; $tier='Classic';
        $body = "The letter $1 in 925 sterling silver with an oxidized finish. Wear a single initial, or spell out a name.";
        $note = 'Invoice Size field blank; series default 10.5mm unconfirmed' if $size !~ /\S/;
    }
    elsif ($model =~ /^ORCB32-(\w+)$/ && $ZODIAC{$1}) {
        my $s = $ZODIAC{$1};
        $name = "$s Zodiac Charm"; $cat='Personal — Zodiac'; $tier='Signature';
        $body = "The $s sign in 925 sterling silver, oxidized and set with blue enamel. One of twelve in the zodiac series.";
        $note = 'Invoice spells Aquarius as Agr; SKU keeps the invoice spelling' if $1 eq 'Agr';
    }
    elsif ($model =~ /^ORCB33-(\w+)$/ && $BIRTH{$1}) {
        my ($mo,$st) = @{$BIRTH{$1}};
        $name = "$mo Birthstone Charm, $st"; $cat='Personal — Birthstone'; $tier='Classic';
        my $sn = $st eq 'White' ? 'white stone' : lc $st;
        $body = "A 3mm $sn set in oxidized 925 sterling silver. ${mo}'s birthstone, one of twelve in the series.";
        $stone = "3mm $st";
        $note = 'PRODUCT DEFECT: the charm is engraved "Augest", not "August". Confirm before listing.' if $mo eq 'August';
    }
    elsif ($SPACER{$model}) {
        ($name, $body) = @{$SPACER{$model}};
        $cat='Spacers & Clips'; $tier='Classic';
        $note = 'Named and described from the product photograph';
        $note .= '; invoice says ORPA034, image file says PA0034' if $model eq 'ORPA034';
    }
    elsif ($quote) {
        my $who = $model =~ /^ORGCB182/ ? 'Aristotle' : $model =~ /^ORGCB184/ ? 'Lao Tzu' : '';
        my $t = $QUOTE_TITLE{$model} // 'Engraved';
        $name = $who ? "$who Quote Charm, $t" : "Engraved Quote Charm, $t";
        $cat = 'Milestones & Sentiment'; $tier='Statement';
        $body = $who
            ? "A hanging tag engraved with \"$quote\", attributed to $who. Rhodium plated with a sand effect finish."
            : "A hanging tag engraved with \"$quote\". Rhodium plated with a sand effect finish.";
        $note = 'Quote text taken verbatim from the invoice';
    }
    elsif (my $d = $DANGLE{$model}) {
        # Identified from the invoice photograph. Anything marked HOLD is
        # religious or national iconography and is deliberately left unnamed:
        # the handoff calls careless naming here a reputational risk in Thailand.
        if ($d->{cat} eq 'HOLD' || $d->{conf} eq 'LOW' || $d->{name} =~ /RELIGIOUS|Not yet identified/) {
            $note = "HOLD, not named: $d->{note}";
        } else {
            $name = $d->{name}; $cat = $d->{cat}; $tier = 'Statement';
            $body = $d->{note};
            $body =~ s/\s*(CONFIRM|DO NOT PUBLISH).*$//;
            $body =~ s/\s+$//;
            $body .= '.' unless $body =~ /[.!?]$/;
            $note = "Identified from the invoice photograph, confidence $d->{conf}";
            $note .= '. NEEDS CONFIRMATION' if $d->{conf} ne 'high';
        }
    }
    else {
        $note = 'No photography. Needs visual identification before naming.';
    }

    my $sku = $model;
    # Appendix A: write the SKU in canonical OR form whatever the invoice prints.
    $sku = 'ORGCB56-R' if $model eq 'GCB56-R';
    if ($model eq 'ORCB176') {
        # Resolved 30 Jul 2026 by comparing the two invoice photographs: rows
        # 222 and 491 show the SAME tree of life bead, same 2.6g, same 11mm.
        # The handoff assumed two different products. It is one product ordered
        # twice at different unit prices. Left unnamed pending Viktor's call on
        # whether to merge, because merging changes stock and cost.
        # SKU left blank on both rows: two rows sharing one SKU would fail the
        # Shopify import, so nothing ships until the merge decision is made.
        $sku = ''; $name=''; $body='';
        $note = 'ONE PRODUCT, NOT TWO. Rows 222 and 491 show the same tree of life bead '
              . '(same 2.6g, same 11mm, same subject) at different unit prices, $7.22 for '
              . '30pcs and $7.48 for 20pcs. Recommend a single SKU with 50 pieces at a '
              . 'blended cost of $7.32. Your decision; nothing merged.';
    }

    # Pricing, approved by Viktor 30 Jul 2026.
    # Charms banded on invoice unit cost; bracelets one price at every length,
    # set at 80% of Pandora Thailand's ฿3,500 snake chain.
    # THB drives the Thai POS. USD drives the Shopify storefront, which is a
    # USD store: these are not conversions of each other but separate retail
    # numbers, set slightly above raw conversion because the online market is
    # international where Pandora's own prices run higher.
    my ($thb, $usd) = ('', '');
    if ($type eq 'Bracelet') { $tier = 'Base'; $thb = 2800; $usd = 89 }
    elsif ($u =~ /^[\d.]+$/ && $u > 0) {
        if    ($u <  4.50) { $tier = 'Classic';   $thb = 900;  $usd = 29 }
        elsif ($u <  6.50) { $tier = 'Signature'; $thb = 1200; $usd = 39 }
        else               { $tier = 'Statement'; $thb = 1600; $usd = 49 }
    }

    my $desc = $body ? describe($body, {finish=>$fin, stone=>$stone, size=>$size, weight=>$w}, $type) : '';
    my $seo_t = $name ? "$name | Orloff of Denmark" : '';
    my $seo_d = $body ? ($body =~ /^(.{0,150}?[.])\s/ ? $1 : $body) : '';

    push @out, {
        group => ($HASPHOTO{$model} ? 'A' : 'B'),
        row=>$row, model=>$model, sku=>$sku, handle=>($name?handle($name):''),
        name=>$name, line=>'A', type=>$type, cat=>$cat, tier=>$tier, thb=>$thb, usd=>$usd,
        cost=>$u, weight=>$w, size=>$size, material=>$mat, finish=>$fin, stone=>$stone,
        stock=>$q, desc=>$desc, img=>'', seo_t=>$seo_t, seo_d=>$seo_d,
        quote=>$quote, invimg=>($rowimg{$row}//''), note=>$note };
}
close $in;

my @cols = qw(invoice_row model_no sku handle product_name line type category price_tier retail_thb
              retail_usd cost_usd weight_g size_mm material metal_finish stone stock_qty description_html
              image_url_1 seo_title seo_description quote_text invoice_image notes);
my @keys = qw(row model sku handle name line type cat tier thb usd cost weight size material finish
              stone stock desc img seo_t seo_d quote invimg note);

for my $g (['A','master_ready.csv'], ['B','master_no_photo.csv']) {
    my ($grp,$file) = @$g;
    open my $o, '>', $file or die $!;
    print $o join(',', @cols), "\n";
    for my $r (grep { $_->{group} eq $grp } @out) {
        print $o join(',', map { my $v = $r->{$_} // ''; $v =~ s/"/""/g; $v =~ /[",\n]/ ? qq{"$v"} : $v } @keys), "\n";
    }
    close $o;
}

my $named = grep { $_->{name} =~ /\S/ } @out;
my $desc  = grep { $_->{desc} =~ /\S/ } @out;
printf "rows %d | named %d | described %d | group A (has photo) %d | group B (no photo) %d\n",
    scalar @out, $named, $desc,
    scalar(grep { $_->{group} eq 'A' } @out), scalar(grep { $_->{group} eq 'B' } @out);
