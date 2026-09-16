# TELL: product and implementation specification

Version 0.1 · 15 September 2026

Status: ready for a prototype implementation. The question bank, model parameters, archetypes, copy, and visual direction below are authored product decisions. They require testing with people before making claims about measurement quality.

Companion document: [market research](./market-research.md).

## 1. The product

TELL turns a small set of political choices into a personal **Sigil**, a readable account of someone's priorities, and an illustrated political passport they can send to friends.

The desired reaction is: "That's recognisable. That bit caught me. I need to send this to someone."

Use **TELL** as the working name throughout the prototype. Its central line is **"Every take tells on you."** The name is a working creative decision; domain and trademark availability have not been checked. Display the actual deployment hostname on exports, never an invented registered domain.

The object is always "your Sigil" in user-facing copy. Use "political fingerprint" once as an explanation of the concept, not as a competing product name. Never call it Political DNA: the model describes selected opinions, not biology or an immutable identity.

The first implementation milestone is the artifact studio in section 13. It renders 20 fictional profiles and their cards before the questionnaire UI. The quiz engine can follow once the visual system makes people want to discover their own Sigil.

### Audience and scope

- Primary audience: adults roughly 18–29 who encounter political takes through Instagram, X, TikTok, and group chats. Write for someone who understands everyday conflicts but has never studied political theory.
- Initial language: English. Scenarios concern broad political values rather than a particular election or national party system.
- First result after 12 short decisions. Target roughly two minutes; validate the timing before using a more specific promise.
- Optional adaptive follow-ups, with a maximum of 18 total question presentations per run.
- One web page at `/`, deployed as static assets on Vercel. All computation, result rendering, image export, and friend comparison happen in the browser.
- No backend, database, account, runtime language model, or profile scraping.

### Required v1 experience

1. An immediate invitation and a visible example of the object the user will get.
2. Twelve short scenarios with two large answer buttons and a quiet skip.
3. A Sigil reveal with an archetype when enough answers support one.
4. Six understandable dimensions and an explanation tied to actual answers.
5. Up to two specific tensions, when qualifying answer pairs exist.
6. A fictional archetype as a debate foil.
7. Automatic preparation of a portrait passport, horizontal card, square card, and avatar, followed by explicit save/share actions.
8. A result link that lets a friend take the test and see the two Sigils interact locally.
9. Optional follow-ups chosen using expected information gain.
10. Complete keyboard, reduced-motion, small-screen, and error behavior.

### Deliberate boundaries

Public-figure matching is deferred. It needs a separately maintained, cited set of public positions, comparable scoring, dates, and a correction process. The first release uses fictional archetypes for the comparison hook. Do not invent politician scores or infer a real person's private beliefs.

X-profile analysis is also deferred. It would change the data flow, evidence requirements, and consent experience. Generated artwork is a build-time asset; it does not analyze the user.

## 2. Political model

Define the space before styling the result. The six dimensions are separate hypotheses about preferences. Independence is an initial computational assumption, not an empirical finding.

Every question measures one primary dimension in v1. This makes answer explanations and the limits of the model inspectable. Many real answers have several motivations; do not pretend that one selection proves all of them.

| ID | Dimension | Score 0 end | Score 100 end | What it describes | What it does not establish |
| --- | --- | --- | --- | --- | --- |
| M | Provision | Public provision | Markets | Preference for public delivery versus competing private providers in the scenarios shown. | Whether the person wants an effective state, cares about poverty, or supports every business. |
| A | Freedom | Social order | Autonomy | Willingness to protect individual choice when it imposes inconvenience, offence, or risk on others. | Whether the person is kind, selfish, or approves of the protected behavior. |
| I | Institutions | Challenge institutions | Trust institutions | Willingness to defer to established institutions versus seek outside checks or replacement. | Expertise, support for democracy, conspiratorial beliefs, or state capacity. |
| G | Belonging | National priority | Global concern | How much national membership should change cooperation, opportunity, and obligations. | Ethnicity, personal tolerance, or feelings about every border policy. |
| E | Distribution | Unequal rewards | Equal outcomes | Preference for reducing differences in resources versus allowing rewards and inheritance to create larger differences. | Work ethic, personal generosity, or belief that all inequality is deserved. |
| T | Change | Precaution | Acceleration | Willingness to introduce new technology under uncertainty versus wait for more evidence. | Technical knowledge, support for a particular company, or confidence that technology always helps. |

"State capacity" is intentionally not smuggled into M or I. The initial bank does not measure it independently. Similarly, merit and inherited advantage are different; E deliberately tests both, and a split can produce a useful tension.

### Display rules

- Scores are leaning indices on an authored scale. Never append `%` to an individual dimension or describe it as a probability that the person is an ideology.
- Round displayed and shared scores to the nearest five. Keep more precise values only during internal calculations.
- Show both ends of each dimension. "Markets 70" by itself is incomplete.
- With no substantive answer on a dimension, show `—` and "Not enough answers". Never turn missing answers into a centrist score.
- With one substantive answer, show a provisional marker and "One answer so far".
- With two or more, show the leaning and "Based on {n} choices". A near-middle score means "Mixed across these choices", not "moderate" or "no opinion".
- A high score is not a better score. Color, size, and motion must not celebrate one pole over the other.

## 3. Questionnaire interaction

### The answer task

One scenario at a time. Two concrete responses. The persistent helper is:

> Pick the closer one. Neither fits? Skip it.

This acknowledges the forced tradeoff without introducing another scale. Do not add "strongly agree", a confidence slider, required explanations, or timers.

Cards contain a short context prompt and complete answer labels. They resemble editorial take cards, without fabricated usernames, likes, quotes from real people, or social-proof counters. Position A and B have equal visual weight.

For each session, assign each item a stable random left/right or top/bottom order. Store that presentation order so revisiting does not move the answer. Scoring uses canonical answer IDs, never physical position. Screen-reader order matches visual order.

### Behavior

- The whole answer card is a button, at least 72px tall and usually 96–128px tall on mobile.
- A tap selects it, adds a check and 2px ink outline, then advances after 220ms. Ignore double taps during this transition.
- Keyboard users tab between choices and press Enter or Space. Optional shortcuts `1` and `2` match the displayed order and appear only where there is room.
- "Skip this one" records a skipped presentation and advances without changing scores.
- "Back" returns to the previous presented item with its answer selected. It never acts like a destructive restart.
- Editing an earlier answer keeps the already-presented path. Recompute from the answer ledger and select future follow-ups from the revised state. Never count an old and new answer twice.
- Browser Back follows meaningful states: result to last question, question to previous question, first question to intro. Opening and closing a sheet returns to the same question.
- Move focus to the new question heading after advancing. Announce the question number. Do not announce decorative animation.
- No swipe gesture is required. Swipes can conflict with browser navigation and obscure the choices.

### Initial sequence

Ask this fixed sequence once, with independently randomized answer presentation:

`M1 → A1 → I1 → G1 → E1 → T1 → M2 → A2 → I2 → G2 → E2 → T2`

This gives two different contexts per dimension before adaptive selection begins. The fixed first pass also makes early usability comparisons easier.

Progress copy is "{n} of 12". After question 12, show the result immediately. Do not make a 100% progress bar suddenly acquire six extra mandatory questions.

From the result, "Sharpen my read" opens optional follow-ups. Its helper reads "Up to 6 more choices, picked from what you haven't answered yet." In this mode show "Extra choice {n} of up to 6" and a visible "Back to my result" action. Returning early retains answered follow-ups and the remaining budget.

## 4. Complete question bank

The prompt and A/B copy below are the actual UI text. IDs, scores, and context tags are implementation metadata. A `+` points toward the score-100 end of its dimension; a `−` points toward the score-0 end. Every item has the same initial measurement strength. There are no hidden cross-dimension bonuses.

M1–T2 in the sequence above are the 12 core items. Items numbered 3–5 are the adaptive pool.

### M: public provision and markets

| ID | Prompt | Answer A | Answer B | A / B | Context |
| --- | --- | --- | --- | --- | --- |
| M1 | Your city's rent is out of control. Pick the first move. | Let developers build more homes at market rents. | Use taxes to build more publicly owned homes. | + / − | Housing |
| M2 | Your train service is terrible. Who should run the replacement? | One public operator, answerable to voters. | Competing companies, with riders choosing between them. | − / + | Transport |
| M3 | Internet service in your town is expensive and slow. Your move? | Build a publicly owned network. | Make it easier for new providers to compete. | − / + | Internet |
| M4 | There's money to make childcare cheaper. Where should it go? | Vouchers families can use with private providers. | More publicly run childcare centres. | + / − | Childcare |
| M5 | Your region is rebuilding its electricity system. Pick the setup. | Competing suppliers, with prices shaped by competition. | One public supplier, with prices set by elected leaders. | + / − | Electricity |

### A: social order and autonomy

| ID | Prompt | Answer A | Answer B | A / B | Context |
| --- | --- | --- | --- | --- | --- |
| A1 | A peaceful protest blocks a busy road for hours. Your call? | Clear the road so everyone else can get through. | Let it continue. Disruption is part of protest. | − / + | Protest |
| A2 | A publicly owned theatre books a comedian many find offensive. Your call? | Keep the show. People can choose to stay away. | Cancel it. A public venue should set limits. | + / − | Speech |
| A3 | Police want face-scanning cameras in busy public places. Your call? | Keep public spaces free of routine face scanning. | Allow it to help police catch suspects. | + / − | Surveillance |
| A4 | Late-night venues bring jobs and noise. Pick the rule. | Earlier closing times so neighbours can sleep. | Later opening hours, even with more street noise. | − / + | Nightlife |
| A5 | Adults want to try a sport with a high injury rate. Your call? | Ban the riskiest version to prevent serious injuries. | Allow it if participants understand the risk. | − / + | Personal risk |

### I: challenging and trusting institutions

| ID | Prompt | Answer A | Answer B | A / B | Context |
| --- | --- | --- | --- | --- | --- |
| I1 | A new food ingredient passes official safety checks. Your first instinct? | Trust the checks unless new evidence appears. | Wait for checks outside the regulator. | + / − | Regulators |
| I2 | Two candidates promise the same changes. Who gets your first look? | An outsider who wants to replace the political establishment. | Someone who knows how to get things done inside it. | − / + | Political leadership |
| I3 | A housing agency keeps missing its targets. Who should take over? | Experienced public administrators with a new plan. | A new board of residents outside the agency. | + / − | Agency leadership |
| I4 | A council scandal breaks. Who should lead the investigation? | A citizens' panel chosen by lottery. | The existing independent public watchdog. | − / + | Accountability |
| I5 | A court blocks a popular law. Who should get the final say? | Judges applying the country's legal rules. | Voters deciding directly in a referendum. | + / − | Courts |

### G: national priority and global concern

| ID | Prompt | Answer A | Answer B | A / B | Context |
| --- | --- | --- | --- | --- | --- |
| G1 | Two equally qualified people want the same job. One lives abroad. Your rule? | Give local citizens first access. | Let both compete on the same terms. | − / + | Work |
| G2 | Emergency medicine is scarce. People at home and abroad need it equally. Who first? | Send it wherever it can help, regardless of nationality. | Cover people at home before sending supplies abroad. | + / − | Aid |
| G3 | A climate deal helps every country but limits your country's choices. Your call? | Join and accept the shared rules. | Keep control, even if cooperation gets harder. | + / − | Cooperation |
| G4 | Families fleeing danger need homes. Taking more will strain local services. Your call? | Limit arrivals until local services catch up. | Take more families in and expand services. | − / + | Refuge |
| G5 | A public project can buy local or import the same quality for less. Your pick? | Pay more to support jobs at home. | Buy the cheaper imports and use the savings elsewhere. | − / + | Trade |

### E: unequal rewards and equal outcomes

| ID | Prompt | Answer A | Answer B | A / B | Context |
| --- | --- | --- | --- | --- | --- |
| E1 | Someone inherits a huge fortune. Pick the rule. | Tax a large share to fund starter grants for everyone. | Let the family keep most of what it passes down. | + / − | Inheritance |
| E2 | Your team earns a bonus. Some people contributed much more. How should it split? | Give everyone an equal share. | Give bigger shares to the biggest contributors. | + / − | Rewards |
| E3 | A university has a few full scholarships. Who gets priority? | Students with the highest grades. | Students who couldn't otherwise afford to attend. | − / + | Opportunity |
| E4 | A company's boss earns 100 times the typical worker. Your call? | Limit the pay gap, even if some bosses leave. | Allow it if the company chooses to pay it. | + / − | Pay gaps |
| E5 | Your town funds youth sports. Where should the extra money go? | Help talented players reach the highest level. | Make sure every child can take part. | − / + | Shared resources |

### T: precaution and acceleration

| ID | Prompt | Answer A | Answer B | A / B | Context |
| --- | --- | --- | --- | --- | --- |
| T1 | Driverless buses pass early tests but have little road experience. Your call? | Start a limited public trial with close monitoring. | Wait for a longer safety record before carrying passengers. | + / − | Transport technology |
| T2 | An AI tutor looks useful, but long-term effects are unclear. Your school's move? | Wait for independent long-term studies. | Offer an optional trial and check how students do. | − / + | Education technology |
| T3 | Lab-grown meat passes initial safety checks. What should happen next? | Sell it with clear labels while research continues. | Wait for longer studies before putting it in shops. | + / − | Food technology |
| T4 | A new flood barrier could work better, but the old design is well tested. Your pick? | Use the proven design, even if progress is slower. | Try the new design at a monitored pilot site. | − / + | Infrastructure technology |
| T5 | An AI tool can do half your job but still makes mistakes. Your workplace's move? | Start using it with people checking its work. | Wait until it is more reliable before rolling it out. | + / − | Workplace technology |

### Editorial constraints for future revisions

Keep each question understandable without statistics, party names, recent news, or legal expertise. Use complete tradeoffs rather than "good outcome versus obviously bad outcome". Avoid factual claims about whether a hypothetical policy actually works. The scenario defines the choice; the answer does not endorse a factual assertion.

The bank has known boundaries. The market questions mostly concern essential services, I sometimes contrasts professional and citizen authority, and T concerns monitored adoption. These are the meanings the initial result is permitted to claim. Broader claims require a broader bank and evidence.

M1, for example, measures a first housing-policy preference. It does not establish that the user resents developer profits, wants deregulation everywhere, or opposes all public housing.

## 5. Scoring and adaptive selection

### A small probabilistic model

Use six separate Bayesian grids in browser memory. This is an explicit provisional item-response model. No fitted data currently supports the item parameters, and the model's internal certainty is not measured real-world accuracy.

For every dimension:

- Latent grid `theta = -3, -2.9, ... , 2.9, 3`, 61 points.
- Prior mass proportional to `exp(-theta² / (2 × 1.2²))`, normalized over the grid.
- Each item's initial discrimination `a = 1.2` and threshold `b = 0`.
- Positive-pole choice likelihood `Lplus(theta) = sigmoid(a × (theta - b))`.
- Negative-pole likelihood `Lminus(theta) = 1 - Lplus(theta)`.
- On a substantive answer, multiply the dimension's current mass by the relevant likelihood and normalize.
- On skip, do not update any dimension.
- Internal leaning index `s = 100 × sum(p(theta) × sigmoid(theta))`.
- Visible leaning `S = 5 × round(s / 5)` when at least one substantive answer exists.

Maintain the full distribution and answer ledger. Do not reduce state to an archetype. Rebuild distributions from the prior when an answer changes, a run resumes, or model-version validation requires it.

The logistic response form has established statistical uses, including item-response models described in the [Stan User's Guide](https://mc-stan.org/docs/stan-users-guide/regression.html). The six dimensions, bank, parameters, and stopping rules here are our uncalibrated design, not an externally validated test.

Giving every item identical parameters is deliberate. We have no evidence that a clever-sounding question is more discriminative. The first adaptive version chooses uncertain dimensions and unused contexts. It must not claim item-level psychometric calibration.

### Expected information gain

For each unanswered optional item, calculate expected posterior entropy reduction in its dimension:

```text
H(p) = -sum(p[k] * ln(p[k]))
qPlus = sum(p[k] * Lplus[k])
pPlus = normalize(p * Lplus)
pMinus = normalize(p * (1 - Lplus))
gain = H(p) - qPlus * H(pPlus) - (1 - qPlus) * H(pMinus)
```

An item already presented, including a skipped one, is ineligible. Core items do not re-enter the optional pool. Within one dimension, initial gains are equal because parameters are equal. Break ties by:

1. Fewer substantive answers in the dimension.
2. A dimension different from the immediately previous question.
3. Lexicographic question ID.

First prioritize eligible items on dimensions with fewer than two substantive answers. Within that set use the same gain ranking. Once all dimensions have at least two, use gain ranking across the remaining pool.

Stop the optional sequence when any of these holds:

- Six optional items have been presented.
- No unused optional items remain.
- All dimensions have at least two substantive answers and the best expected gain is below `0.095` natural-log units.
- The user selects "Back to my result".

The `0.095` cutoff is a prototype tuning choice, not a confidence guarantee. With the parameters above, two aligned answers have roughly `0.087` expected gain from another item, while two opposing answers have roughly `0.101`. A third answer after a split reduces the remaining gain to about `0.084`. The initial rule therefore revisits mixed or missing dimensions and usually stops after one extra context per mixed dimension. At the cap, return a result even if uncertainty remains. Do not claim that the algorithm has "figured you out".

Hide `Sharpen my read` when the stopping rule already holds; retain answer review. A person with aligned core answers can finish at 12, while six split dimensions lead to 18. The prototype model should reproduce visible scores of 70 for two positive answers, 30 for two negative answers, 50 for a positive/negative pair, and 60 for one positive answer.

### Why not use certainty to choose the label?

A narrow distribution is only narrow under this authored model. The user-facing label is a descriptive nearest prototype, accompanied by the relevant answer coverage. Do not print "92% certain you're a Market Rebel" or turn prototype distance into a probability.

Future calibration requires real responses, item review, and held-out prediction checks. Fifty pilot participants can expose confusing wording and surprising combinations; they do not establish a validated six-dimensional psychometric instrument.

## 6. Archetypes and result copy

### Assignment

Each prototype uses the dimension order `[M, A, I, G, E, T]`. The values are authored reference points in the visible index space.

Only assign a named archetype when all six dimensions have at least two substantive answers. Otherwise use **"The Unfinished Portrait"** with "A few choices are still missing. You can share this sketch or sharpen the read."

For a complete profile, first use **"The Mixed Signal"** if all scores are within five points of 50. Otherwise compute `D = sqrt(mean(((S[d] - prototype[d]) / 100)²))`. Sort by D, breaking exact ties by the stable archetype ID. If best D exceeds `0.18`, also use The Mixed Signal. Its description is "Your choices cross our categories. Your Sigil carries the detail."

If the best two are within `0.025` of each other and the best D is at most `0.18`, still use the closest title, with "Also close to {second title}" beneath the description. Never display a fake rarity rank.

| Stable ID | Title | Prototype M/A/I/G/E/T | Exact short description |
| --- | --- | --- | --- |
| techno-cosmopolitan | The Techno-Cosmopolitan | 70 / 70 / 60 / 70 / 40 / 75 | Open markets, open borders, room to experiment. You lean toward building what comes next. |
| civic-progressive | The Civic Progressive | 35 / 65 / 70 / 70 / 70 / 60 | You lean toward public solutions, personal freedom, and institutions that can deliver change. |
| market-rebel | The Market Rebel | 75 / 75 / 25 / 55 / 30 / 65 | You favour competition and personal choice, with little instinct to defer to the establishment. |
| solidarity-sceptic | The Solidarity Sceptic | 30 / 65 / 25 / 65 / 75 / 45 | You want resources shared more widely, and you question who gets to make the rules. |
| protectionist-traditionalist | The Protectionist Traditionalist | 45 / 25 / 60 / 25 / 45 / 25 | You put weight on stability, national priorities, and caution about rapid change. |
| local-builder | The Local Builder | 35 / 45 / 65 / 30 / 65 / 70 | You favour public investment and new tools, with responsibility starting close to home. |
| open-society-reformer | The Open-Society Reformer | 50 / 75 / 65 / 75 / 60 / 55 | You lean toward personal freedom and wider belonging, with change through existing institutions. |
| cautious-egalitarian | The Cautious Egalitarian | 30 / 50 / 60 / 55 / 75 / 25 | You want gaps narrowed and public needs met, with careful checks on what comes next. |
| sovereign-entrepreneur | The Sovereign Entrepreneur | 75 / 50 / 40 / 25 / 30 / 70 | You favour competition and new technology, while keeping national choices close to home. |
| order-liberal | The Order Liberal | 70 / 30 / 70 / 60 / 35 / 50 | You lean toward markets and established institutions, with firmer limits on individual disruption. |
| techno-populist | The Techno-Populist | 50 / 45 / 25 / 35 / 65 / 75 | You want new tools and a wider share of the rewards, without waiting for the establishment. |
| independent-humanist | The Independent Humanist | 45 / 75 / 30 / 75 / 65 / 30 | You favour personal freedom and wider solidarity, while questioning both authority and rapid technological change. |

These descriptions explain the prototype. Label their section "Closest archetype". The stronger personal claim beneath it must use the user's actual answers.

### The personal read

Rank dimensions with at least two answers by `abs(S - 50)`, using M/A/I/G/E/T as the stable tie order. Select up to two with `S <= 40` or `S >= 60`. Join their corresponding clauses with "; ". Prefix "In these choices, you leaned toward ".

| Dimension | Lower-pole clause | Higher-pole clause |
| --- | --- | --- |
| M | public services doing more of the work | competing providers doing more of the work |
| A | shared rules when personal choices affect others | personal choice despite its costs to others |
| I | outside checks on established power | working through established institutions |
| G | obligations starting with people at home | treating national borders as less decisive |
| E | allowing rewards and inheritance to create bigger differences | narrowing gaps in resources and opportunity |
| T | waiting for more evidence before adopting new technology | trying new technology with monitoring |

If there are no qualifying dimensions, use "Your answers change with the situation. Open the six dimensions to see where." If only one qualifies, use that clause alone. Do not infer a third preference to make the sentence more dramatic.

### Your debate foil

Section title: **"Your group-chat nemesis"**.

For a complete profile, mirror its visible scores with `100 - S` and find the nearest different prototype with the same distance function. Caption it "A fictional archetype that pulls against your strongest preferences." Link "Where we'd argue" to the two largest user-versus-foil dimension gaps, with both positions named.

If every user score is within ten points of 50, use "No obvious nemesis" and "Your choices are too mixed for a clean opposite." Omit the foil for incomplete profiles. This is a debate prompt, not a claim about a real enemy or someone's personality.

## 7. Tensions: the feature that earns the screenshot

The heading is **"Okay, explain this."** Each tension must quote two selections from the actual answer ledger. A different preference in different contexts is a tension, not proof of hypocrisy.

Use these rules exactly. Canonical choices refer to the bank, independent of display order. Rank qualifying rules in table order and show at most two. Do not generate harsher accusations with an LLM.

| ID | Required answers | Exact tension copy |
| --- | --- | --- |
| earned-not-inherited | E1 A + E2 B | "Tax the inheritance. Reward the contribution. You draw a line between getting ahead and being born ahead." |
| public-exception | M1 B + M2 B | "Public homes. Competing train companies. You change your answer depending on the service." |
| loud-freedom | A1 B + A4 A | "Block the road for a protest. Close the bars so neighbours can sleep. Which kind of disruption earns a pass?" |
| speech-exception | A1 B + A2 B | "You protect a disruptive protest, but cancel an offensive show at a public venue. Where does expression cross your line?" |
| outsider-experts | I1 A + I2 A | "You trust the official safety checks, but give the political outsider the first look. Your trust depends on the institution." |
| earned-belonging | G1 B + G2 B | "Equal access to the job. Citizens first for scarce medicine. Opportunity and obligation get different rules." |
| borders-and-belonging | G1 A + G2 A | "Local workers first. Emergency help across borders. Nationality matters differently when the stakes change." |
| earned-not-given | E1 B + E2 B | "Reward the biggest contribution, and protect the inheritance. How much should getting ahead depend on what you did?" |
| different-speeds | T1 A + T2 A | "Driverless buses can start a trial. AI tutors should wait. You're open to new technology on different timelines." |
| public-with-outsiders | M1 B + I3 B | "You want public housing, with outsiders taking charge when the agency fails. Public ownership doesn't mean automatic trust." |

Every displayed tension has "Show my choices". It opens the two exact prompts, answers, and an "Edit" action for each. Editing may remove the tension immediately; do not preserve it to keep the result entertaining.

If no rule matches, show "No obvious plot twist yet." and "The choices you made don't trigger one of our answer-pair contrasts." Never fabricate a contradiction to fill a mandatory result slot.

Tensions are available to the owner. A standard shared result link contains scores, coverage, and a visual seed only, so it cannot reconstruct these claims. Do not show a fabricated answer explanation on a recipient's copy.

### The optional heresy

"Your heresy" is a stronger, narrower claim than an answer-pair tension. It identifies an answer that points away from the assigned archetype's preference on the same dimension.

Only consider it for a complete profile with a named archetype, best distance at most `0.18`, and a runner-up distance margin of at least `0.025`. Require a prototype pole of at most 35 or at least 65, and a user selection in the opposite direction. Among candidates choose the strongest prototype pole, then earliest answered question ID. Show one at most.

Use the literal template "Your heresy: {chosen answer, without final punctuation}." Below it on the website write "This cuts against your closest archetype's {pole label} preference." Quote the question and answer in the explanation drawer. Do not call it hypocrisy or say it is what a real political tribe believes.

If no answer qualifies, omit the heresy. If the same answer already appears in the first tension, show the tension in the detail section but do not add a second accusation. Heresy appears on the owner's site; including it in a shared image requires an off-by-default `Include my heresy` toggle. The link never includes raw answers or heresy text.

## 8. One-page structure and flow

Use one document at `/` with mutually exclusive primary states. There is no dashboard or separate questionnaire route. Drawers and expanded result sections stay in the same document.

```text
Intro ── Start ── 12 choices ── Result
  │                              ├── Why this? / answer edits
  │                              ├── Optional follow-ups ── updated result
  │                              ├── Save or share card
  │                              └── Copy comparison invitation
  └── Incoming result link ── Friend's Sigil
                                  └── Take mine ── 12 choices ── My result + comparison
```

### A. Intro

Keep the first screen short enough that the start button is visible on a 390 × 844 viewport. At smaller heights, allow normal scrolling.

Header: `TELL` at left; `How it works` as a text button at right.

Main copy:

> EVERY TAKE TELLS ON YOU.
>
> Find the shape of your politics.
>
> 12 quick choices. Your politics, made into a Sigil.
>
> [ Make my Sigil ]
>
> About 2 minutes · No sign-up

Show an upright, engraved sample passport labelled "EXAMPLE" with a deterministic sample Sigil. Use the Techno-Cosmopolitan reference profile as sample data; it must never masquerade as the visitor's Sigil. The sample is secondary to the start action.

Lower supporting line: "A political fingerprint you can put in the group chat."

Footer links: `How it works` · `Privacy`. Both open in-page sheets. Footer text: "A playful read of the choices you make here."

The header remains small. Avoid a navigation menu, scrolling logo cloud, fabricated testimonial, user count, or list of product features.

### B. Question

Mobile layout, from top:

1. `TELL`, Back, and "{n} of 12" in a compact header.
2. A thin progress line. For the core it reflects completed presentations divided by 12.
3. Small context label such as `HOUSING`.
4. The prompt in large sentence-case type.
5. Two stacked answer cards, with clear separation and equally strong styling.
6. "Pick the closer one. Neither fits? Skip it."
7. `Skip this one`.

On desktop, centre the prompt over two side-by-side answer cards inside an 860px maximum-width column. Keep the background quiet. The question is the most prominent content.

After selecting the last core answer, move straight into the reveal. Do not require another "Submit" button or an email address.

### C. Reveal

Show "YOUR SIGIL IS READY." and draw its engraved lines over 700ms. Fade the title in at 350ms, then show the personal read. All content and actions become available within 900ms. This is a transition, not a fake analysis job. Skip the sequence after an answer edit or return visit.

Reduced-motion users receive the finished result immediately with a short opacity fade of at most 120ms.

### D. Result

Mobile order:

1. "YOUR SIGIL" and coverage status.
2. Large generated emblem, archetype title, personal read, three strongest measured traits, and artifact ID.
3. Primary `Share my Sigil`, secondary `Save image`, tertiary `Copy my link`.
4. Story/Post/Square/Avatar format selector with an accurate preview.
5. "Your heresy" if eligible, then "Okay, explain this." with qualifying tensions.
6. "The six dimensions" with labelled spectrum rows.
7. `Why did I get this?` and `Sharpen my read` when eligible.
8. "Your group-chat nemesis".
9. "Send it to someone who'll disagree." with `Invite a friend`.
10. `Start again`, `How it works`, and `Privacy`.

Desktop uses an editorial two-column result layout, roughly 5/7 width. The artwork and export controls sit in the left column, with the explanation, tensions, and dimensions on the right. The artwork may stick below the header while the right column scrolls. At narrow widths everything becomes one column.

The six dimension rows have both pole labels, a marked midpoint, a dot at the score, and a textual leaning. Example: `Public provision — Markets · 70 toward markets · Based on 3 choices`. Color alone never communicates a position.

### E. Why did I get this?

Open an accessible side sheet on desktop or a full-height sheet on mobile. Title: "Your choices, connected."

Intro: "Each choice informs one dimension. Tap an answer to revisit it. The label is the closest of our written archetypes."

Each dimension expands to show answered prompts, exact chosen answers, and "Points toward {pole}". Show skipped prompts separately as "Skipped · no effect". Use the answer ledger as the source, not a generated explanation.

The sheet also shows the model's version and a `How scoring works` disclosure. Its first paragraph is: "This is a short, uncalibrated model of these choices. The numbers describe a leaning on our scale. They are not a diagnosis, a percentile, or a probability that a label is true."

Owner edits return to the selected question with `Save answer` instead of auto-advance. Saving recomputes the result, export caches, foil, comparison, and tensions together, then restores focus to the edited row. Cancel keeps the old answer.

Shared-view copy: "This link includes the Sigil scores, not the person's individual answers." Do not offer answer editing for someone else's link.

### F. Incoming link and friend comparison

Incoming view title: "Someone sent you their Sigil."

Show the sender's card with the badge "SHARED SIGIL" and CTA `Make mine & compare`. Supporting copy: "Take the same first 12 choices. See what happens when your Sigils meet."

After the visitor completes their own test, show their normal result first, then the comparison block:

> SAME CHAT. DIFFERENT POLITICS?
>
> Here's where your choices point in similar directions.

Introduce the two Sigils with the pair interaction defined in section 11. Keep solid and dotted outline keys plus text labels `You` and `Friend`. Underneath, show one row per dimension where both people have at least two substantive answers. Per row, calculate `gap = abs(S_you - S_friend)`:

- `0–10`: "Close on {dimension}".
- `15–25`: "Some distance on {dimension}".
- `30+`: "Far apart on {dimension}".

Show the two numerical leanings beneath the phrase. An overall alignment index is defined in section 11, with its formula exposed. Do not say "81% agree"; comparable scores do not prove agreement on the same propositions, especially after branching.

If at least four dimensions qualify, show "Closest on {smallest-gap dimension}" and "Most different on {largest-gap dimension}". Tie order is M/A/I/G/E/T. If all gaps are at most ten, show "Close across the measured dimensions" instead of manufacturing a fight. With fewer than four shared dimensions, show "Answer a few more to compare more of the picture."

`Share my Sigil` always exports the visitor's own card. A two-person export is deferred; the comparison interaction is available privately to the recipient of the invitation.

### G. Resume, restart, and failures

| State | Exact copy | Behavior |
| --- | --- | --- |
| Partial session in this tab | "Your choices are still here." | Buttons `Continue` and `Start fresh`. |
| Restart with stored answers | "Make a new Sigil? This clears the choices saved in this tab." | Buttons `Start fresh` and `Keep my Sigil`. Confirmation is only needed when answers exist. |
| Storage unavailable | "You can still take the test. Refreshing may clear your progress." | Keep the complete flow in memory. |
| Malformed link | "This Sigil link doesn't look right." | `Take the test` and `Try another link`; never overwrite an existing local result. |
| Unsupported result version | "This Sigil was made with a different version." | `Make a new Sigil`; never score it using a different model. |
| Incomplete result | "A few choices are still missing." | Show measured dimensions and `Sharpen my read` if items remain. |
| Optional questions exhausted | "That's the full read for this round." | Keep explanations and sharing available; no confidence claim. |
| Share dismissed | No toast. | Remain on the result. |
| Image export fails | "The image couldn't be prepared. Try again, or copy your link." | `Try again` and `Copy my link`; preserve answers. |
| Clipboard unavailable | "Copy this link to share your Sigil." | Reveal a selectable URL field. |
| Runtime result failure | "Your choices are still here. Let's rebuild your result." | `Try again`; recompute from the ledger without resetting it. |

## 9. Visual direction: a personal document from 2040

The reference vocabulary is currency engraving, guilloche linework, modern heraldry, print registration marks, and passport typography. The result should feel issued, personal, and worth keeping. Its political authority comes from composition and craft. It must remain recognisably a personal artifact rather than an official identity document.

Design the page like the small workshop that issues the object. The Sigil carries the visual complexity; the surrounding interface is quiet and readable.

### Palette and materials

| Role | Value | Use |
| --- | --- | --- |
| Paper | `#F2EFE6` | Page, passport, and default avatar background. |
| Ink | `#202923` | Text, structural lines, answer outlines, central glyph. |
| Secondary ink | `#5B645D` | Supporting copy on paper. |
| Rule | `#C9CEC3` | Dividers and unselected outlines. Never use it for body text. |
| Deep teal | `#215F69` | Cooler end of the Sigil's two-ink palette. |
| Oxide | `#994832` | Warmer end of the Sigil's two-ink palette. |
| Brass | `#8A6B31` | Small overprint accents and artifact details. |
| Button | Ink fill, paper text | Primary actions. |
| Selected answer | `#E1E8D8`, ink outline | Selection feedback without a "correct answer" color. |

No neon gradient fills, glass panels, soft blobs, confetti, holographic foil, national flags, literal shields, or podium badges. Do not recreate Spotify Wrapped. Limit paper texture to 2–3% opacity and keep it away from small text. The artifact can have precise registration marks and a fine double rule; it should not look artificially damaged or distressed.

Typography:

- `Bodoni Moda`, weight 600, for editorial hero and archetype titles. Its high-contrast serif connects to engraving without turning the page into a history museum.
- `IBM Plex Sans`, weights 400/500/600, for prompts, answers, body copy, and buttons.
- System monospace only for the small artifact ID and model version. Do not load a third font family for those details.
- Self-host licensed font assets. Provide serif and system-sans fallbacks. Export layouts must be verified with the actual loaded fonts.
- Main hero: 52–72px desktop, 38–46px mobile, line-height 1.02. Question: 32–40px desktop, 26–32px mobile, line-height 1.15. Body/answers: 18px with 1.45 line-height. Supporting copy: 14px minimum.
- Uppercase belongs to short artifact labels and archetype names on exports. Questions and answers remain sentence case.

Use a spacing scale of 4, 8, 12, 16, 24, 32, 48, 64px. Mobile horizontal gutters are 20px, reduced to 16px below 360px. Buttons have 6px corners; take cards have 8px corners and thin rules. The printed passport uses square corners. Shadows are restricted to a small physical-paper shadow in the live preview; exported images are flat artwork.

### Responsive and accessible behavior

- Design checkpoints: 320 × 568, 390 × 844, 768 × 1024, and 1440 × 900. Long questions and text at 200% zoom must scroll normally.
- Use dynamic viewport units for minimum page height, not a fixed-height container that clips answers. Add safe-area padding below sticky controls.
- Keyboard focus is a 3px high-contrast outline with 3px offset. Keep focus visible beneath sheets and sticky controls.
- Verify normal text contrast at least 4.5:1 and large text/control boundaries at least 3:1. Palette assignments are starting values, not proof of compliance.
- Use real headings, buttons, and labelled dialogs. Sheets trap focus, close on Escape, and restore the triggering control's focus.
- Normal nonessential transition duration is 160–240ms. No looped wobble, parallax, camera tilt, cursor-following effect, automatic sound, or vibration.
- Keep a textual summary next to every visual. An avatar or decorative Sigil alone is not an accessible description of the profile.

## 10. The Sigil generator

### What it is

A Sigil is a layered engraved emblem assembled from a shared geometric grammar. It has a central mark, a ring of small forms, and enclosing linework. It is legible at avatar size and rewards inspection at passport size.

It is an expressive encoding of the six displayed scores. It is not a radar chart, biometric fingerprint, authentication key, or measurement of traits beyond the six dimensions.

Every rendered size comes from the same deterministic geometry. A user's ideology controls the main shape and ink choices. A small stored visual seed controls fine engraving variation. Users with the same scores therefore share structural features but can have different fine details. Do not promise global uniqueness.

### Canonical construction

Use a 1000 × 1000 coordinate system centred at `[500, 500]`. Keep all geometry within a circle of radius 410. Build with vector paths and flat inks. Use a fixed, versioned pseudo-random generator for seeded details.

For each measured dimension, map visible score S into a visual parameter:

`u = clamp((S - 20) / 60, 0, 1)`

This intentionally expands the typical 30–70 score range so ordinary users still receive visibly different objects. It is an artistic transfer function, not a new score. Use `u = 0.5` only as an internal construction fallback for unmeasured dimensions, and apply the incomplete treatment below.

Build 16 radial motifs at equal nominal angles, starting at the top. Place inner node centres at radius 190 and outer pointed-element centres at radius 285. Each outer element is a rounded kite with its long tip 70 units from its centre, its opposite tip 20 units away, and a maximum half-width of 24. Curved ribs connect the inner node to that kite. Three enclosing arcs sit at radii 365, 378, and 390. Then apply the six transformations in the fixed order M, E, G, A, I, T. Seeded microvariation is the final step. Resolve intersections as overprinted linework, with a small clear area around the central glyph.

| Dimension | Geometric effect | Explicit mapping | Meaning shown in the interaction |
| --- | --- | --- | --- |
| M | Density | Each motif gets `round(5 + 7 × (1-uM))` fine connecting ribs. Overall silhouette size stays constant. | "Your provision choices affect the density of the engraving." |
| E | Distribution of visual weight | Central node radius is `24 + 28 × (1-uE)`. Peripheral node radius is `8 + 12 × uE`, with equal-size nodes at the equality end. At the unequal-reward end, vary peripheral sizes by up to 30% using a fixed angular cosine. | "Your distribution choices affect whether weight gathers at the centre or spreads across the emblem." |
| G | Inward or outward orientation | Rotate each pointed element relative to its radial direction by `180 × (1-uG)` degrees. Low G points inward; high G points outward; intermediate values rotate between them. | "Your belonging choices turn the forms inward or outward." |
| A | Openness and asymmetry | Open a top-facing arc gap of `10 + 80 × uA` degrees. Add a radial offset `18 × uA × sin(3 × angle + 0.7)` to motif centres. Low A remains nearly closed and regular; high A opens and offsets it. | "Your freedom choices open the shape and loosen its symmetry." |
| I | Continuity | On each rib, omit two fixed path intervals whose total length is `2% + 18% × (1-uI)` of that rib. High I is mostly continuous; low I is segmented. Use the same intervals on every render. | "Your institution choices affect the continuity of the linework." |
| T | Point sharpness | Outer points have a rounded tip radius of `6 + 18 × (1-uT)` units. Higher T reduces rounding. Increase outward reveal travel from 4 to 16 screen pixels with uT, capped by reduced-motion preference. | "Your technology choices sharpen the points and change the reveal's pace." |

These are visual metaphors. Fragmentation does not mean someone is unstable; density does not mean their views are complicated. The explanation must describe the mapping without assigning extra personality traits.

### Ink and central symbol

- Main structural engraving stays Ink on Paper.
- Choose the accent by G: mix Oxide and Deep teal in linear RGB with weight `uG`. Convert the result back to display RGB. This is a flat ink mix, not a gradient across the image.
- Use T to set the accent's share of engraving strokes from 15% to 40%. Apply accent to every nth complete rib deterministically; never randomly recolor individual fragments.
- The central symbol corresponds to the largest supported `abs(S-50)`, requiring at least two answers and a distance of ten or more. Tie order is M/A/I/G/E/T. A low-pole orientation and a high-pole orientation share the same underlying glyph family.
- Glyph families: M a bridge, A an aperture, I a gateway, G a crossing orbit, E a woven pair, T a forked ray. Use custom abstract line glyphs with the same stroke weight. Mixed or missing profiles use two intersecting arcs.
- All glyphs should remain geometric and nonliteral. Inspect the studio for accidental resemblance to known hate symbols, religious emblems, real party marks, military insignia, or government seals. Revise the shared grammar if needed.
- The generator must work without raster assets. Optional generated paper texture cannot contain letters, numbers, flags, faces, or score-dependent meaning.

### Seed, ID, and version

Create a random 32-bit `visualSeed` once per new run. Store it with the session and include it in shared links. It controls sub-1% offsets, engraving phase, and microdots only. It must not change the scores, archetype, principal geometry, or central symbol.

The artifact ID is a short visual checksum, for example `TC-87A4-1C2B`. Derive it from the canonical serialized visible scores, coverage counts, seed, model version, and render version. Use the archetype code followed by the first eight hexadecimal characters of SHA-256 in two groups. Define codes in archetype-table order: TC, CP, MR, SS, PT, LB, OR, CE, SE, OL, TP, IH. Mixed Signal uses MX; Unfinished Portrait uses UP.

Changing an answer can change the checksum; resizing, downloading, and re-opening the same shared payload do not. The ID is not registered anywhere and is not guaranteed unique. Do not use it as an authorization token or imply identity verification.

### Missing data and zoom levels

An incomplete profile has a dashed outer boundary, no asserted glyph for an unmeasured dimension, and a visible `SKETCH` label. Detail rows identify the missing dimensions. Do not give an unanswered dimension a finished visual meaning merely because the renderer needed a default parameter.

- At 64px: render the same silhouette and central symbol, reduce fine ribs to every fourth rib, and omit microdots. The reduced geometry must read as the same Sigil.
- At 200–500px: draw the full motif structure with sufficient stroke width to avoid screen moiré.
- At export size: include fine engraving and microdots. Rasterize at native output size, not an enlarged thumbnail.
- Level-of-detail changes remove small detail only. They never change the score-to-shape mapping.

### Touch and inspect

Below the live Sigil, offer `Read my Sigil`. It expands six labelled controls, not tiny scores wrapped around the emblem. Selecting one highlights that dimension's affected path groups and displays the mapping sentence from the table plus "Based on {n} choices".

Make the same controls available by keyboard. On desktop, hovering can preview the highlight; selection persists until another control is chosen or the disclosure closes. Tapping artwork can activate a corresponding region, but the labelled controls are always available. Exports have no controls or explanation overlays.

## 11. When two Sigils meet

The comparison should be a small event that tells the viewer something. It uses the measured scores, never the random visual seeds.

### Alignment index

Use dimensions where both participants have at least two substantive answers. Require at least four shared dimensions before calculating an overall index:

`alignment = round(100 - mean(abs(S_you[d] - S_friend[d])))`

Display **"{alignment}% ALIGNMENT"** with the nearby caption "Similarity of measured dimensions". A `How is this calculated?` disclosure contains the formula and "This compares leaning scores. It isn't the percentage of answers you agree on or a prediction of compatibility."

Also display "Across {k} of 6 dimensions". Never imply missing dimensions match. The index is a deliberately simple normalized distance, not a statistical probability. Because the questionnaire's estimates shrink toward the middle, the values will cluster relatively high; do not stretch or rank them to manufacture drama.

### Pair animation

Start with the two separate Sigils at 36% of the available width each. Keep labels `You` and `Friend` visible throughout. Maximum sequence length is 1.2 seconds. Play once after both profiles are ready, with a `Replay` control if desired.

| Index | Interaction | Resting image |
| --- | --- | --- |
| 85–100 | The emblems glide together and interleave their outer linework. | A partial overlap with both original outlines retained. |
| 70–84 | The emblems orbit a quarter-turn around a shared midpoint and overlap slightly. | Two connected forms with a small common region. |
| Below 70 | The emblems approach, then separate by a small distance. | Separate forms with two thin connecting lines across the gap. |

Do not shatter, attack, explode, or turn either participant red. The interaction describes visual distance, not good or bad people. Render the final layout immediately for reduced motion. No physics engine is necessary; explicit transforms are enough.

With fewer than four measured dimensions in common, skip the percentage and sequence. Place the two Sigils side by side with "A partial comparison".

### Comparison copy

- `Your fault line: {dimension}.` Only show if the largest measured gap is at least 20. Otherwise say `No major fault line in these choices.`
- `Your unlikely alliance: {dimension}.` Requires a largest gap of at least 20 elsewhere, a gap of at most ten in the alliance dimension, and both profiles leaning at least ten points away from 50 toward the same pole. Choose the strongest common leaning, then stable dimension order.
- If the latter rule fails, use `Closest on {dimension}.` when a measured dimension exists. Do not call two near-neutral values an unlikely alliance.
- Public dimension names in these phrases are `public services`, `personal freedom`, `institutions`, `national priorities`, `distribution`, and `technology`.
- CTA beneath the interaction: `Share my Sigil`. Secondary: `Invite someone else`.

The combined form is an interactive comparison in the visitor's browser. It does not replace either person's individual artifact or create a permanent merged identity.

## 12. The downloadable political passport

### Content hierarchy

The large Sigil dominates the card. The archetype is beneath it on portrait and square formats. Three traits support the identity without turning the image into a dashboard. The six full dimension rows remain on the website.

Shared artifacts contain:

1. Small `TELL / PERSONAL EDITION` heading.
2. The large Sigil.
3. Archetype title, with `CLOSEST ARCHETYPE` in small type for named profiles.
4. One short line composed from the user's supported leanings.
5. Up to three strongest traits, with leaning indices.
6. Optional heresy, if one qualifies and the user turns it on.
7. Artifact ID, model version, and the actual hostname.
8. Small footer `A read of my choices`.

Do not add a portrait photograph, user's name, location, political party logo, full answer list, rarity percentage, verification tick, or chart grid.

### Three strongest traits

Use dimensions with at least two answers and `abs(S-50) >= 10`. Rank by that distance and take at most three. A high-pole trait shows S; a low-pole trait shows `100-S`, so the number describes strength toward the named end. The small caption is `Leaning indices · not percentages`.

| Dimension | Low-pole label | High-pole label |
| --- | --- | --- |
| M | PUBLIC PROVISION | MARKETS |
| A | SOCIAL ORDER | AUTONOMY |
| I | INSTITUTIONAL SCEPTICISM | INSTITUTIONAL TRUST |
| G | NATIONAL PRIORITY | GLOBAL CONCERN |
| E | UNEQUAL REWARDS | EQUALITY |
| T | PRECAUTION | ACCELERATION |

Lay these out as separate typographic lines or short columns, with no miniature bars. If fewer than three qualify, show fewer. If none qualifies, use `MIXED ACROSS THESE CHOICES`. Never substitute a made-up strong trait to fill the layout.

### The share line

Take the two strongest qualifying dimensions using the same ranking. Choose their pole clauses below, join with a semicolon, lowercase the first letter of the second clause, and add a final full stop. With one qualifying dimension, use its clause alone. With none, use "A different answer for a different situation."

| Dimension | Low-pole clause | High-pole clause |
| --- | --- | --- |
| M | Build in public hands | Let providers compete |
| A | Keep shared rules strong | Leave room for personal choice |
| I | Make power earn your trust | Work through the institutions |
| G | Responsibility starts at home | Look beyond the border |
| E | Let the rewards differ | Close the gaps |
| T | Prove it before scaling it | Try it, watch it, learn |

This is intentionally written copy over actual score directions. Do not make claims about open source, housing exceptions, or disdain for elites unless supported by the questions and the relevant answer rule.

### Export layouts

| Format | Pixel size | Composition and safe area |
| --- | --- | --- |
| Story | 1080 × 1920 PNG | 90px side margins. Keep essential content between y=220 and y=1630 to leave room for platform controls. Sigil around 650px wide, centred near y=620. Title beneath it, followed by share line, traits, optional heresy, then footer. |
| Post | 1600 × 900 PNG | Horizontal card for X and group chats. 72px safe border. Sigil occupies the left 620px; title, share line, and up to three traits occupy the right. Keep the hostname within the central safe area. |
| Square | 1080 × 1080 PNG | 72px safe border. Sigil around 470px wide above a compact title and share line. Traits can use a single row where they fit. Use a shorter block layout when a title wraps. |
| Avatar | 1024 × 1024 PNG | Sigil only on Paper. Keep the silhouette inside a 780px circle so a circular profile crop preserves it. No text, ID, border, or heresy. Apply avatar level-of-detail rules. |

Portrait and Post exports reserve a heresy slot; when disabled, use that space for breathing room. For Square, place an enabled heresy in place of the share line, with a visible preview and label `Heresy replaces the headline in Square`. Avatar has no heresy toggle.

All text must fit through wrapping and measured layout. Set explicit two-line/three-line limits per slot. For unusually long archetype names, allow a smaller title size down to the defined minimum, then another line. Never crop text, use ellipses, or shrink small copy below 24px at 1080px width and 22px at 1600px width. Minimum title size is 48px on Story/Square and 56px on Post.

The UI must show the actual selected export composition, including heresy and all text, before the user shares. Do not show one design on screen and export a different template.

### Saving and sharing behavior

- Prepare the default Story image automatically when the Sigil is ready. Prepare the other format on selection or during idle time; do not eagerly allocate four large canvases at once.
- The default format on phones is Story; on desktop it is Post. Remember the user's selection within the tab.
- Use `navigator.canShare({files})` before file sharing. Invoke `navigator.share` directly from the user's action with a previously prepared file, preserving user activation. Support varies by browser and share target. [Web Share specification](https://www.w3.org/TR/web-share/)
- While an image is preparing, the button reads `Preparing image…` and has a progress announcement. Enable `Copy my link` throughout. If preparation takes longer than three seconds, show `Still preparing. You can copy your link now.`
- Where file sharing is unavailable, label the primary action `Save my Sigil`; keep `Share link` separately available where supported. The save action starts a PNG download. If the browser opens an image instead, display `Touch and hold the image to save it.`
- Suggested share text: `Here's my Sigil. Make yours and see where we clash.` Users can edit it in the receiving app.
- File name: `tell-{artifact-id}-{story|post|square|avatar}.png`.
- `Copy my link` copies the encoded result invitation. Success copy: `Link copied. Your choices stay private; your scores are in the link.`
- A cancelled native share is silent. Do not report a successful social post merely because the OS share sheet resolved.
- Never promise a direct Instagram Story or TikTok post. The browser cannot guarantee the destination or composition. Downloading the image remains the reliable fallback.

### Render implementation contract

Use one canonical scene description for the live artifact and PNG exports. The Sigil geometry, text content, measured layout, inks, and layer order must be shared. SVG can render the live emblem; Canvas can draw export paths and text from the same description.

Load and await the intended fonts before measuring export text. Use only same-origin or embedded raster assets so the canvas stays exportable. Avoid screenshotting the live DOM, which would couple exports to viewport size, controls, and browser rendering differences.

Invalidate cached image blobs when scores, coverage, title, heresy inclusion, format, seed, model version, render version, or displayed hostname changes. Retain the current run while rebuilding. Release object URLs and large offscreen buffers when they are no longer used.

## 13. First milestone: the artifact studio

Before implementing the question screens, build a private development view in the same application that renders 20 fixtures as a contact sheet. Keep it out of the production navigation. Label the view and every image `DESIGN STUDY · FICTIONAL PROFILE` so screenshots do not look like real participants.

The table supplies visual stress fixtures, not measured respondents. Each has six displayed indices and a fixed seed. Some values lie outside the range obtainable in a short prototype run; that is intentional for renderer stress testing. Studio names describe fictional stances. They must not override the production archetype assignment function.

| Fixture | Fictional person / stance | M | A | I | G | E | T | Seed | What the visual must reveal |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | Ari, open-market technologist | 70 | 70 | 60 | 70 | 40 | 75 | 101 | Open, outward, sharp, relatively light engraving. |
| F02 | Bea, public-service progressive | 35 | 65 | 70 | 70 | 70 | 60 | 102 | Dense, distributed, outward, mostly continuous. |
| F03 | Cam, market rebel | 75 | 75 | 25 | 55 | 30 | 65 | 103 | Open but fragmented, with concentrated visual weight. |
| F04 | Dev, solidarity organiser | 30 | 65 | 25 | 65 | 75 | 45 | 104 | Dense, distributed, segmented. |
| F05 | Eli, protectionist traditionalist | 45 | 25 | 60 | 25 | 45 | 25 | 105 | Closed, inward, rounded. |
| F06 | Fran, local public builder | 35 | 45 | 65 | 30 | 65 | 70 | 106 | Dense, inward, sharp, broadly distributed. |
| F07 | Gray, open-society reformer | 50 | 75 | 65 | 75 | 60 | 55 | 107 | Strong openness and outward orientation with continuous ribs. |
| F08 | Haru, cautious egalitarian | 30 | 50 | 60 | 55 | 75 | 25 | 108 | Dense, distributed, blunt outer points. |
| F09 | Ivo, sovereign entrepreneur | 75 | 50 | 40 | 25 | 30 | 70 | 109 | Light, inward, sharp, centrally weighted. |
| F10 | Jules, order liberal | 70 | 30 | 70 | 60 | 35 | 50 | 110 | More closed, light engraving, orderly continuity. |
| F11 | Kit, techno-populist | 50 | 45 | 25 | 35 | 65 | 75 | 111 | Sharp, fragmented, with distributed nodes. |
| F12 | Lou, independent humanist | 45 | 75 | 30 | 75 | 65 | 30 | 112 | Open, outward, rounded, discontinuous. |
| F13 | Max, markets with a strong state | 75 | 30 | 75 | 25 | 30 | 75 | 113 | Sharp, closed, regular, inward. |
| F14 | Noor, egalitarian technology sceptic | 25 | 75 | 25 | 75 | 75 | 25 | 114 | Dense and open, with blunt, fragmented outward forms. |
| F15 | Oren, mixed across everything | 50 | 50 | 50 | 50 | 50 | 50 | 115 | Balanced geometry, mixed glyph, no forced strong traits. |
| F16 | Paz, selective middle | 60 | 40 | 60 | 40 | 60 | 40 | 116 | A recognisably different emblem from F15 despite nearby values. |
| F17 | Quinn, all high-pole renderer stress | 100 | 100 | 100 | 100 | 100 | 100 | 117 | Maximum openness and points stay inside the safe bounds. |
| F18 | Remy, all low-pole renderer stress | 0 | 0 | 0 | 0 | 0 | 0 | 118 | Maximum density remains readable at 64px. |
| F19 | Sol, same scores as Ari | 70 | 70 | 60 | 70 | 40 | 75 | 119 | Same structure as F01, visibly different fine engraving only. |
| F20 | Val, unfinished portrait | 70 | — | 50 | — | 30 | 60 | 120 | Incomplete treatment; absent traits remain absent. |

Set coverage to three substantive answers per measured dimension for visual-only fixtures. Set missing coverage to zero. Because these fixtures lack real answer ledgers, they cannot produce heresies or evidence panels.

Separately add these two answer-ledger fixtures using the actual scoring engine. Use core sequence order and the displayed canonical answer IDs below. They check actual copy and mixed behavior without pretending synthetic scores came from those answers.

| Fixture | Complete core ledger | Expected visible scores M/A/I/G/E/T | Expected behavior |
| --- | --- | --- | --- |
| L01 | M1 A, A1 B, I1 A, G1 B, E1 A, T1 A, M2 B, A2 A, I2 B, G2 A, E2 B, T2 B | 70 / 70 / 70 / 70 / 50 / 70 | `earned-not-inherited` qualifies. E3 is the first optional item. |
| L02 | M1 A, A1 B, I1 A, G1 B, E1 A, T1 A, M2 A, A2 B, I2 A, G2 B, E2 B, T2 A | 50 / 50 / 50 / 50 / 50 / 50 | The Mixed Signal. No strong-trait list. Six dimensions qualify for an extra context. |

Use visual seeds 201 and 202 respectively. The renderer and result composer should handle these the same way as a real locally completed run, with a separate studio-only fictional label.

### Studio surface

- A four-column desktop contact sheet and one/two columns on mobile, with all 20 Story cards visible through scrolling.
- A selector to switch the entire sheet among Story, Post, Square, and Avatar.
- Clicking a card opens its full artifact and six controls to vary the scores, plus a reset button. This is a development tool, not a user feature.
- A second row of pair studies: F01/F19, F01/F05, F03/F04, F13/F14, and F15/F20. Mark these as fictional comparisons.
- A six-panel sensitivity study that holds five scores at 50 and changes the sixth through 20, 50, and 80. Each panel must visibly demonstrate its named mapping.

### Acceptance before moving to the questionnaire UI

1. The 20-card sheet looks like one family of issued objects while showing meaningful variation.
2. A viewer can recognise a Sigil at avatar size after seeing a full card.
3. F01 and F19 share a silhouette. Seed changes do not imply different ideology.
4. Each single-axis sensitivity study changes the intended property visibly.
5. The mixed profile looks intentional. The incomplete profile cannot be mistaken for a measured centrist.
6. Titles, three-trait layouts, and optional heresy slots fit in every export format.
7. In a quick review with several target users, the artifact prompts curiosity about their own version. Record the actual reactions, including disinterest; do not invent research results.

The implementing agent should finish the studio and render a reviewable contact sheet before asking for aesthetic approval. The human judgment of whether the artifact is desirable remains a real checkpoint. The question bank and model can be checked independently while that review happens.

## 14. Image-generation brief for the implementing agent

Generated visuals can help establish the material and engraving style. The final personal Sigil must remain procedural so its meaning, identity, and exports are consistent.

Use Codex image generation for the following build-time assets only:

### A. Art-direction reference sheet

Prompt:

> A flat print-design reference sheet containing twelve original abstract civic emblems for an imagined society in 2040. Modern currency engraving, fine guilloche lines, controlled geometric heraldry, off-white cotton paper, dark pine-black ink, restrained oxidised copper and deep teal spot inks. Distinct silhouettes: open and closed, inward and outward, dense and sparse, continuous and interrupted, centrally weighted and evenly distributed, rounded and sharply pointed. Every emblem should feel related through line quality and geometry. No lettering, no numbers, no shields, no eagles, no flags, no religious symbols, no official government seals, no gradient fills, no metallic holograms, no glass panels. Flat frontal view with generous space between emblems, suitable for studying vector construction.

Use this to refine the authored geometry, not as a sprite sheet of randomly assigned political categories. Translate chosen visual ideas into the shared vector grammar. Do not make the renderer dependent on generated pixels.

### B. Paper texture

Prompt:

> Uniform warm off-white cotton paper texture, extremely subtle fibre, evenly lit flat scan, no folds, stains, edges, vignette, shadows, text, stamps, illustrations, or visible repeated pattern. Low contrast, intended beneath dark typography at very low opacity.

Deliver a small optimized tile or full sheet. Test for visible seams and export taint. If it adds visual noise, omit it.

### C. Optional static hero still

After the procedural renderer exists, use an actual rendered example Sigil as the reference for an optional photographic still of the printed passport. It must be labelled as an example and secondary to the usable start button. Do not let an AI-rendered approximation replace the actual live sample card.

Question screens do not need generated illustrations. The short words and choices should carry the task. Any later image-based question needs a separate wording and bias review because imagery can change what is being measured.

## 15. Static implementation and state contract

Prefer a small TypeScript client application, such as Vite with React, compiled into static assets. Framework choice is secondary to keeping this a static browser application. There are no API routes, server functions, or hosted result records in v1.

### Data ownership

The answer ledger owns the user's assessment. The six distributions, displayed scores, archetype, tensions, heresy, sigil scene, foil, comparisons, and export content are derived from it. The visual seed is the only independent per-run visual state.

Persist the current run in `sessionStorage`, scoped to the tab. Copy updates after each committed answer. Do not use durable local storage by default. Shared incoming scores are held separately from the owner's run. The application must not overwrite a local run by opening a shared link.

Minimum records:

```ts
type Dimension = 'M' | 'A' | 'I' | 'G' | 'E' | 'T';
type Choice = 'A' | 'B' | 'skip';
type Scores = Record<Dimension, number | null>;
type Coverage = Record<Dimension, number>;

interface Question {
  id: string;
  dimension: Dimension;
  phase: 'core' | 'optional';
  context: string;
  prompt: string;
  choices: { A: string; B: string };
  positiveChoice: 'A' | 'B';
  discrimination: number; // v0.1: 1.2
  threshold: number; // v0.1: 0
}

interface Run {
  modelVersion: '0.1';
  renderVersion: '1';
  visualSeed: number;
  presented: Array<{
    questionId: string;
    choice: Choice | null;
    displayOrder: ['A', 'B'] | ['B', 'A'];
  }>;
}

interface SharedSigil {
  schema: 1;
  modelVersion: '0.1';
  renderVersion: '1';
  scores: Scores;
  coverage: Coverage;
  visualSeed: number;
}
```

Question content, archetype prototypes, tension predicates, central-glyph mappings, and share-copy clauses live in static, versioned data. The implementing agent should preserve the question text and stable IDs from this spec. Changes to question meaning or scoring require a new model version; visual grammar changes require a new render version.

### Shared links

Use `/#s={base64url-payload}`. Encode a compact UTF-8 JSON representation of `SharedSigil`. No raw answers, names, contacts, timestamps, heresy text, or detailed evidence belong in it.

The fragment is handled by the browser and is not part of the ordinary HTTP request sent to the host. It remains readable to the recipient, local page scripts, and applications receiving the full link. It is not encrypted or a secret. [MDN: URI fragments](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)

Validate payload size, field types, known versions, six exact dimension keys, score ranges and increments, counts, and seed range. Limit the encoded fragment to 2KB. Require `score=null` when count=0, and a score in 0–100 at five-point increments otherwise. Counts must be integers 0–5. Scores and coverage from shared URLs are self-reported data; a checksum does not authenticate them.

Shared rendering uses the payload's displayed scores, seed, coverage, and exact versions. Do not silently upgrade an older link. Archetype assignment and core artwork use only those shared fields, so the recipient sees the same title and Sigil as the owner. Owner-only tensions and optional heresy are additional layers on the owner's page or explicitly chosen image.

Use the actual current origin when constructing a link. Keep the inbound friend's payload in tab memory while the visitor takes the test; do not combine two people's data into the outgoing default link. Hash-route parsing and browser-history handling should cooperate so back navigation does not lose the friend context.

Static Open Graph metadata should show the branded sample passport. A platform crawler does not receive the fragment, so unique social link thumbnails are outside this static design. Personalized PNG export is the intended visual distribution path.

### Privacy and method copy

Privacy sheet title: `Your choices stay here.`

Body:

> TELL calculates your Sigil in your browser. We don't send your answers to a server. This tab can remember your progress while you use it.
>
> A shared link includes your six scores, how many choices informed them, and the information needed to draw your Sigil. Anyone with the link can read those scores. Your individual answers aren't included.
>
> A saved image contains the details you see in its preview. Turning on "Include my heresy" adds one of your choices to that image.
>
> "Start fresh" clears this tab's saved choices. It can't remove images or links you've already sent. Our hosting provider still handles ordinary website requests.

Method sheet title: `How your Sigil takes shape.`

Body:

> You make choices in everyday political conflicts. Each informs one of six dimensions. We turn those leanings into a Sigil and find the closest of our written archetypes.
>
> More choices can help us explore a mixed answer, but this first model hasn't been calibrated against a representative sample. The numbers describe our reading of these choices.
>
> The archetype is a shorthand. Your answers carry more detail. You can inspect them, change them, and see your Sigil change.

Include expandable `The six dimensions`, `How scoring works`, and `How the artwork works` sections with the definitions and formulas from this spec. Keep them readable in the single page; do not require a source-code repository to understand the result.

No analytics or session-replay scripts in v1. Pilot feedback can be gathered manually with consenting participants. If instrumentation is later authorized, measure basic flow events without raw answers, score fields, seeds, fragment URLs, or screenshots of people's choices.

## 16. Implementation sequence and acceptance

### Milestone 1: the artifact

Implement the canonical Sigil scene, central glyphs, four export compositions, 20-fixture studio, sensitivity studies, and comparison animations. Produce a contact sheet and representative exports for review. Record whether the visual acceptance checks in section 13 pass. Do not claim user enthusiasm from a rendering test.

### Milestone 2: the assessment engine

Implement the 30-item bank, six Bayesian grids, adaptive selection, coverage rules, archetype assignment, personal read, tension predicates, and heresy selection as pure functions. Keep content and scoring separate from the UI.

Protect the meaningful invariants:

- Every answer points in the authored direction; changing physical card order has no scoring effect.
- Skips do not update a dimension or count as evidence.
- Two positive, two negative, and split core pairs produce the documented fixture scores.
- An edited answer is counted once, and results recompute from the ledger.
- No question repeats; no run presents more than 18 items.
- A fully aligned core path can stop at 12; mixed paths request only eligible optional items within the cap.
- Missing dimensions do not acquire a neutral score or an asserted strong trait.
- Tensions and heresies are absent unless the recorded answers meet the exact rules.
- A seed change cannot change ideology, archetype, or alignment.
- Shared encoding round-trips to the same visible scores, title, and core geometry.
- Unsupported or malformed links cannot overwrite an existing run.

### Milestone 3: the one-page experience

Build the intro, 12-choice path, optional refinement, reveal, result inspection, answer editing, exports, incoming invitation, and pair view. Use the exact copy and state behavior in this document. Keyboard and mobile layouts are part of this milestone.

### Milestone 4: browser verification and pilot

Verify the full flow in mobile Safari, mobile Chrome, and a desktop browser, including at least one real native file share where available and the save/copy fallback where it is not. Verify the exported PNGs themselves at native size and as small social previews. Browser automation alone cannot prove that a receiving social app published the card correctly.

Run a small pilot with people holding varied political views. Observe comprehension, completion time, skipped questions, whether the personal read feels grounded, reaction to the heresy, and whether they voluntarily send the artifact. Ask them to explain a question back in their own words. That reveals ambiguity faster than a satisfaction score alone.

Record these questions for the next decision:

- Do people want their own Sigil after seeing the contact sheet?
- Can they make most choices without asking for an explanation?
- Do the six dimensions describe recognizable distinctions in their answers?
- Do tensions feel specific and fair, even when they are uncomfortable?
- Does the artifact survive an Instagram Story, X feed crop, and circular avatar crop?
- Does the pair interaction cause a recipient to take the test and start a conversation?

Success is an appealing artifact whose explanation survives inspection. A beautiful export with arbitrary claims fails. A clear model whose object nobody wants to send also needs another iteration.

## 17. Handoff summary

Build the Sigil studio first. Use the specified 30 original questions, six-dimensional provisional model, and 12-plus-optional flow. Keep the whole experience on one static page. Make the issued artifact and pair interaction feel distinctive at every size, while preserving a direct path back to the choices that produced them.

The important unresolved question is desirability, not an unspecified layout or missing scoring rule. This document supplies implementation defaults so the next agent can produce something concrete to judge.
