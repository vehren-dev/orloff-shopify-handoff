#!/usr/bin/perl
# Draft Phase 2 rename plan from image_sku_map.csv + file hashes.
#
# Primary-image selection is driven by HASH EXCLUSIVITY, not by filename.
# Filename patterns are not a reliable signal and point the wrong way in
# places: in the GCB182/184 quote-tag folders the tidy numbered files (05.jpg,
# 16-S.jpg) are byte-identical across seven or eight different SKUs, while the
# IMG_* camera originals are the only SKU-specific shots. In GCB22-P it is the
# other way round. Only exclusivity separates them.
#
# Exclusivity is measured PER SKU, not per folder. ORGCB22-P and ORGCB30-P each
# resolve from two folders, so a file sitting in both is duplicated within one
# product, which is harmless, not cross-product contamination. Grouping by SKU
# also removes the target-filename collision that per-folder numbering caused:
# both folders held a different image called 1.jpg, and both wanted to become
# <SKU>.jpg.
#
# Rank:
#   1  unique to this SKU, square product shot      <- use as primary
#   2  unique to this SKU, -R landscape crop (always 970x600)
#   3  also appears under a different SKU, square
#   4  also appears under a different SKU, landscape
use strict; use warnings;

sub csvsplit { my @f; my $c=''; my $q=0;
  for my $ch (split //, shift) {
    if ($ch eq '"') { $q=!$q } elsif ($ch eq ',' && !$q) { push @f,$c; $c='' } else { $c.=$ch } }
  push @f,$c; @f }

my %hash_of;
open my $h, '<', 'hashfiles.txt' or die $!;
while (<$h>) { chomp; my ($hash,$path) = split /\s+/, $_, 2;
    my ($folder,$file) = $path =~ m{^\./(.*)/([^/]+)$}; next unless defined $folder;
    $hash_of{"$folder/$file"} = $hash; }
close $h;

# Collect every file per SKU, across all folders that resolve to it.
my (%bysku, %skus_of_hash);
open my $in, '<', 'image_sku_map.csv' or die $!; <$in>;
while (<$in>) {
    chomp; my @f = csvsplit($_);
    my ($sku,$inA,$rows,$folder,$lblok,$basis,$how,$cnt,$auto,$primary,$all) = @f;
    next unless $inA eq 'YES';
    for my $file (split /\|/, $all) {
        my $hash = $hash_of{"$folder/$file"} // "nohash:$folder/$file";
        push @{$bysku{$sku}}, { folder=>$folder, file=>$file, hash=>$hash };
        $skus_of_hash{$hash}{$sku} = 1;
    }
}
close $in;

open my $out, '>', 'image_rename_plan.csv' or die $!;
print $out "sku,order,source_folder,source_file,target_file,unique_to_sku,shape,rank,note\n";

my (%stat, @nouniq, $dropped);
for my $sku (sort keys %bysku) {
    my (@scored, %seen);
    for my $r (@{$bysku{$sku}}) {
        # Same image present in both folders of this SKU: keep one copy.
        if ($seen{$r->{hash}}++) { $dropped++; next }
        my @sharers = keys %{$skus_of_hash{$r->{hash}}};
        my $nsku = scalar @sharers;
        # Sharing across the sizes of one bracelet is expected: CBB01 was shot
        # once for 17/19/21cm, and each ORGCBB1 colour folder covers all three
        # lengths. Collapse the size token and see if the sharers are the same
        # product. Sharing across colours or finishes is NOT excused.
        my %base = map { my $s = $_; $s =~ s/-(?:17|19|21)(?=-|$)//; ($s => 1) } @sharers;
        my $sizeonly = ($nsku > 1 && keys %base == 1);
        my $uniq = ($nsku <= 1 || $sizeonly);
        my $land = ($r->{file} =~ /-R\.(jpe?g|png)$/i);
        my $rank = $uniq ? ($land ? 2 : 1) : ($land ? 4 : 3);
        my $stem = $r->{file}; $stem =~ s/\.[^.]+$//;
        my $u = uc $stem; $u =~ s/[\s_]//g; $u =~ s/^OR//;
        my $m = uc $sku;  $m =~ s/[\s_]//g; $m =~ s/^OR//;
        my $tie = $u eq $m ? 0 : $u =~ /^\Q$m\E-\d{1,2}$/ ? 1 : 2;
        push @scored, { %$r, uniq=>$uniq, land=>$land, rank=>$rank, tie=>$tie, nsku=>$nsku, sizeonly=>$sizeonly };
    }
    @scored = sort { $a->{rank} <=> $b->{rank} or $a->{tie} <=> $b->{tie}
                     or lc($a->{file}) cmp lc($b->{file}) } @scored;
    push @nouniq, $sku unless grep { $_->{rank} == 1 } @scored;

    my $i = 0;
    for my $s (@scored) {
        $i++;
        my ($ext) = $s->{file} =~ /(\.[^.]+)$/; $ext = lc($ext // '.jpg');
        my $target = $i == 1 ? "$sku$ext" : "$sku-$i$ext";
        my $note = '';
        $note = "also used by $s->{nsku} different SKUs, do not upload as this SKU" if $s->{rank} >= 3;
        $note = "shared across the sizes of one bracelet, expected" if $s->{sizeonly};
        $note = 'landscape 970x600 crop, not a product hero' if $s->{rank} == 2;
        my @c = ($sku,$i,$s->{folder},$s->{file},$target,
                 ($s->{uniq}?'yes':'no'), ($s->{land}?'landscape':'square'), $s->{rank}, $note);
        print $out join(',', map { my $v=$_//''; $v =~ s/"/""/g; $v =~ /[",]/ ? qq{"$v"} : $v } @c), "\n";
    }
    $stat{ $scored[0]{rank} }++ if @scored;
}
close $out;

printf "SKUs in plan: %d   duplicate copies dropped: %d\n", scalar keys %bysku, $dropped // 0;
printf "Primary image quality:\n";
printf "  rank 1  unique square shot        : %d\n", $stat{1} // 0;
printf "  rank 2  unique landscape crop     : %d\n", $stat{2} // 0;
printf "  rank 3  shared square             : %d\n", $stat{3} // 0;
printf "  rank 4  shared landscape          : %d\n", $stat{4} // 0;
print "SKUs with no unique image: ", (@nouniq ? join(', ', @nouniq) : '(none)'), "\n";
