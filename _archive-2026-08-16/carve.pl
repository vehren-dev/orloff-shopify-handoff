#!/usr/bin/perl
# Carve embedded JPEGs out of the invoice PDF.
#
# pdfimages is not installed, but every product picture in this file is a
# DCTDecode stream, which is a plain JPEG. Inside JPEG entropy-coded data an
# 0xFF byte is always followed by 0x00 (byte stuffing) or a marker, so FFD9
# only ever appears as the real end-of-image. Carving on FFD8FF .. FFD9 is
# therefore safe here.
use strict; use warnings;

my $pdf = shift // 'E:/Orloff Amazon Stock List.pdf';
my $dir = shift // 'invoice_images';
mkdir $dir unless -d $dir;

open my $f, '<:raw', $pdf or die $!;
local $/; my $d = <$f>; close $f;

my $n = 0; my $pos = 0;
open my $idx, '>', "$dir/index.tsv" or die $!;
print $idx "seq\toffset\tbytes\twidth\theight\tfile\n";

while ((my $s = index($d, "\xFF\xD8\xFF", $pos)) >= 0) {
    my $e = index($d, "\xFF\xD9", $s);
    if ($e < 0) { last }
    my $len = $e + 2 - $s;
    my $jpg = substr($d, $s, $len);
    $pos = $e + 2;
    next if $len < 2000;               # skip icons and stray thumbnails
    $n++;
    my ($w, $h) = jpegsize($jpg);
    my $name = sprintf("img_%04d.jpg", $n);
    open my $o, '>:raw', "$dir/$name" or die $!;
    print $o $jpg; close $o;
    printf $idx "%d\t%d\t%d\t%s\t%s\t%s\n", $n, $s, $len, $w // '?', $h // '?', $name;
}
close $idx;
print "carved $n images into $dir\n";

# Read SOFn for dimensions.
sub jpegsize {
    my $j = shift; my $i = 2;
    while ($i < length($j) - 9) {
        return () unless substr($j, $i, 1) eq "\xFF";
        my $m = ord substr($j, $i + 1, 1);
        if ($m >= 0xC0 && $m <= 0xCF && $m != 0xC4 && $m != 0xC8 && $m != 0xCC) {
            my ($h, $w) = unpack 'nn', substr($j, $i + 5, 4);
            return ($w, $h);
        }
        my $seg = unpack 'n', substr($j, $i + 2, 2);
        last unless $seg;
        $i += 2 + $seg;
    }
    return ();
}
