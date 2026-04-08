---
title: EAT Cycling — Supplier Data & Shopify Stock Automation
description: Python tooling and scheduled automation that normalise stock from four suppliers (~5,000 SKUs), seed Shopify via import, then keep inventory aligned through the Shopify API—with reconciliation reports so the shop stays trustworthy as the business scales.
slug: eat-cycling-shopify-ops
date: 2025-01-15
---

# Case Study: EAT Cycling — Supplier Data & Shopify Stock Automation

## Executive Summary

[EAT Cycling](https://eatcycling.co.uk/) launched a **Shopify store** alongside an established retail operation, with catalogue depth from **four suppliers** and roughly **five thousand stock lines**. Supplier data arrives in **different forms**—some as spreadsheets, some as **download links**—and none of it matches Shopify’s expectations out of the box.

I built **Python pipelines** that **analyse, clean, and reshape** supplier feeds into formats the shop can use, supported **dry-run validation** during setup, and put **GitHub Actions** on **supplier-appropriate schedules** to pull fresh data, **reconcile** it against the live store, and **update stock levels via Shopify’s API** (the scripts authenticate and call Shopify’s HTTP APIs; they are the **reliable automation** that talks to it). **Reports** highlight gaps: lines that exist **in the shop but not** in current supplier data, or **in supplier feeds but missing** from the store. **Supplier tags** on products keep work organised when triaging those exceptions.

The centre of the story is **streamlined operations**: background processes handle repetitive data and stock alignment, so the owner can focus on **range, service, and growing into ecommerce**—not on reconciling thousands of rows by hand.

---

## The Challenge

### The problem

1. **Volume and variety**  
   Four suppliers, ~5,000 SKUs, each with its own export shape. Shopify needs **consistent** identifiers and stock fields; raw supplier files don’t provide that without work in the middle.

2. **Mixed inputs**  
   Some feeds are **spreadsheet files**; others are **URLs** to the latest list. The tooling has to cope with **both** without a separate manual path for each.

3. **Two phases of the same problem**  
   - **Bootstrap**: get an initial catalogue into Shopify efficiently (bulk **import** from prepared spreadsheets).  
   - **Run-the-business**: keep **available quantity** honest as supplier stocklists change.

4. **Trust and exceptions**  
   As the store grows, drift between suppliers and the shop creates risk. The business needed **visibility**—not only updates, but **what doesn’t match** and **where to look**.

### Business requirements

- Normalise **multi-supplier** data into **shop-ready** structures.  
- Support **initial import** workflow and **ongoing API-based** stock updates (**Python jobs calling Shopify’s API**).  
- Run on **cadences that follow each supplier’s update pattern**, not a one-size-fits-all clock.  
- Produce **reconciliation reporting** (store-only vs supplier-only skew).  
- Use **supplier tagging** in Shopify so exception-handling and communication are scoped per source.

---

## The Solution

### Approach

**Encode supplier knowledge in code** instead of one-off spreadsheet gymnastics: per-supplier understanding of columns, semantics, and edge cases lives in **version-controlled** Python, so changes are traceable and repeatable.

**Phase 1 — Initial stocklist**  
Supplier exports are **transformed into spreadsheets** formatted for Shopify’s **import** flow, so large catalogues can be loaded without hand-keying thousands of products.

**Phase 2 — Live inventory**  
Automation uses **Shopify’s API** (authenticated with API credentials) so **Python scripts** can **read** the reconciliation target and **write** inventory updates—**no** reliance on manual re-import for every stock movement.

**Phase 3 — Operations**  
**GitHub Actions** run on **schedules tuned to how often each supplier refreshes their stocklist**, fetch files or pull from links, execute transforms, perform reconciliation, apply **API** updates, and emit **reports** for human review where judgment is still required.

**Safety during rollout**  
**Dry runs** were used in early setup to validate mappings and catch bad assumptions before anything touched live inventory.

---

## The End Product

### Multi-supplier normalisation (Python)

- Ingest from **mixed sources** (direct spreadsheet + **linked** feeds).  
- Clean, validate, and map into a **consistent internal representation** before export or API sync.  
- Handle supplier-specific quirks in code so onboarding a new file format is **extensible**, not a new manual ritual.

### Shopify integration

- **Bulk import**-compatible outputs for the **initial** catalogue load.  
- **Ongoing stock updates** via **Shopify’s API** so availability tracks supplier data without repeating the import flow every time.

### Scheduled automation (GitHub Actions)

- **Per-supplier cadence** aligned with how often each supplier updates their list.  
- Reliable, repeatable runs with a clear **audit trail** in CI (what ran, when).

### Reconciliation and reporting

Automated stock alignment is paired with **reports** that surface:

- Items **in the store** but **not** in current supplier data.  
- Items **in supplier feeds** but **not** reflected (or not present) **in the store** as expected.

That turns “is the shop wrong?” into a **short checklist** instead of a forensic spreadsheet marathon.

### Organisation in the admin

Products are **tagged by supplier**, so filtering, bulk actions, and triage stay **scoped** when resolving report exceptions or updating mappings.

---

## Results and impact

### Why metrics are qualitative here

The ecommerce side is **new**; there isn’t a long baseline for “hours saved.” The value is **structural**: at **thousands of product lines**, manual reconciliation **does not scale**, and automation **avoids** that trap as order volume and catalogue churn grow.

### Expected and emerging benefits

- **Time**: considerable reduction in work that would otherwise scale **linearly** with SKU count.  
- **Reliability**: scheduled jobs and **API** updates reduce dependence on “someone remembered to upload the file.”  
- **Clarity**: reconciliation **reports** and **supplier tags** make exceptions **visible and actionable**.  
- **Foundation**: the same patterns support **more suppliers** or **changed file layouts** with controlled code changes rather than operational heroics.

### Technical qualities

- **Separation of concerns**: ingest → normalise → reconcile → publish.  
- **Safe iteration**: **dry runs** during setup; reports for **continuous** sanity checks.  
- **Maintainability**: logic in **Git** with history, not undocumented spreadsheet formulas.

---

## Conclusion

For a business **new to ecommerce** but **not new to stock complexity**, the win is a **dependable back office**: supplier chaos is **normalised once**, then kept in step with [the Shopify storefront](https://eatcycling.co.uk/) through **scheduled jobs**, **API calls**, and **reports**. EAT Cycling gets a platform where **inventory reflects supplier reality** as closely as automation allows, while **people** spend effort on **judgment, range, and customers**—the work that actually compounds.

This engagement is **standalone** from other systems built for the same business: same client, **separate** focus on **catalogue operations, data pipelines, and Shopify stock automation**.

---

## Technical specifications

**Storefront:** [eatcycling.co.uk](https://eatcycling.co.uk/) (Shopify)  
**Commerce:** Shopify — bulk **import** for initial catalogue; **Shopify Admin API** (via API credentials) for ongoing stock updates from **Python** automation  
**Data transformation:** Python  
**Automation & scheduling:** GitHub Actions (cadence **per supplier**)  
**Inputs:** Mixed — **spreadsheet files** and **HTTP-linked** supplier feeds  
**Observability:** **Reports** for store↔supplier skew; **dry runs** during setup  
**Merchandising:** **Supplier tags** on products for scoped admin work  

---

*Case study: supplier data engineering, Shopify inventory automation, and operational reporting for a multi-source retail catalogue.*
