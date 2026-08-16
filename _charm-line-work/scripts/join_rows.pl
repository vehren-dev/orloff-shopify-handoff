#!/usr/bin/perl
# Join invoice rows to the images placed beside them.
# Rows come from the -table text in stanza order; images come from the PDF
# placement list sorted top to bottom. Both are per page, so they zip.
# The factory logo repeats on every page and must be dropped first.
use strict; use warnings;

# rows per page, in order, from the reconciled extraction
my (%rows_on_page);
open my $t, '<', 'inv_table.txt' or die $!;
my $txt = do { local $/; <$t> }; close $t;
my @pages = split /\f/, $txt;
for my $pi (0 .. $#pages) {
    my @lines = split /\n/, $pages[$pi];
    my $labelcol;
    for (@lines) { next unless /^(\s*)(?:Material|Color|Size)\b/;
        my $c = length $1; $labelcol = $c if !defined $labelcol || $c < $labelcol }
    next unless defined $labelcol;
    my @starts = grep { $lines[$_] =~ /\bMaterial\b/ } 0 .. $#lines;
    for my $si (0 .. $#starts) {
        my $from = $starts[$si];
        my $to = ($si < $#starts) ? $starts[$si+1]-1 : $#lines;
        my ($row, @frag);
        for my $l (@lines[$from .. $to]) {
            my $left = length($l) > $labelcol ? substr($l,0,$labelcol) : $l;
            next unless $left =~ /\S/;
            my $x = $left; $x =~ s/^\s+|\s+$//g;
            if ($x =~ s/^(\d{1,3})\s+//) { $row = $1 }
            elsif ($x =~ /^(\d{1,3})$/ && !defined $row) { $row = $1; $x = '' }
            push @frag, $x if $x =~ /\S/;
        }
        my $model = join '', @frag; $model =~ s/\s//g;
        push @{$rows_on_page{$pi+1}}, { row => $row, model => $model } if defined $row;
    }
}

# placements per page
my %img_on_page;
open my $p, '<', 'invoice_image_order.tsv' or die $!; <$p>;
my @all;
while (<$p>) { chomp; my @c = split /\t/;
    push @all, { page=>$c[0], seq=>$c[1], y=>$c[2], obj=>$c[3], file=>$c[4], w=>$c[5], h=>$c[6] } }
close $p;

# img_0001 is the Rinntin letterhead logo, not a product.
my $LOGO = 'img_0001.jpg';
for my $x (grep { $_->{file} ne $LOGO } @all) { push @{$img_on_page{$x->{page}}}, $x }

# The same image object is sometimes drawn twice at nearly the same spot.
# Collapse those. Do NOT collapse the same object repeated at genuine row
# spacing: on page 9 one photo legitimately serves four consecutive rows,
# and those placements are ~80 units apart.
for my $pg (keys %img_on_page) {
    my (@keep);
    for my $x (@{$img_on_page{$pg}}) {
        next if @keep && $keep[-1]{obj} eq $x->{obj} && abs($keep[-1]{y} - $x->{y}) < 40;
        push @keep, $x;
    }
    $img_on_page{$pg} = \@keep;
}

# Rows are zipped to images from the TOP of the page down, so a surplus image
# at the BOTTOM is harmless: it is the next page's first row, drawn early
# because the row straddles the page break. Only a surplus at the TOP would
# shift every row on the page, and that shows up as an anomalous y: the table's
# first row sits at y ~85, so anything above y=50 is a carry-over from the
# previous page and must go.
#
# Do NOT drop a top image merely because it repeats the previous page's last
# image. That is legitimate and common here: one bracelet photo serves 17, 19
# and 21cm, and those rows straddle pages 25 and 26.
for my $pg (sort { $a <=> $b } keys %img_on_page) {
    my $cur = $img_on_page{$pg};
    shift @$cur if @$cur && $cur->[0]{y} < 50;
}

open my $o, '>', 'invoice_row_images.tsv' or die $!;
print $o "row_no\tmodel_no\tpage\timage_file\twidth\theight\n";
my ($ok, $bad, @mismatch) = (0,0);
for my $pg (sort { $a <=> $b } keys %rows_on_page) {
    my @r = @{$rows_on_page{$pg}};
    my @i = @{$img_on_page{$pg} || []};
    if (@r != @i) { $bad++; push @mismatch, sprintf("page %d: %d rows vs %d images", $pg, scalar @r, scalar @i) }
    for my $k (0 .. $#r) {
        my $im = $i[$k];
        printf $o "%s\t%s\t%d\t%s\t%s\t%s\n", $r[$k]{row}, $r[$k]{model}, $pg,
            ($im ? $im->{file} : ''), ($im ? $im->{w} : ''), ($im ? $im->{h} : '');
        $ok++ if $im;
    }
}
close $o;

printf "rows with an image: %d\n", $ok;
printf "pages where row count != image count: %d\n", $bad;
print "  $_\n" for @mismatch;
