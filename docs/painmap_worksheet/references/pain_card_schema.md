# Pain Card Schema 詳細參考 (Reference)

> **本檔為 `product/data_model.md` 的補充參考**，提供：
> - JSON Schema (Draft 2020-12) 格式
> - Validation Rules
> - 範例資料
>
> 真相源：`product/data_model.md`

---

## JSON Schema (摘要)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://painmap.com/schemas/paincard.json",
  "title": "PainCard",
  "type": "object",
  "required": [
    "id", "schema_version", "status", "created_at", "updated_at",
    "current_step", "complaint", "people", "stuck_formula",
    "workaround", "contradiction", "ai_evidence", "self_guess",
    "interview_plan", "verdict", "exported"
  ],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "schema_version": { "const": "1.0" },
    "status": {
      "enum": ["draft", "in_progress", "structured", "pending_interview", "archived_fake"]
    },
    "complaint": {
      "type": "object",
      "required": ["verbatim", "source_name", "source_relation", "datetime", "scene"],
      "properties": {
        "verbatim": { "type": "string", "minLength": 10 },
        "source_name": { "type": "string", "minLength": 1 },
        "source_relation": { "type": "string", "minLength": 1 },
        "datetime": { "type": "string", "minLength": 1 },
        "scene": { "type": "string", "minLength": 1 }
      }
    },
    "people": {
      "type": "object",
      "required": ["background", "list"],
      "properties": {
        "background": { "type": "string", "minLength": 1 },
        "list": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "items": {
            "type": "object",
            "required": ["name", "contact", "relation"],
            "properties": {
              "name": { "type": "string", "minLength": 1 },
              "contact": { "type": "string", "minLength": 1 },
              "relation": { "type": "string", "minLength": 1 }
            }
          }
        }
      }
    },
    "workaround": {
      "type": "object",
      "required": ["tool_name", "why_still_stuck", "user_dissatisfactions"],
      "properties": {
        "tool_name": { "type": "string", "minLength": 1 },
        "why_still_stuck": { "type": "string", "minLength": 1 },
        "user_dissatisfactions": {
          "type": "array",
          "minItems": 3,
          "items": { "type": "string", "minLength": 1 }
        }
      }
    },
    "contradiction": {
      "type": "object",
      "required": ["side_a", "side_b", "sacrificed", "sacrificed_reason"],
      "properties": {
        "side_a": { "type": "string", "minLength": 10 },
        "side_b": { "type": "string", "minLength": 10 },
        "sacrificed": { "enum": ["a", "b"] },
        "sacrificed_reason": { "type": "string", "minLength": 1 }
      }
    },
    "verdict": {
      "type": "object",
      "required": ["judgment", "reason_100w", "most_confident_evidence", "least_confident", "next_action"],
      "properties": {
        "judgment": { "enum": ["true_pain", "fake_pain", "pending_interview"] },
        "reason_100w": { "type": "string", "minLength": 100 },
        "most_confident_evidence": { "type": "string", "minLength": 15 },
        "least_confident": { "type": "string", "minLength": 15 },
        "next_action": { "enum": ["interview", "more_evidence", "change_topic"] }
      }
    }
  }
}
```

---

## Validation Rules（補充 JSON Schema 無法表達的規則）

### Rule 1: 連續性 (Sequential Reflection)

| Rule | 說明 |
| :--- | :--- |
| R1.1 | `current_step` 不可跳號 — 必須按 1 → 2 → ... → 9 → 10 順序 |
| R1.2 | 進入 step N 時，step 1..N-1 反思條件**建議**達成（但不強制擋住）|
| R1.3 | 例外：使用者可「回退」到先前 step 修改，但 step N+1 起的資料須清空（或標記為 stale） |

### Rule 2: 內容反偵測 (Anti-fake Validators)

> 真實性護欄回傳 `{ kind: "ok" | "hint", message?: string }`，**從不說 "fail"**。

| Rule | 說明 | 觸發行為 |
| :--- | :--- | :--- |
| R2.1 | `complaint.verbatim` 不可包含「我覺得」「應該需要」等分析性詞 | hint：「這是你的解釋，不是原句」 |
| R2.2 | `people.list[*].name` 不可為「老師 A / 同學 B」等代稱 | hint：「請填真名」 |
| R2.3 | `stuck_formula` 須具體（不可為「卡在效率不好」這類空話） | hint（不擋）|
| R2.4 | `workaround.tool_name` 不可為「沒人解過」「會自己想辦法」 | hint |
| R2.5 | `contradiction.side_a` / `side_b` 須 ≥10 字且具體 | hint |
| R2.6 | `contradiction.sacrificed_reason` 須至少 1 句完整話 | hint |
| R2.7 | `ai_evidence.raw_response` 若包含「建議製作 App / 你應該開發」等字串 → `no_solution_check_passed = false` | 提示重新跑 prompt |

### Rule 3: 跨欄位一致性

| Rule | 說明 |
| :--- | :--- |
| R3.1 | `interview_plan.targets[].persona` 應與 `ai_evidence.eight_answers.q8_interview_targets` 列出的 5 種人有交集 |
| R3.2 | `verdict.judgment === 'true_pain'` 時，`interview_plan.targets.length >= 1` 且 `most_confident_evidence` 應引用具體卡片觀察 |

---

## 範例資料

### 範例 1：林老師（補習班家長 LINE 案例）

對應 worksheet 範例。完整 PainCard：

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "schema_version": "1.0",
  "status": "structured",
  "created_at": "2026-04-15T21:00:00+08:00",
  "updated_at": "2026-04-15T23:30:00+08:00",
  "current_step": 10,

  "complaint": {
    "verbatim": "我每週六晚上要寫 30 個學生的家長 LINE，平常週間都要記筆記但常漏，到週末翻 7 次小考成績單、翻群組對話、翻學生作業，常寫到半夜兩點。",
    "source_name": "林老師",
    "source_relation": "我表妹的數學老師",
    "datetime": "2026-04-15",
    "scene": "我陪他從 21:00 跟到 02:30 親眼看他寫"
  },

  "people": {
    "background": "30–50 歲、台灣中小型補習班老師、每週要做家長溝通",
    "list": [
      { "name": "林老師", "contact": "LINE", "relation": "我表妹的數學老師" },
      { "name": "王老師", "contact": "FB Messenger", "relation": "林老師介紹的同業" },
      { "name": "陳老師", "contact": "電話", "relation": "我國中同學的爸爸" }
    ]
  },

  "stuck_formula": {
    "ai_polished": "我每次要在週末寫 30 則家長回報訊息，都會卡在『資料散在週間 7 次小考、要寫得具體、不能傷家長感情』這 3 件事同時要顧。",
    "ai_clarifying_questions": [
      "「具體」跟「不傷感情」哪個現在最頭痛？",
      "一週實際只有週六寫嗎？平日有沒有零碎寫過？",
      "30 個學生裡有沒有特別難寫的個案？"
    ],
    "confirmed": true
  },

  "workaround": {
    "tool_name": "LINE + Excel 成績表 + 翻群組對話（手動拼湊）",
    "why_still_stuck": "每個資料源都要重新翻找，沒辦法一次看完",
    "ai_alternatives": [
      "Notion 模板",
      "Google Sheets + 公式",
      "班級管理 App",
      "助教代寫",
      "ChatGPT 寫稿機"
    ],
    "user_dissatisfactions": [
      "Notion 試過 1 個月放棄，太花時間貼來貼去",
      "ChatGPT 寫得太罐頭，家長一看就知道",
      "助教請不起"
    ]
  },

  "contradiction": {
    "side_a": "家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）",
    "side_b": "老師一週只有 2–3 小時可寫 30 則（每則 < 6 分鐘）",
    "sacrificed": "a",
    "sacrificed_reason": "因為時間是硬限制，個人化只能讓步——他週六晚上沒辦法多生出 3 小時，於是家長收到的是罐頭訊息，一看就知道沒在用心。"
  },

  "ai_evidence": {
    "ai_tool": "chatgpt_dr",
    "ai_tool_reason": "第一次跑研究，從模糊問題開始整理證據",
    "raw_response": "...（完整 AI 回覆原文）...",
    "eight_answers": {
      "q1_specific_groups": "1. 中小型補習班數學/英文老師 2. 才藝班輔導老師 3. 安親班帶班老師 4. 私立國中導師 5. 小型音樂教室老師",
      "q2_scenes_frequency": "每週 1 次（週末），每次 4-6 小時。學期中固定發生。",
      "q3_workarounds": "Notion / Google Sheets / 班級管理 App（如 Aimer、補教雲）/ 助教代寫 / ChatGPT 罐頭模板",
      "q4_dissatisfactions_categorized": "時間：4-6 小時；品質：罐頭文字被家長識破；情緒：寫到深夜；資料整理：成績表 + 群組 + 作業散在 3 處；其他：擔心家長關係",
      "q5_public_evidence": "Dcard 補教版、Mobile01 親子討論、PTT TeachersClub、補教協會問卷",
      "q6_jtbd": "週末把整週的學生狀況打包成 30 個有溫度的個別回報，讓家長覺得被認真對待",
      "q7_possible_fake_pains": "可能不是『寫信很痛』而是『不想做家長溝通本身』；可能補習班規模太小才有這問題（≤30 人才相對痛）",
      "q8_interview_targets": "1. 中小型補習班數學老師 2. 安親班輔導老師 3. 私立國中導師 4. 才藝班老師 5. 小型音樂教室老師"
    },
    "no_solution_check_passed": true
  },

  "self_guess": {
    "guesses": {
      "most_painful_person": "中小型補習班 30-50 歲老師",
      "most_common_scene": "週六晚上寫 LINE",
      "biggest_dissatisfaction": "資料散在 3 處",
      "possible_fake_pain": "可能只是不喜歡跟家長溝通，不是流程問題"
    },
    "ai_checkpoints_passed": {
      "people_segmented": true,
      "scenes_observable": true,
      "workaround_dissatisfactions_listed": true,
      "fake_pains_flagged": true
    },
    "pain_judgment_table": "...（AI 第二輪整理的判斷表）...",
    "deltas": {
      "biggest_diff": "AI 提到「補習班規模 ≤30 人」這個切點，我沒想到",
      "ai_added": "Dcard 補教版證據連結 + JTBD 描述",
      "guess_unsupported": "我以為「不喜歡跟家長溝通」是主因，但 AI 證據顯示老師其實在意，只是工具不對"
    },
    "phase_a_completed_at": "2026-04-15T22:30:00+08:00"
  },

  "interview_plan": {
    "targets": [
      {
        "persona": "中小型補習班數學/英文老師",
        "contact_known": true,
        "contact_info": "林老師（已聯絡）",
        "planned_time": "2026-04-22 21:00"
      },
      {
        "persona": "安親班輔導老師",
        "contact_known": false,
        "contact_info": "去家附近安親班直接拜訪",
        "planned_time": "2026-04-25 下午"
      }
    ],
    "questions": [
      "你最近一次寫家長回報是什麼時候？花了多久？發生了什麼？",
      "你現在用什麼方法在解這個問題？試過什麼放棄了？",
      "你現在花多少時間在做這件事？最不滿意哪一段？"
    ],
    "interview_taboos_understood": true,
    "ai_simulated_response": null
  },

  "verdict": {
    "judgment": "true_pain",
    "reason_100w": "親眼觀察 5.5 小時、有 3 個有名字的真人、現有 workaround（Notion/ChatGPT/助教）都被嘗試後放棄，且不滿理由具體可查證。AI 證據在 Dcard 補教版找到至少 8 篇相關討論，JTBD 清晰（週末打包整週溝通），取捨本質是『個人化 vs 規模化』經典命題。最有把握的證據是真人從 21:00 寫到 02:30 的具體行為觀察。最沒把握的是樣本是否偏中小型補習班、≥50 人補習班是否同樣痛。下一步排訪談 2 位確認是否同類型痛點。",
    "most_confident_evidence": "親眼觀察林老師從 21:00 寫到 02:30 的具體行為",
    "least_confident": "≥50 人規模補習班是否同樣痛（樣本偏中小型）",
    "next_action": "interview"
  },

  "exported": {
    "exported_at": "2026-04-15T23:30:00+08:00",
    "formats": ["markdown", "pdf"],
    "last_review_at": "2026-04-15T23:30:00+08:00"
  }
}
```
