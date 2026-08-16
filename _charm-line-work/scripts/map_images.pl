#!/usr/bin/perl
# Map every HD PICTURE folder to an invoice model number, and produce the
# Phase 2 rename plan.
#
# Resolution rule, in order:
#   1. If any file in the folder parses as an invoice model number, that wins.
#      GCB49 contains PA0107*.jpg and IS ORPA0107. The folder label is wrong.
#   2. Otherwise fall back to the folder name. Most folders hold only unnamed
#      shots (05-R.jpg, 16-S.jpg, 1.jpg), so the folder is the sole evidence.
#   3. Otherwise unresolved, reported for a human.
use strict; use warnings;
use File::Find;

my $ROOT = 'E:/HD PICTURE';

sub csvsplit { my @f; my $c=''; my $q=0;
  for my $ch (split //, shift) {
    if ($ch eq '"') { $q=!$q } elsif ($ch eq ',' && !$q) { push @f,$c; $c='' } else { $c.=$ch } }
  push @f,$c; @f }

sub norm { my $s = uc shift; $s =~ s/[\s_]//g; $s =~ s/^OR//; $s }
# Secondary key: collapse zero padding in the numeric run, so PA0034 and PA034
# compare equal. The invoice writes ORPA034; the image file writes PA0034.
sub loose { my $s = norm(shift); $s =~ s/(\d+)/sprintf("%d",$1)/ge; $s }

my (%INV, %INV_LOOSE, %INV_ROWS);
open my $fh, '<', 'invoice_extracted.csv' or die $!;
<$fh>;
while (<$fh>) { chomp; my @f = csvsplit($_); next unless $f[1];
    my $n = norm($f[1]); $INV{$n} = $f[1];
    push @{$INV_LOOSE{ loose($f[1]) }}, $f[1];
    push @{$INV_ROWS{$n}}, $f[0]; }
close $fh;

my %SCOPE;
open my $afh, '<', 'appendixA.txt' or die $!;   # not $a: that is the sort variable
while (<$afh>) { chomp; s/\s//g; next unless /\S/; $SCOPE{ norm($_) } = 1 }
close $afh;

# Resolve a bare token to an invoice model number.
sub resolve {
    my $tok = shift;
    return () unless defined $tok && $tok =~ /\S/;
    my $n = norm($tok);
    return ($INV{$n}, 'exact') if $INV{$n};
    my $l = loose($tok);
    if ($INV_LOOSE{$l} && @{$INV_LOOSE{$l}} == 1) {
        return ($INV_LOOSE{$l}[0], 'zero-padding');
    }
    # Folder drops the finish suffix the SKU carries: GCB05 -> ORGCB05-P-18.
    # Require the remainder not to start with a digit, otherwise GCB10 would
    # also swallow GCB109. Accept only if exactly one candidate survives.
    my @pre = grep { /^\Q$n\E(?!\d)./ } keys %INV;
    return ($INV{$pre[0]}, 'suffix-dropped') if @pre == 1;
    return ();
}

# Folders that legitimately cover several SKUs because the photography axis is
# not the SKU axis. CBB01 is one folder for three lengths; ORGCBB1-<colour> is
# one folder per colour covering all three lengths.
sub multi {
    my $leaf = uc shift;
    return map { "ORCBB01-$_" } qw(17 19 21) if $leaf eq 'CBB01';
    if ($leaf =~ /^ORGCBB1-([WRKBG])$/) {
        my $c = $1;
        return grep { $_ ne 'ORGCBB1-21-G' } map { "ORGCBB1-$_-$c" } qw(17 19 21);
    }
    return ();
}

# --- gather files per folder ---------------------------------------------
my %tree;
find(sub { return unless -f; return unless /\.(jpe?g|png)$/i;
    my $p = $File::Find::name;
    my ($folder) = $p =~ m{^\Q$ROOT\E/(.*)/[^/]+$}; $folder //= '(root)';
    my ($file)   = $p =~ m{([^/]+)$};
    push @{$tree{$folder}}, $file; }, $ROOT);

my (@plan, @unresolved, @conflicts, @noscope);

for my $folder (sort keys %tree) {
    my @files = sort @{$tree{$folder}};
    my ($leaf) = $folder =~ m{([^/]+)$};

    # Which files name a model?
    my (%hits, %fileof);
    for my $f (@files) {
        my $stem = $f; $stem =~ s/\.(jpe?g|png)$//i;
        next if $stem =~ /^IMG[_\s-]/i;
        # try full stem, then stem minus a trailing angle number
        for my $cand ($stem, ($stem =~ /^(.*?)[-_\s]+\d{1,2}(?:\s*\(\d+\))?$/ ? $1 : ())) {
            my ($m, $how) = resolve($cand);
            if ($m) { $hits{$m}{$how} = 1; push @{$fileof{$m}}, $f; last }
        }
    }

    my ($sku, $basis, $how) = ('', '', '');
    if (keys %hits == 1) {
        ($sku) = keys %hits; $basis = 'filename';
        ($how) = sort keys %{$hits{$sku}};
    } elsif (keys %hits > 1) {
        push @conflicts, { folder => $folder, skus => [sort keys %hits] };
        next;
    } else {
        my ($m, $h) = resolve($leaf);
        if ($m) { $sku = $m; $basis = 'foldername'; $how = $h }
    }

    # One folder legitimately serving several SKUs.
    if (!$sku && (my @m = multi($leaf))) {
        for my $s (@m) {
            push @plan, { sku => $s, in => ($SCOPE{norm($s)} ? 'YES' : 'no'),
                          basis => 'foldername (shared)', how => 'one-to-many',
                          folder => $folder, mismatch => '', primary => $files[0],
                          autoprimary => 'no', files => \@files,
                          rows => join('|', @{$INV_ROWS{norm($s)} || []}) };
        }
        next;
    }

    unless ($sku) {
        push @unresolved, { folder => $folder, leaf => $leaf, n => scalar @files,
                            sample => join(', ', @files[0 .. ($#files < 3 ? $#files : 3)]) };
        next;
    }

    my $n = norm($sku);
    my $in = $SCOPE{$n} ? 'YES' : 'no';
    push @noscope, { folder => $folder, sku => $sku } unless $SCOPE{$n};

    # Folder label disagrees with the resolved SKU?
    my $mismatch = (norm($leaf) ne $n) ? 'LABEL MISMATCH' : '';

    # Preferred primary: a file named exactly for the model, else first file.
    my @named = @{ $fileof{$sku} || [] };
    my ($primary) = grep { my $s = $_; $s =~ s/\.(jpe?g|png)$//i; norm($s) eq $n || loose($s) eq loose($sku) } @named;
    $primary //= $named[0] // $files[0];
    my $auto = @named ? 'yes' : 'no';

    push @plan, { sku => $sku, in => $in, basis => $basis, how => $how,
                  folder => $folder, mismatch => $mismatch, primary => $primary,
                  autoprimary => $auto, files => \@files,
                  rows => join('|', @{$INV_ROWS{$n} || []}) };
}

# --- outputs --------------------------------------------------------------
open my $o, '>', 'image_sku_map.csv' or die $!;
print $o "sku,in_appendix_a,invoice_rows,folder,folder_label_matches,resolved_by,match_type,file_count,primary_can_be_auto_picked,suggested_primary,all_files\n";
for my $p (sort { $a->{sku} cmp $b->{sku} } @plan) {
    my @c = ($p->{sku}, $p->{in}, $p->{rows}, $p->{folder},
             ($p->{mismatch} ? 'NO' : 'yes'), $p->{basis}, $p->{how},
             scalar @{$p->{files}}, $p->{autoprimary}, $p->{primary},
             join('|', @{$p->{files}}));
    print $o join(',', map { my $v = $_ // ''; $v =~ s/"/""/g; $v =~ /[",]/ ? qq{"$v"} : $v } @c), "\n";
}
close $o;

my $ins = grep { $_->{in} eq 'YES' } @plan;
my $mis = grep { $_->{mismatch} } @plan;
my $manual = grep { $_->{autoprimary} eq 'no' } @plan;
printf "Folders resolved to a SKU     : %d  (%d in Appendix A, %d out of scope)\n",
    scalar @plan, $ins, scalar(@plan) - $ins;
printf "  resolved by filename        : %d\n", scalar grep { $_->{basis} eq 'filename' } @plan;
printf "  resolved by folder name     : %d\n", scalar grep { $_->{basis} eq 'foldername' } @plan;
printf "  folder label WRONG          : %d\n", $mis;
printf "  primary needs a human pick  : %d\n", $manual;
printf "Folders unresolved            : %d\n", scalar @unresolved;
printf "Folders with mixed SKUs       : %d\n", scalar @conflicts;

print "\n=== FOLDER LABEL DISAGREES WITH CONTENTS (files win) ===\n";
printf "  %-38s -> %-14s (%s)\n", $_->{folder}, $_->{sku}, $_->{how}
    for grep { $_->{mismatch} } sort { $a->{folder} cmp $b->{folder} } @plan;

print "\n=== UNRESOLVED FOLDERS ===\n";
printf "  %-38s %2d files : %s\n", $_->{folder}, $_->{n}, $_->{sample} for @unresolved;
print "  (none)\n" unless @unresolved;

print "\n=== FOLDERS CONTAINING MORE THAN ONE SKU ===\n";
printf "  %-38s -> %s\n", $_->{folder}, join(', ', @{$_->{skus}}) for @conflicts;
print "  (none)\n" unless @conflicts;
