#!/usr/bin/perl
# Parse Orloff factory invoice from `pdftotext -table` output.
#
# Layout facts this relies on (verified before writing):
#  * One logical record == one "Material"-labelled stanza. There are exactly 554.
#  * Within a stanza the row number + model number live in the left column
#    region, which ends where the label column (Material/Color/Size) begins.
#  * The model number is sometimes split across two lines (e.g. "ORGCB182-" on
#    one line, "532  GCB182-2" on the next). Concatenating the left-column
#    region of every stanza line, top down, reassembles it.
#  * weight / qty / unit / total all land on the same physical line in -table
#    mode, unlike -layout where they desynchronise.
use strict; use warnings;

my $file = shift or die "usage: parse.pl <table.txt>\n";
open my $fh, '<', $file or die $!;
local $/; my $text = <$fh>; close $fh;

my @pages = split /\f/, $text;
my (@rows, @warn);

for my $pi (0 .. $#pages) {
    my @lines = split /\n/, $pages[$pi];

    # Label column x-position: leftmost line-initial label on this page.
    my $labelcol;
    for (@lines) {
        next unless /^(\s*)(?:Material|Color|Size)\b/;
        my $c = length $1;
        $labelcol = $c if !defined $labelcol || $c < $labelcol;
    }
    next unless defined $labelcol;

    # Cut the page into stanzas, one per "Material" label.
    my @starts = grep { $lines[$_] =~ /\bMaterial\b/ } 0 .. $#lines;
    for my $si (0 .. $#starts) {
        my $from = $starts[$si];
        my $to   = ($si < $#starts) ? $starts[$si + 1] - 1 : $#lines;
        my @st   = @lines[$from .. $to];

        my ($row_no, @frag, @vals, $numline);
        for my $l (@st) {
            my $left  = length($l) > $labelcol ? substr($l, 0, $labelcol) : $l;
            my $right = length($l) > $labelcol ? substr($l, $labelcol)    : '';

            # Left column: row number and/or model fragment.
            if ($left =~ /\S/) {
                my $t = $left; $t =~ s/^\s+|\s+$//g;
                if ($t =~ s/^(\d{1,3})\s+// ) { $row_no = $1 }
                elsif ($t =~ /^(\d{1,3})$/ && !defined $row_no) { $row_no = $1; $t = '' }
                push @frag, $t if $t =~ /\S/;
            }

            # Right column: numeric block sits on exactly one line.
            if (!defined $numline && $right =~
                /([\d.]+)\s*g\s+(\d+)\s*pcs\s+(?:US)?\$\s?([\d,]+\.\d{2})\s+(?:US)?\$\s?([\d,]+\.\d{2})/) {
                $numline = [$1, $2, $3, $4];
            }

            # Descriptive text, numeric tail removed.
            my $v = $right;
            $v =~ s/([\d.]+)\s*g\s+(\d+)\s*pcs.*$//;
            $v =~ s/^\s*(Material|Color|Size)\b\s*//;
            $v =~ s/\s+/ /g; $v =~ s/^\s+|\s+$//g;
            push @vals, $v if $v =~ /\S/;
        }

        my $model = join '', @frag;
        $model =~ s/\s+//g;

        unless (defined $row_no && $model =~ /\S/) {
            push @warn, sprintf("page %d stanza %d: no row/model (model='%s')", $pi + 1, $si + 1, $model // '');
            next;
        }
        unless ($numline) {
            push @warn, sprintf("row %s %s: no numeric block found", $row_no, $model);
        }

        my ($w, $q, $u, $t) = $numline ? @$numline : ('', '', '', '');
        s/,//g for ($u, $t);

        # Split descriptive values into material / finish / stone / size.
        my ($material, $finish, $stone, $size) = ('', '', '', '');
        my @rest;
        for my $v (@vals) {
            if    (!$material && $v =~ /silver|sterling|platinum|gold/i && $v !~ /^(Metal|Plaing|Plating)/i) { $material = $v }
            elsif (!$finish   && $v =~ /^(Metal|Plaing|Plating)/i) { $finish = $v }
            elsif (!$stone    && $v =~ /stone|enamel|\bCZ\b|crystal|ceramic/i) { $stone = $v }
            else { push @rest, $v }
        }
        # Size is the last value that looks dimensional. Some rows carry no
        # unit suffix at all (row 432 ORPA0010 prints "4.4*10.2"), so a bare
        # "N x N" form counts too.
        for my $v (reverse @rest) {
            if ($v =~ /\d/ && ($v =~ /mm|cm|inch/i || $v =~ /^\d[\d.]*\s*[*x\x{00d7}]\s*\d/i)) { $size = $v; last }
        }
        $stone = '' if $stone =~ /^Stone\s*:?\s*(NA|No)$/i;

        push @rows, {
            row_no => $row_no, model_no => $model,
            material => $material, metal_finish => $finish, stone => $stone,
            size => $size, weight_g => $w, qty => $q,
            unit_price_usd => $u, total_price_usd => $t,
            # Every descriptive value from the stanza, in source order, nothing
            # discarded. The heuristic split above is lossy: engraved quote text
            # (ORGCB182/184/186/187) and enamel colour words (ORGCBB1) do not
            # match any of the field patterns and would otherwise vanish.
            raw_desc => join(' | ', @vals),
            page => $pi + 1,
        };
    }
}

my @cols = qw(row_no model_no material metal_finish stone size weight_g qty unit_price_usd total_price_usd raw_desc);
open my $out, '>', 'invoice_extracted.csv' or die $!;
print $out join(',', @cols), "\n";
for my $r (@rows) {
    print $out join(',', map { my $v = $r->{$_} // ''; $v =~ s/"/""/g; $v =~ /[",]/ ? qq{"$v"} : $v } @cols), "\n";
}
close $out;

printf STDERR "parsed %d records\n", scalar @rows;
printf STDERR "WARNINGS (%d):\n", scalar @warn;
print STDERR "  $_\n" for @warn;
