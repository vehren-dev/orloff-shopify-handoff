#!/usr/bin/perl
# Generate platform exports from the master. Never author these by hand.
#
#   shopify-charm-line-a.csv   57-column OLD format, draft status
#   storehub-charm-line-a.csv  mapped onto Viktor's real 31-column template
#
# Only named SKUs are exported. The 29 unnamed (religious/national holds,
# ORCB04, the ORCB176 pair) are deliberately omitted: both platforms require a
# product name, and the ORCB176 rows have no SKU until the merge is decided.
use strict; use warnings;

my $FX = 34.0;   # THB per USD, for the cost column only

# Proper RFC4180 field parsing. A naive version that merely toggles on '"'
# silently eats escaped quotes, which turns style="..." into style=... and
# ships malformed HTML. Inside a quoted field, "" means one literal quote.
sub csvsplit {
    my $s = shift; my @f; my $c = ''; my $q = 0; my $i = 0; my $n = length $s;
    while ($i < $n) {
        my $ch = substr($s, $i, 1);
        if ($ch eq '"') {
            if ($q && substr($s, $i+1, 1) eq '"') { $c .= '"'; $i += 2; next }
            $q = !$q; $i++; next;
        }
        if ($ch eq ',' && !$q) { push @f, $c; $c = ''; $i++; next }
        $c .= $ch; $i++;
    }
    push @f, $c; return @f;
}

# read a CSV that may contain embedded newlines inside quoted fields
sub readcsv {
    my $file = shift;
    open my $fh, '<', $file or die "$file: $!";
    my $t = do { local $/; <$fh> }; close $fh;
    my (@recs, $cur, $q); $cur=''; $q=0;
    for my $ch (split //, $t) {
        if ($ch eq '"') { $q = !$q; $cur .= $ch }
        elsif ($ch eq "\n" && !$q) { push @recs, $cur; $cur='' }
        elsif ($ch eq "\r" && !$q) { }
        else { $cur .= $ch }
    }
    push @recs, $cur if $cur =~ /\S/;
    my @hdr = csvsplit(shift @recs);
    my @out;
    for my $r (@recs) { next unless $r =~ /\S/; my @f = csvsplit($r); my %h; @h{@hdr} = @f; push @out, \%h }
    return @out;
}

sub q_ { my $v = shift; $v = '' unless defined $v; $v =~ s/"/""/g; qq{"$v"} }
sub plain { my $h = shift; $h //= '';
    $h =~ s{</p>}{\n\n}gi; $h =~ s{<br\s*/?>}{\n}gi; $h =~ s/<[^>]+>//g;
    $h =~ s/\n{3,}/\n\n/g; $h =~ s/^\s+|\s+$//g; $h }

# Shopify CDN URLs. The files are already uploaded and every one resolves
# without the ?v= cache-buster, so the URLs are built from the manifest rather
# than paginated out of the Files API.
my $CDN = 'https://cdn.shopify.com/s/files/1/0852/4428/1122/files';
# image_manifest_final.tsv supersedes upload_manifest.tsv: for the 99 HD
# PICTURE SKUs the original pick led with INFORMATION spec sheets or model
# shots, so those were re-selected as plain white-background product shots and
# renamed -a to -d. Invoice-sourced SKUs keep their single verified file.
my %IMG;
if (open my $mf, '<', 'image_manifest_final.tsv') {
    <$mf>;
    while (<$mf>) { chomp; my ($sku,$pos,$tgt,$set) = split /\t/;
        next unless $sku && $tgt; $IMG{$sku}[$pos-1] = "$CDN/$tgt" }
    close $mf;
}
printf STDERR "SKUs with images: %d\n", scalar keys %IMG;

my @rows = (readcsv('master_ready.csv'), readcsv('master_no_photo.csv'));
@rows = grep { $_->{product_name} =~ /\S/ && $_->{sku} =~ /\S/ } @rows;
printf STDERR "exportable rows: %d\n", scalar @rows;

# ---------- bracelets become variant families ----------
# Appendix A9 is explicit that ORGCBB1 should be real variants rather than 14
# separate products. ORCBB01 gets the same treatment: same bracelet, three
# lengths, and now one price, so separate products would be poor navigation.
my (%fam, @single);
for my $r (@rows) {
    if    ($r->{model_no} =~ /^ORCBB01-(\d+)$/)        { push @{$fam{ORCBB01}}, [$r, 'Size', "$1cm", '', ''] }
    elsif ($r->{model_no} =~ /^ORGCBB1-(\d+)-([A-Z]+)$/) {
        my %c = (W=>'White', R=>'Red', K=>'Black', B=>'Blue', G=>'Flower');
        push @{$fam{ORGCBB1}}, [$r, 'Colour', $c{$2}, 'Size', "$1cm"];
    }
    else { push @single, $r }
}

# ---------- Shopify, 57-column OLD format ----------
my @SH = ('Handle','Title','Body (HTML)','Vendor','Product Category','Type','Tags','Published',
 'Option1 Name','Option1 Value','Option2 Name','Option2 Value','Option3 Name','Option3 Value',
 'Variant SKU','Variant Grams','Variant Inventory Tracker','Variant Inventory Qty',
 'Variant Inventory Policy','Variant Fulfillment Service','Variant Price','Variant Compare At Price',
 'Variant Requires Shipping','Variant Taxable','Variant Barcode','Image Src','Image Position',
 'Image Alt Text','Gift Card','SEO Title','SEO Description',
 'Google Shopping / Google Product Category','Google Shopping / Gender','Google Shopping / Age Group',
 'Google Shopping / MPN','Google Shopping / AdWords Grouping','Google Shopping / AdWords Labels',
 'Google Shopping / Condition','Google Shopping / Custom Product',
 'Google Shopping / Custom Label 0','Google Shopping / Custom Label 1','Google Shopping / Custom Label 2',
 'Google Shopping / Custom Label 3','Google Shopping / Custom Label 4',
 'Variant Image','Variant Weight Unit','Variant Tax Code','Cost per item',
 'Included / Thailand','Price / Thailand','Compare At Price / Thailand',
 'Included / International','Price / International','Compare At Price / International','Status');

sub grams { my $w = shift; $w //= ''; $w =~ s/[^\d.]//g; $w ne '' ? sprintf('%.0f', $w) : '' }

sub shopify_row {
    my ($r, %o) = @_;
    my %v;
    $v{'Handle'} = $o{handle};
    if ($o{first}) {
        $v{'Title'}   = $o{title};
        $v{'Body (HTML)'} = $r->{description_html};
        $v{'Vendor'}  = 'Orloff of Denmark';
        $v{'Product Category'} = 'Apparel & Accessories > Jewelry > Charms & Pendants';
        $v{'Type'}    = $r->{type};
        my @tags = grep { /\S/ } ($r->{category}, 'Line A', 'Charm Bracelet', '925 Silver');
        $v{'Tags'}    = join(', ', @tags);
        $v{'Published'} = 'FALSE';
        $v{'SEO Title'} = $r->{seo_title};
        $v{'SEO Description'} = $r->{seo_description};
        $v{'Gift Card'} = 'FALSE';
        $v{'Status'}  = 'draft';
    }
    # Position 1 image belongs to the product row; extra angles are emitted as
    # image-only rows afterwards. Each variant also points at its own picture.
    my $imgs = $IMG{$r->{sku}} || [];
    if ($o{first} && $imgs->[0]) {
        $v{'Image Src'} = $imgs->[0];
        $v{'Image Position'} = 1;
        $v{'Image Alt Text'} = $o{title};
    }
    $v{'Variant Image'} = $imgs->[0] if $o{variant_image} && $imgs->[0];
    $v{'Option1 Name'}  = $o{o1n}; $v{'Option1 Value'} = $o{o1v};
    $v{'Option2 Name'}  = $o{o2n}; $v{'Option2 Value'} = $o{o2v};
    $v{'Variant SKU'}   = $r->{sku};
    $v{'Variant Grams'} = grams($r->{weight_g});
    $v{'Variant Inventory Tracker'}  = 'shopify';
    $v{'Variant Inventory Qty'}      = $r->{stock_qty};
    $v{'Variant Inventory Policy'}   = 'deny';
    $v{'Variant Fulfillment Service'}= 'manual';
    # The Shopify store's currency is USD, so both price and cost are USD here.
    # THB belongs to StoreHub, which is the Thai till. They are separate retail
    # numbers, not conversions of each other.
    $v{'Variant Price'}              = $r->{retail_usd};
    $v{'Variant Requires Shipping'}  = 'TRUE';
    $v{'Variant Taxable'}            = 'TRUE';
    $v{'Variant Weight Unit'}        = 'g';
    $v{'Cost per item'} = ($r->{cost_usd} && $r->{cost_usd} =~ /^[\d.]+$/)
                          ? sprintf('%.2f', $r->{cost_usd}) : '';
    $v{'Status'} //= '';
    return join(',', map { q_($v{$_}) } @SH);
}

open my $shp, '>', 'shopify-charm-line-a.csv' or die $!;
print $shp join(',', map { q_($_) } @SH), "\n";
my ($sProducts, $sVariants, $sImages) = (0,0,0);

# an image-only row: handle plus picture, everything else blank
sub image_row {
    my ($handle, $url, $pos, $alt) = @_;
    my %v = ('Handle'=>$handle, 'Image Src'=>$url, 'Image Position'=>$pos, 'Image Alt Text'=>$alt);
    return join(',', map { q_($v{$_}) } @SH);
}

for my $r (sort { $a->{model_no} cmp $b->{model_no} } @single) {
    print $shp shopify_row($r, handle=>$r->{handle}, title=>$r->{product_name}, first=>1), "\n";
    $sProducts++; $sVariants++; $sImages++ if $IMG{$r->{sku}} && $IMG{$r->{sku}}[0];
    my $imgs = $IMG{$r->{sku}} || [];
    for my $i (1 .. $#$imgs) {
        next unless $imgs->[$i];
        print $shp image_row($r->{handle}, $imgs->[$i], $i+1, $r->{product_name}), "\n";
        $sImages++;
    }
}
for my $key (sort keys %fam) {
    my @members = @{$fam{$key}};
    my $lead = $members[0][0];
    my $title  = $key eq 'ORCBB01' ? 'Snake Chain Bracelet'
                                   : 'Snake Chain Bracelet with Enamel Accent';
    my $handle = $key eq 'ORCBB01' ? 'snake-chain-bracelet'
                                   : 'snake-chain-bracelet-with-enamel-accent';
    my $first = 1; my $pos = 1;
    for my $m (@members) {
        my ($r,$o1n,$o1v,$o2n,$o2v) = @$m;
        print $shp shopify_row($r, handle=>$handle, title=>$title, first=>$first,
                               o1n=>$o1n, o1v=>$o1v, o2n=>$o2n, o2v=>$o2v,
                               variant_image=>1), "\n";
        $sVariants++; $sImages++ if $first && $IMG{$r->{sku}};
        $first = 0;
    }
    # every variant's own photo also joins the product gallery
    for my $m (@members[1 .. $#members]) {
        my $u = $IMG{$m->[0]{sku}} ? $IMG{$m->[0]{sku}}[0] : undef;
        next unless $u;
        $pos++;
        print $shp image_row($handle, $u, $pos+0, $title), "\n";
        $sImages++;
    }
    $sProducts++;
}
close $shp;
printf STDERR "shopify: %d products, %d variant rows\n", $sProducts, $sVariants;

# ---------- StoreHub, mapped onto the real template ----------
my $QCOL = 'ORLOFF OF DENMARK (BLUPORT)';
my @ST = ('SKU','Parent Product SKU','Product Name','Category','Price Type','Unit',
 'Tax-Inclusive Price','Min Price','Max Price','Cost','Supplier Price','Product Tags',
 'Inventory Type','Track Stock Levels','Barcode','Variant Name 1','Variant Value 1',
 'Variant Name 2','Variant Value 2','Variant Name 3','Variant Value 3','Supplier','Tax Name',
 'Store Credits','Kitchen Station',"${QCOL}_Quantity","${QCOL}_Warning Stock Level",
 "${QCOL}_Ideal Stock Level",'Online Price','Online Discounted Price','Product Description');

sub storehub_row {
    my ($r, %o) = @_;
    my %v;
    $v{'SKU'} = $r->{sku};
    $v{'Parent Product SKU'} = $o{parent} // '';
    $v{'Product Name'} = $o{name} // $r->{product_name};
    $v{'Category'} = $r->{category};
    $v{'Price Type'} = 'Fixed';
    $v{'Tax-Inclusive Price'} = $r->{retail_thb};
    $v{'Cost'} = ($r->{cost_usd} && $r->{cost_usd} =~ /^[\d.]+$/)
                 ? sprintf('%.2f', $r->{cost_usd} * $FX) : '';
    $v{'Product Tags'} = join(';', grep { /\S/ } ($r->{category}, 'Line A', '925 Silver'));
    $v{'Inventory Type'} = 'Simple';
    $v{'Track Stock Levels'} = 1;
    $v{'Variant Name 1'} = $o{v1n} // ''; $v{'Variant Value 1'} = $o{v1v} // '';
    $v{'Variant Name 2'} = $o{v2n} // ''; $v{'Variant Value 2'} = $o{v2v} // '';
    $v{'Supplier'} = 'Zhuhai Rinntin Jewelry';
    # jewellery, not food: suppress the kitchen docket
    $v{'Kitchen Station'} = 'Do Not Print Kitchen Docket';
    $v{"${QCOL}_Quantity"} = $r->{stock_qty};
    $v{"${QCOL}_Warning Stock Level"} = 2;
    $v{'Online Price'} = $r->{retail_thb};
    $v{'Product Description'} = plain($r->{description_html});
    return join(',', map { q_($v{$_}) } @ST);
}

open my $sto, '>', 'storehub-charm-line-a.csv' or die $!;
print $sto join(',', map { q_($_) } @ST), "\n";
my $stRows = 0;
for my $r (sort { $a->{model_no} cmp $b->{model_no} } @single) {
    print $sto storehub_row($r), "\n"; $stRows++;
}
# variant families: a parent row carrying no stock, then the sellable children
for my $key (sort keys %fam) {
    my @members = @{$fam{$key}};
    my $lead = $members[0][0];
    my $name = $key eq 'ORCBB01' ? 'Snake Chain Bracelet'
                                 : 'Snake Chain Bracelet with Enamel Accent';
    my %p = %$lead;
    $p{sku} = $key; $p{stock_qty} = ''; $p{description_html} = $lead->{description_html};
    print $sto storehub_row(\%p, name=>$name), "\n"; $stRows++;
    for my $m (@members) {
        my ($r,$v1n,$v1v,$v2n,$v2v) = @$m;
        print $sto storehub_row($r, parent=>$key, v1n=>$v1n, v1v=>$v1v, v2n=>$v2n, v2v=>$v2v), "\n";
        $stRows++;
    }
}
close $sto;
printf STDERR "storehub: %d rows (%d parents + %d products)\n", $stRows, scalar(keys %fam), $stRows - scalar(keys %fam);
