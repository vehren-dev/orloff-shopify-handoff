# Shopify collections created, 30 Jul 2026

All eleven are **automated** (rule-based), so they fill themselves as products
import and will pick up the 29 held-back SKUs whenever those are named.

| Collection | Handle | Rule | Expected |
|---|---|---|---|
| Charm Bracelets | charm-bracelets | Type = Bracelet | 2 products, 17 variants |
| All Charms | all-charms | Type = Charm AND tag = Line A | 270 |
| Animal Charms | animal-charms | tag = Animals | 42 |
| Nature Charms | nature-charms | tag = Nature | 44 |
| Milestones and Sentiment | milestones-and-sentiment | tag = Milestones & Sentiment | 72 |
| Travel and Lifestyle | travel-and-lifestyle | tag = Travel & Lifestyle | 41 |
| Letter Charms | letter-charms | tag = Personal — Letters | 26 |
| Zodiac Charms | zodiac-charms | tag = Personal — Zodiac | 12 |
| Birthstone Charms | birthstone-charms | tag = Personal — Birthstone | 12 |
| Sparkle and Classic | sparkle-and-classic | tag = Sparkle & Classic | 9 |
| Spacers and Clips | spacers-and-clips | tag = Spacers & Clips | 12 |

All counts read 0 until the product CSV is imported. That is expected.

Each carries an SEO title under 60 characters and a meta description under 160,
plus a short intro paragraph in house style.

## Suggested menu

    Charms & Bracelets
      Charm Bracelets          <- first, it is the gateway product
      All Charms
      ----
      Animal Charms            Letter Charms
      Nature Charms            Zodiac Charms
      Milestones and Sentiment Birthstone Charms
      Travel and Lifestyle     Sparkle and Classic
      Spacers and Clips

## Two things to adjust after import

**Sort order.** Everything is alphabetical. That works for Letters (A to Z) but
Birthstones will read April, August, December rather than January to December,
and Zodiac will read Aquarius, Aries, Cancer rather than Aries to Pisces. Both
want manual ordering, which means converting those two to manual collections or
living with it.

**Collection images.** None set. Shopify falls back to the first product image,
which is serviceable but a proper banner per collection would lift the pages.
