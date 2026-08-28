# Disco - Brand Performance Dashboard (Option A)

Live deployment: https://vilnius-zeta.vercel.app

## What I built and why

I built a decision-support dashboard for brand managers managing post-purchase offers.

The existing dashboard gives them performance data, but the research pointed to a more fundamental problem: **they can see the numbers, but they don’t know what deserves attention or why an offer is performing a certain way.**

I focused the experience around:

**Identify → Understand → Investigate**

The Overview surfaces offers that need attention. From there, brand managers can drill into an offer, understand what changed, and investigate performance across placements and devices.

The product can suggest a relevant next step, but I intentionally stopped before the actual offer-editing workflow. The focus here is helping someone make a better decision before they optimize the offer.

---

## What drove the key decisions

The interviews highlighted that brand managers wanted to know **what changed, why some offers worked while others didn’t, and where they should focus their attention.**

That led to a few key decisions:

- Use status tags and filters such as **Needs attention / On track / Top performers** so users can quickly narrow down which offers need review.
- Let users sort by **CTR change over the selected period** to surface the biggest declines and improvements first.
- Show **performance trends over time** on Offer Detail so users can understand whether an offer is improving, declining, or stable.
- Break performance down by **placement** to show where an issue is concentrated, and by **mobile vs desktop** to understand whether device context is contributing to it.
- Add short **plain-language summaries** alongside charts and tables so users don’t have to interpret every metric themselves.
- Include product states for **default, loading, claimed/success, error, and empty** so the prototype covers the key non-happy paths.
- Reveal deeper analysis progressively, moving from **Identify → Understand → Investigate**.

The supplied data gave me the starting point:

- 2.4M monthly impressions
- 3.1% CTR
- 11% claim rate
- $18.2K monthly revenue
- Cashback as the top-performing offer type
- Bundle deals as the lowest-performing type at 1.8% CTR
- 74% mobile / 26% desktop traffic
- 3.8 days average time from impression to claim

For deeper offer-level states, I used a small amount of illustrative historical, placement, and device data to demonstrate how the investigation flow could work.

---

## What I chose not to build

**Offer optimization/editing**  
The prototype helps users understand the problem and identify a next step. Editing creatives, discounts, or placement configuration would happen in the existing management workflow.

**Full campaign management**  
Creating offers, budgets, campaign setup, and broader strategy weren’t necessary to solve the core problem.

**A larger analytics suite**  
More charts wouldn’t necessarily make the decision easier. Analytics are used as evidence, not as the product itself.

**AI-first interaction**  
I explored this direction, but kept AI optional. The experience should still work when users simply scan and investigate the dashboard.

---

## What I’d measure post-launch

**Time to identify** — How quickly can a brand manager find an offer that needs attention?

**Time to insight** — How quickly can they understand what changed and where the issue is concentrated?

**Investigation success** — Can they correctly identify the placement or device they should look at next?

**Time to decision** — How quickly can they decide whether to review the offer, review a placement, or continue monitoring?

Over time, I’d also look at downstream changes in **CTR, claim rate, and revenue** after users act on these insights.

---

## AI tools used

**ChatGPT** helped me synthesize the research, challenge the problem framing, explore alternative directions, and think through scope and trade-offs.

**Lovable** was used for quick ideation and early concept exploration before committing to the final direction.

**Codex** helped me turn the selected direction into a working prototype and iterate quickly on UI, interactions, and mock data.
