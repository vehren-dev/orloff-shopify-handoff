#!/usr/bin/perl
# Faithful port of Step 4 of invoice-extraction-job.md. Python is not installed
# on this machine; the tests, order and tolerances are unchanged.
use strict; use warnings;

my $ROWS_EXPECTED  = 554;
my $QTY_EXPECTED   = 7468;
my $TOTAL_EXPECTED = 55849.61;

open my $fh, '<', 'invoice_extracted.csv' or die $!;
my $hdr = <$fh>; chomp $hdr; $hdr =~ s/\r$//;
my @cols = split /,/, $hdr;
my @rows;
while (my $l = <$fh>) {
    chomp $l; $l =~ s/\r$//; next unless $l =~ /\S/;
    my @f; my $cur = ''; my $inq = 0;
    for my $ch (split //, $l) {
        if ($ch eq '"') { $inq = !$inq }
        elsif ($ch eq ',' && !$inq) { push @f, $cur; $cur = '' }
        else { $cur .= $ch }
    }
    push @f, $cur;
    my %r; @r{@cols} = @f; push @rows, \%r;
}
close $fh;

my @failures;

# 1. Row count
push @failures, sprintf("ROW COUNT: got %d, expected %d", scalar @rows, $ROWS_EXPECTED)
    if @rows != $ROWS_EXPECTED;

# 2. Row numbers present exactly once, 1..554
my %count; $count{ 0 + $_->{row_no} }++ for @rows;
my @missing = grep { !$count{$_} } 1 .. $ROWS_EXPECTED;
my @dupes   = sort { $a <=> $b } grep { $count{$_} > 1 } keys %count;
push @failures, "MISSING ROWS: @missing"   if @missing;
push @failures, "DUPLICATE ROWS: @dupes"   if @dupes;

# 3. Per-row arithmetic: unit * qty == total
my @bad_math;
for my $r (@rows) {
    my ($u, $q, $t) = @$r{qw(unit_price_usd qty total_price_usd)};
    if (!length $u || !length $q || !length $t || $u !~ /^[\d.]+$/ || $q !~ /^\d+$/ || $t !~ /^[\d.]+$/) {
        push @bad_math, [$r->{row_no}, $r->{model_no}, "UNPARSEABLE"];
        next;
    }
    my $calc = $u * $q;
    push @bad_math, [$r->{row_no}, $r->{model_no},
        sprintf("%s x %s = %.2f, stated %s", $u, $q, $calc, $t)]
        if abs($calc - $t) > 0.02;
}
if (@bad_math) {
    push @failures, sprintf("ROW ARITHMETIC FAILED (%d):", scalar @bad_math);
    push @failures, sprintf("    row %s %s: %s", @$_) for @bad_math;
}

# 4. Document totals
my $qty_sum = 0;   $qty_sum   += $_->{qty}             for @rows;
my $total_sum = 0; $total_sum += $_->{total_price_usd} for @rows;
$total_sum = sprintf("%.2f", $total_sum);
push @failures, sprintf("QTY SUM: got %d, invoice states %d, delta %d",
    $qty_sum, $QTY_EXPECTED, $qty_sum - $QTY_EXPECTED) if $qty_sum != $QTY_EXPECTED;
push @failures, sprintf("VALUE SUM: got %s, invoice states %s, delta %.2f",
    $total_sum, $TOTAL_EXPECTED, $total_sum - $TOTAL_EXPECTED)
    if abs($total_sum - $TOTAL_EXPECTED) > 0.05;

# 5. Model numbers unique (ORCB176 is a known genuine duplicate)
my %mc; $mc{ $_->{model_no} }++ for @rows;
my @md = sort grep { $mc{$_} > 1 } keys %mc;
push @failures, "DUPLICATE MODEL NUMBERS: " . join(', ', map { "$_ x$mc{$_}" } @md) if @md;

print @failures ? "FAIL\n" : "PASS\n";
print "$_\n" for @failures;
printf "\n-- observed --\nrows=%d  qty_sum=%d  value_sum=%s\n", scalar @rows, $qty_sum, $total_sum;
