---
name: sunnydata-pain-thinking
description: Use when exploring or validating whether a pain point is real (not whether it can make money). Stage 1 only — runs the 9-step pain discovery flow with SECI lenses and first-principles/Socratic engines. Output is a user-authored written verdict (true/fake/pending-interview) with a 100-word reason and a next action — no numeric scoring, no mode toggle. Money, payment, manual delivery, and BCG DRI belong to Stage 2 (sprint manual) and are NOT triggered by this skill.
---

# Pain Thinking — 階段一痛點發想

> **Authoritative source:** `docs/design/painmap_pain_thinking_system.md`
> **Companion lecture:** `docs/workshop/painpoint_systematic_thinking_lecture.md`
> **Beginner worksheet:** `docs/workshop/painpoint_beginner_worksheet.md`
> **Engine docs:** `docs/product/first_principles_playbook.md`, `docs/product/socratic_first_principles_rnd_workflow.md`
> **Stage 2 hand-off:** `docs/product/first_principles_sprint_manual.md` (commercial validation, NOT loaded by this skill)

## When to use

Load this skill whenever:
- A user describes a complaint, gripe, or "wouldn't it be cool if…" idea
- A PM/founder asks whether a pain point is **real**, not whether it's **profitable**
- You're about to brainstorm features before validating the underlying pain
- You hear claims like "the market needs X" without named people behind it

**Do NOT skip when:**
- The complaint sounds obviously true (obvious complaints have hidden assumptions)
- The user already has a "score" from another tool (scores are anxiety products, not decision inputs — see `first_principles_playbook.md §7 反模式 A`)

**This skill does NOT cover:**
- Manual delivery design (Stage 2 — see sprint manual)
- Payment rail setup (Stage 2)
- Pre-sales / first-dollar capture (Stage 2)
- BCG DRI attack-layer decision (Stage 2 — applies AFTER pain is validated)

## The Iron Laws

```
1. Pain validation is INDEPENDENT from commercial validation.
2. Stage 1 outputs a WRITTEN TRUE/FAKE/PENDING verdict — NOT a payment, NOT a score.
3. NO step skipping. A step's exit reflection unanswered → cannot advance.
4. NO money talk in Stage 1. If money comes up, it belongs in Stage 2.
5. NO numeric scoring at any point. Judgment is trained by writing, not by grading.
```

## Architecture: Two Stages × Lenses × Engines

```
Stage 1 (this skill): PAIN DISCOVERY — no money, no score
  ▸ 9 steps aligned with Sunny's workshop structure
  ▸ Lenses: SECI Externalize → trade-off articulation → SECI Combination → SECI Socialization
  ▸ Engines: First Principles (#1, #2 only) + Socratic (S1/S2)
  ▸ Endpoint: written true/fake/pending verdict + 100-word reason + named next action

Stage 2 (NOT in this skill): COMMERCIAL VALIDATION — money
  ▸ Physical quantities #3 (manual deliverable) + #4 (payment rail)
  ▸ BCG DRI attack layer
  ▸ 72-hour sprint → first real payment
  ▸ See: docs/product/first_principles_sprint_manual.md
```

## Physical Quantities (this skill uses #1, #2 only)

| # | Quantity | Check | Step | Stage |
| :-- | :--- | :--- | :--- | :--- |
| 1 | Specific people | Can you call 3 named individuals right now? | Step 2 | 1 |
| 2 | Pain w/ time/cost investment | Does the workaround have a name? | Step 2 | 1 |
| 3 | Manual deliverable | Can you do it tonight without code? | — | 2 (NOT here) |
| 4 | Payment rail | Do you have a shareable payment link now? | — | 2 (NOT here) |

#2 is "pain w/ time/cost investment" — workaround has a name, time/emotion/money cost is being spent. Avoids implying you need a paying customer at the discovery stage.

## Socratic Templates

**S1 (Step 2):** Three elements required — Who / When / How observed.

**S2 (Step 9):** Three locked questions:
1. **Falsifiability:** What evidence would make me drop this pain?
2. **Alternative cause:** Is this actually a different pain in disguise?
3. **Definition drift:** Is the Step 1 pain owner still the Step 8 interview target?

## The Nine Steps — Run This as TodoWrite

When you load this skill, immediately create these 9 todos:

```
[ ] Step 1. 聆聽            — verbatim complaint + 1 specific scene
[ ] Step 2. 5 要素 + S1     — pain sentence + 5 elements + 3-person list + workaround name (#1, #2)
[ ] Step 3. 寫卡關公式       — articulate the stuck-formula sentence in user's own words
[ ] Step 4. 找 trade-off     — surface the user's irreducible trade-off + which side gets sacrificed and why
[ ] Step 5. 選 AI 工具       — choose ChatGPT DR / Claude / Perplexity / Gemini
[ ] Step 6. AI 找證據        — run the 8-question evidence prompt (NO product/biz model)
[ ] Step 7. 自己先猜+讀 AI  — write 3 guesses BEFORE reading AI; then compare deltas
[ ] Step 8. 規劃真人訪談     — pick 2 interview targets + 3 questions + interview taboos
[ ] Step 9. 真/假判斷 + S2  — written verdict + 3 S2 answers + 100-word reason + next action
```

Mark each todo `in_progress` on entry, `completed` only when the user has produced the written reflection for that step.

> **Card 5 surfaces the user's irreducible trade-off in their own words; no taxonomic labels.** If the user reaches for a framework label like "TRIZ contradiction #2", redirect them to write what each side wants and which side is being given up — in their own sentences.

### Step reflection gates (the prompts, not pass/fail)

| Step | Reflection that must be written before advancing |
| :--- | :--- |
| 1 | Verbatim transcript with at least one specific named person + one concrete scene |
| 2 | All 5 elements concrete (no "should" / "probably") + 3-person list + workaround has a name |
| 3 | Stuck-formula sentence a stranger could repeat to a third person |
| 4 | Side A wants ___, side B wants ___, sacrificed side + one-sentence reason why that side gets dropped |
| 5 | AI tool chosen with 1-sentence reason |
| 6 | AI returned 8 answers + did NOT enter solution mode |
| 7 | 3 written guesses + 4 readability checkpoints reviewed + 3 deltas identified |
| 8 | At least 1 interview target with concrete contact + 3 non-pitch questions |
| 9 | Written verdict (true/fake/pending-interview) + 3 S2 answers + 100-word reason + named next action |

**When a reflection is missing or shallow, do NOT mark "fail" — instead surface the unanswered question and invite the user to think again.** No red, no checkmark grid, no "exit gate" framing.

**Failure routing (as suggestions, never blocks):**
- Step 2 thin → suggest returning to Step 1 (the user has not actually met real people yet)
- Step 4 thin → suggest revisiting Step 2 (5 elements are still too abstract to surface a real trade-off)
- Step 6 returns solutions → suggest re-prompting AI with stronger "no solutions" rule
- Step 7 deltas missing → suggest giving the AI more context from steps 1–4
- Step 8 has no contact → suggest returning to Step 2 (the community is not within reach yet)
- Step 9 S2 reveals definition drift → suggest going back to the drift point and rebuilding

## Step 6 Standard Prompt (copy-paste)

```
我想研究一個可能的痛點：
[Step 2 痛點句]

痛點主人翁特徵：[Step 2 具體人群]
他現在用：[Step 2 workaround]
不滿之處：[Step 2 現有解法不滿]
卡關公式：[Step 3 stuck-formula 句]
他的 trade-off：[Step 4 side_a / side_b / 被犧牲的那邊 + 為什麼]

⚠️ 重要規則：
- 請不要幫我設計產品，也不要提出商業模式
- 請不要建議 App、SaaS、解決方案
- 請只做痛點探索與證據蒐集

請回答 8 題：
1. 哪些具體人群最常遇到？請列 3–5 群
2. 通常在什麼場景發生？頻率多高？
3. 他們現在怎麼解決？請列 5 個 workaround
4. 現有解法有哪些不滿？分成時間/品質/情緒/資料整理
5. 公開證據？論壇/社群/產業文章/工具評論/搜尋趨勢
6. 背後 JTBD 是什麼？
7. 哪些可能是假痛點？
8. 應該訪談哪 5 種人？每種人 3 題訪談問題

不確定的標 [推測]。不要對任何結論加裝飾性評論。不要打分數。
```

The AI is here to surface evidence, not to grade you.

## Step 7 Self-Guess Discipline

**BEFORE** reading the AI response, write down:
- Who do you guess is most pained?
- Which scenario do you guess is most painful?
- One possible fake pain you guess might exist?

**THEN** read the AI response with these 4 checkpoints (these are reflection prompts, not a rubric):
1. Did it segment people specifically? (no "office workers")
2. Did it find observable scenarios? (time + place + action)
3. Did it list workaround dissatisfactions? (≥3 with reasons)
4. Did it flag possible fake pains? (≥1)

**THEN** identify 3 deltas: AI added what / AI missed what / your guess wrong where.

**Why guess first:** Reading AI directly creates "yes it's right!" illusion (AI just paraphrases your question). Pre-guess is the only way to train judgment.

## Output: Written Verdict (single format)

Stage 1 ends with one artifact — a user-authored verdict card:

```
痛點：[Step 2 句子]
判斷：[真痛點 | 假痛點 | 待訪談]
書面理由（≥ 100 字，使用者親筆，不可由 AI 生成）：
[100-word reason connecting Steps 1–8 evidence to the verdict]

最有把握的證據：[使用者親筆]
最沒把握的地方：[使用者親筆]

S2 壓力測試：
1. 可證偽性：什麼證據會讓我放棄？
2. 假因排除：是不是其實是另一個痛點？
3. 定義漂移：Step 1 主人翁 vs Step 8 訪談對象同一人/情境嗎？

下一步：[排訪談 / 補證據 / 換題目 / 進階段二 sprint]
完成日期：[YYYY-MM-DD]
```

**No numeric scoring at any layer.** The verdict's authority comes from the user's own writing connecting evidence to judgment, not from a number. If a downstream system needs a status string, use the lifecycle label (`draft` after Step 1, `structured` after Step 9 with a true verdict) — but never produce a 0–25 score.

## Anti-patterns (Red flags — STOP if you see these)

| Pattern | Symptom | Fix |
| :--- | :--- | :--- |
| **Stage-skip** | "Let me design the manual delivery now" before Step 9 verdict | Stage 1 must complete with written verdict before Stage 2 begins |
| **Money in Stage 1** | "What's my pricing?" / "Where do I put the payment link?" | Block — that's Stage 2. Continue with current step. |
| **Step-skip** | "This needs Reshape" before Step 6/7 evidence | DRI is Stage 2. Force written reflection at every Stage 1 step |
| **Score creep** | Anyone produces a numeric grade or "pain quality score" | Stop. Delete the number. Replace with the Socratic question that exposed the gap. |
| **Taxonomy fixation** | Forcing the trade-off into a TRIZ contradiction or any other label | Step 4 is user-authored prose only. If a label appears, ask the user to write what each side wants instead. |
| **AI-flattery** | Asking AI "is this a real pain?" | Step 9 verdict must be human-written; AI may red-team but not generate the verdict |
| **Synthetic persona** | Skipping real interviews via AI personas | Step 1 hard reflection: real named person; Step 8 must come from Step 2 list |
| **Solution-jump in Step 6** | AI prompt response includes "you should build…" | Re-prompt with stronger "no solutions" rule |
| **Pass/fail framing** | UI says "exit gate failed" / "你沒過關" | Replace with "still worth thinking about ___ before moving on" — neutral reflection prompt |

## Quick reference card (paste at top of session)

```
ENGINES (every step):
  S1: who/when/how-observed
  S2: falsifiability / alt-cause / drift
  PQ: #1 specific people / #2 time-or-cost-invested pain (Stage 1 only — #3, #4 in Stage 2)

LENSES (in order):
  Step 1+2 SECI Socialization+Externalization (verbatim → 5 elements)
  Step 3 stuck-formula sentence in user's own words
  Step 4 trade-off articulation in user's own words (NO taxonomy labels)
  Step 6 SECI Combination (AI evidence)
  Step 7 Socratic self-articulation BEFORE reading AI
  Step 8 SECI Socialization confirmation (real interviews)

EXIT: Stage 1 ends with WRITTEN VERDICT (real/fake/pending), 100-word reason, named next action.
NEVER: numeric score, mode toggle, taxonomy label, pass/fail UI.
NEXT: True verdict → Stage 2 sprint manual (NOT this skill).
```

## When to defer to other skills

- **Pain confirmed true, ready for commercial validation** → load `first_principles_sprint_manual.md` (Stage 2)
- **Need to design disruptive GTM** → see `painmap_disruption_framework.md` (post-Stage 2)
- **Need to design moat strategy** → see `painmap_moat_design.md`
- **Pain confirmed, ready to code product** → only after Stage 2 verifies payment; load `superpowers:test-driven-development`

## Verification

After running this skill end-to-end on a pain, verify:
- [ ] All 9 todos completed in order (no jumps)
- [ ] Each step has written user output
- [ ] Physical quantities #1, #2 each checked (NOT #3, #4 — those are Stage 2)
- [ ] Step 4 trade-off is in the user's own prose (no TRIZ labels, no "contradiction type")
- [ ] Step 9 has written true/fake/pending verdict + 100-word reason + named next action
- [ ] No numeric score appears anywhere
- [ ] No "let's build it" / "set up payment" suggested in Stage 1
- [ ] No pass/fail / exit-gate framing in any UI or prompt copy

If any item fails, the diagnosis is incomplete — do not claim the pain is validated.

## Why writing replaces grading (design principle)

Stage 1 trains judgment by making the user write — observation → decomposition → evidence → judgment — with Socratic questions, not graded outputs. A 100-word written reason forces every dimension a numeric grid would only approximate, and it can't be misread as a green light. Card 5 asks the user "what does each side want, and which side gets dropped" in their own words, surfacing the trade-off in language the interview target can recognize. That is the entire point of Stage 1.
