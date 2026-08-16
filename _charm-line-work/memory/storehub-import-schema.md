---
name: storehub-import-schema
description: StoreHub product import CSV columns and the Orloff store/quantity column name
metadata: 
  node_type: memory
  type: reference
  originSessionId: 93aa9589-172f-4741-98db-305298a3568b
  modified: 2026-07-30T10:34:43.634Z
---

StoreHub's product import template has **31 columns**, in this order:

`SKU, Parent Product SKU, Product Name, Category, Price Type, Unit, Tax-Inclusive Price, Min Price, Max Price, Cost, Supplier Price, Product Tags, Inventory Type, Track Stock Levels, Barcode, Variant Name 1, Variant Value 1, Variant Name 2, Variant Value 2, Variant Name 3, Variant Value 3, Supplier, Tax Name, Store Credits, Kitchen Station, ORLOFF OF DENMARK (BLUPORT)_Quantity, ORLOFF OF DENMARK (BLUPORT)_Warning Stock Level, ORLOFF OF DENMARK (BLUPORT)_Ideal Stock Level, Online Price, Online Discounted Price, Product Description`

Required: **SKU** (must be unique), **Product Name**, **Price Type** (`Fixed`/`Variable`/`Unit`), **Track Stock Levels** (`0` disable, `1` enable). `Unit` is required only when Price Type is `Unit`.

**The stock quantity column is store-specific and named after the outlet: `ORLOFF OF DENMARK (BLUPORT)_Quantity`.** There are matching `_Warning Stock Level` and `_Ideal Stock Level` columns. A second outlet would add three more columns, so re-export the template rather than reusing an old header if outlets change.

`Tax-Inclusive Price` is what the customer pays, matching the BackOffice Display Price setting — Thai VAT is already inside it. `Inventory Type` is `Simple` (or Composite/Serialized). Variants use `Parent Product SKU` pointing at a parent row, with up to three Variant Name/Value pairs; row 2 of the template is a description row, not data, and rows 3-5 are a worked T-shirt example.

Template copy kept at `E:\storehub-template.csv`. Relates to [[orloff-charm-line-pricing]].
