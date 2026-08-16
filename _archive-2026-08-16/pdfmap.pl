#!/usr/bin/perl
# Map each embedded invoice image to the invoice row it sits beside.
#
# Carved file order does NOT follow row order: img_0230 is letter C, img_0231
# is letter M. So instead read the real structure. For every page, inflate the
# content stream, find each "/Name Do" and the "cm" matrix immediately before
# it, and take the y translate. Sorting placements by y descending gives the
# images in visual top-to-bottom order, which is the row order on that page.
use strict; use warnings;
use IO::Uncompress::RawInflate qw(rawinflate);

my $pdf = 'E:/Orloff Amazon Stock List.pdf';
open my $f, '<:raw', $pdf or die $!;
# Scope the slurp: a bare "local $/" here would stay undef for the rest of the
# program and make the later line-by-line read of index.tsv return everything
# in one go, leaving the carved-image list empty.
my $d = do { local $/; <$f> };
close $f;

# --- object offsets -------------------------------------------------------
my %objoff;
while ($d =~ /(?:^|[\r\n\s])(\d+)\s+0\s+obj\b/g) { $objoff{$1} = pos($d) }

sub objbody {
    my $num = shift;
    return '' unless exists $objoff{$num};
    my $start = $objoff{$num};
    my $end = index($d, 'endobj', $start);
    $end = $start + 200000 if $end < 0;
    return substr($d, $start, $end - $start);
}

sub streamdata {
    my $num = shift;
    my $body = objbody($num);
    my $sp = index($body, "stream");
    return () if $sp < 0;
    my $off = $sp + 6;
    $off++ while substr($body, $off, 1) =~ /[\r\n]/;
    my ($len) = $body =~ m{/Length\s+(\d+)};
    if (!defined $len) {
        my $ep = index($body, "endstream", $off);
        $len = $ep - $off;
    }
    my $raw = substr($body, $off, $len);
    if ($body =~ m{/Filter\s*/FlateDecode}) {
        my $out; rawinflate(\(my $tmp = substr($raw,2)) => \$out) or return ();
        return $out;
    }
    return $raw;
}

# --- page order from the page tree ---------------------------------------
my @pages;
if ($d =~ m{/Type\s*/Pages.*?/Kids\s*\[(.*?)\]}s) {
    my $kids = $1;
    push @pages, $1 while $kids =~ /(\d+)\s+0\s+R/g;
}
# Fallback: page objects in file order
unless (@pages) {
    for my $n (sort { $a <=> $b } keys %objoff) {
        push @pages, $n if objbody($n) =~ m{/Type\s*/Page[^s]};
    }
}
printf STDERR "pages found: %d\n", scalar @pages;

# --- image object -> carved file -----------------------------------------
open my $ix, '<', 'invoice_images/index.tsv' or die $!; <$ix>;
my @carved;
while (<$ix>) { chomp; my @c = split /\t/; push @carved, { off=>$c[1], file=>$c[5], w=>$c[3], h=>$c[4] } }
close $ix;
@carved = sort { $a->{off} <=> $b->{off} } @carved;

sub carved_at {   # nearest carved jpeg starting at/after a stream offset
    my $off = shift;
    for my $c (@carved) { return $c if $c->{off} >= $off - 4 && $c->{off} <= $off + 64 }
    return undef;
}

# --- walk pages -----------------------------------------------------------
open my $out, '>', 'invoice_image_order.tsv' or die $!;
print $out "page\tseq_on_page\ty\tobj\tfile\twidth\theight\n";
my $total = 0;
for my $pi (0 .. $#pages) {
    my $pnum = $pages[$pi];
    my $pbody = objbody($pnum);

    my %xo;
    if ($pbody =~ m{/XObject\s*<<(.*?)>>}s) {
        my $x = $1; $xo{$1} = $2 while $x =~ m{/(\w+)\s+(\d+)\s+0\s+R}g;
    }
    my @cont;
    if ($pbody =~ m{/Contents\s+(\d+)\s+0\s+R}) { @cont = ($1) }
    elsif ($pbody =~ m{/Contents\s*\[(.*?)\]}s) { my $c=$1; push @cont,$1 while $c =~ /(\d+)\s+0\s+R/g }
    my $cs = join "\n", map { streamdata($_) // '' } @cont;
    next unless length $cs;

    my @place;
    while ($cs =~ m{([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+cm\s*(?:[^D]{0,80}?)/(\w+)\s+Do}gs) {
        my ($y, $name) = ($6, $7);
        next unless exists $xo{$name};
        my $obj = $xo{$name};
        my $ob = objbody($obj);
        next unless $ob =~ m{/Subtype\s*/Image};
        next unless $ob =~ m{/DCTDecode};
        my $sp = index($ob, 'stream');
        next if $sp < 0;
        my $abs = $objoff{$obj} + $sp + 6;
        $abs++ while substr($d, $abs, 1) =~ /[\r\n]/;
        my $c = carved_at($abs);
        push @place, { y=>$y+0, obj=>$obj, file=>($c?$c->{file}:'?'), w=>($c?$c->{w}:'?'), h=>($c?$c->{h}:'?') };
    }
    # This document's page CTM flips the y axis (the text matrices carry a
    # negative d, e.g. "0.034 0 0 -0.034 ... Tm"), so LARGER y is FURTHER DOWN
    # the page. Sort ascending to get visual top-to-bottom, i.e. row order.
    # Verified on page 26: ascending gives ... F, G, H, I for rows 235-238.
    my @sorted = sort { $a->{y} <=> $b->{y} } @place;
    my $i = 0;
    for my $p (@sorted) {
        $i++; $total++;
        printf $out "%d\t%d\t%.1f\t%s\t%s\t%s\t%s\n", $pi+1, $i, $p->{y}, $p->{obj}, $p->{file}, $p->{w}, $p->{h};
    }
}
close $out;
print STDERR "placements written: $total\n";
