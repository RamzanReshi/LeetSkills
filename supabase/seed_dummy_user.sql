-- ============================================================
-- Dummy seed for user 98b76052-56ac-4a7b-8b02-ba20b0aedd97
-- Realistic shape: uneven distribution, one retry, one weak area.
--   SE-01 x2 (first weak 45, retry strong 85)
--   SE-02 x1 (mid 62)
--   DQ-01 x1 (strong 82)
--   PC-01 x1 (weak 38 — Communication gap)
--   AI-01 x1 (strong 90)
-- Idempotent: on conflict update so rerunning the seed repairs stale dummy rows.
-- ============================================================

do $$
declare
  uid uuid := '98b76052-56ac-4a7b-8b02-ba20b0aedd97';
begin

  ------------------------------------------------------------
  -- SE-01 attempt 1 — weak (45). Wrong pattern, brute force.
  ------------------------------------------------------------
  insert into leetskill.completed_attempts (
    id, user_id, scenario_id, path_id, difficulty,
    thinking_trace, final_response, score,
    skill_scores, ai_feedback,
    fingerprint_before, fingerprint_after,
    fallback_used, started_at, submitted_at, evaluated_at, completed_at
  ) values (
    'seed_attempt_SE-01_a', uid, 'SE-01', 'software-engineering-problem-solving', 'Easy',
    'Tried nested loop. Did not think about complexity.',
    'For each pair (i,j), check sum. O(n^2). Returns first pair.',
    45,
    '[
      {"skill":"Problem Understanding","rating_0_to_4":2,"weight":20,"weighted_score":10,"feedback":"Restated but missed edge cases."},
      {"skill":"Algorithmic Pattern Recognition","rating_0_to_4":1,"weight":30,"weighted_score":7.5,"feedback":"Did not consider hashing."},
      {"skill":"Complexity Awareness","rating_0_to_4":2,"weight":20,"weighted_score":10,"feedback":"States O(n^2) but does not push for better."},
      {"skill":"Implementation Accuracy","rating_0_to_4":2,"weight":30,"weighted_score":15,"feedback":"Works on happy path."}
    ]'::jsonb,
    '{"scenario_id":"SE-01","path_id":"software-engineering-problem-solving","difficulty":"Easy","overall_score":45,
      "skill_scores":[
        {"skill":"Problem Understanding","rating_0_to_4":2,"weight":20,"weighted_score":10,"feedback":"Surface restatement."},
        {"skill":"Algorithmic Pattern Recognition","rating_0_to_4":1,"weight":30,"weighted_score":7.5,"feedback":"Missed hashing."},
        {"skill":"Complexity Awareness","rating_0_to_4":2,"weight":20,"weighted_score":10,"feedback":"Settled for O(n^2)."},
        {"skill":"Implementation Accuracy","rating_0_to_4":2,"weight":30,"weighted_score":15,"feedback":"OK on happy path."}
      ],
      "strengths":["Code runs"],
      "improvements":["Look for hashing patterns","Consider duplicates","Push for better than O(n^2)"],
      "improved_example_response":"Use a hash map of value->index for O(n).",
      "timestamp":1747400000000}'::jsonb,
    '{"Decomposition":0,"Pattern Recognition":0,"Execution Quality":0,"Communication":0,"Judgment":0,"Adaptability":0}'::jsonb,
    '{"Decomposition":50,"Pattern Recognition":25,"Execution Quality":50,"Communication":0,"Judgment":50,"Adaptability":50}'::jsonb,
    false,
    to_timestamp(1747400000), to_timestamp(1747400300), to_timestamp(1747400310), to_timestamp(1747400320)
  ) on conflict (id) do update set
    user_id = excluded.user_id,
    scenario_id = excluded.scenario_id,
    path_id = excluded.path_id,
    difficulty = excluded.difficulty,
    thinking_trace = excluded.thinking_trace,
    final_response = excluded.final_response,
    score = excluded.score,
    skill_scores = excluded.skill_scores,
    ai_feedback = excluded.ai_feedback,
    fingerprint_before = excluded.fingerprint_before,
    fingerprint_after = excluded.fingerprint_after,
    fallback_used = excluded.fallback_used,
    started_at = excluded.started_at,
    submitted_at = excluded.submitted_at,
    evaluated_at = excluded.evaluated_at,
    completed_at = excluded.completed_at;

  ------------------------------------------------------------
  -- SE-01 attempt 2 — retry, strong (85). Found hashing.
  ------------------------------------------------------------
  insert into leetskill.completed_attempts (
    id, user_id, scenario_id, path_id, difficulty,
    thinking_trace, final_response, score,
    skill_scores, ai_feedback,
    fingerprint_before, fingerprint_after,
    fallback_used, started_at, submitted_at, evaluated_at, completed_at
  ) values (
    'seed_attempt_SE-01_b', uid, 'SE-01', 'software-engineering-problem-solving', 'Easy',
    'Recognized the hashing pattern this time. Walked through duplicates and empty input.',
    'Hash map of value -> index. Single pass. O(n) time, O(n) space. Handle empty array and duplicate values explicitly.',
    85,
    '[
      {"skill":"Problem Understanding","rating_0_to_4":4,"weight":20,"weighted_score":20,"feedback":"Clear restatement plus edge cases."},
      {"skill":"Algorithmic Pattern Recognition","rating_0_to_4":4,"weight":30,"weighted_score":30,"feedback":"Spotted hashing instantly."},
      {"skill":"Complexity Awareness","rating_0_to_4":3,"weight":20,"weighted_score":15,"feedback":"Correct O(n)/O(n)."},
      {"skill":"Implementation Accuracy","rating_0_to_4":3,"weight":30,"weighted_score":22.5,"feedback":"Clean, correct."}
    ]'::jsonb,
    '{"scenario_id":"SE-01","path_id":"software-engineering-problem-solving","difficulty":"Easy","overall_score":85,
      "skill_scores":[
        {"skill":"Problem Understanding","rating_0_to_4":4,"weight":20,"weighted_score":20,"feedback":"Strong."},
        {"skill":"Algorithmic Pattern Recognition","rating_0_to_4":4,"weight":30,"weighted_score":30,"feedback":"Pattern locked in."},
        {"skill":"Complexity Awareness","rating_0_to_4":3,"weight":20,"weighted_score":15,"feedback":"Solid."},
        {"skill":"Implementation Accuracy","rating_0_to_4":3,"weight":30,"weighted_score":22.5,"feedback":"Clean."}
      ],
      "strengths":["Clear growth from first attempt","Edge cases handled"],
      "improvements":["Discuss tradeoff if memory was constrained"],
      "improved_example_response":"Mention sorting + two-pointer as a memory-constrained alternative.",
      "timestamp":1747486400000}'::jsonb,
    '{"Decomposition":50,"Pattern Recognition":25,"Execution Quality":50,"Communication":0,"Judgment":50,"Adaptability":50}'::jsonb,
    '{"Decomposition":75,"Pattern Recognition":75,"Execution Quality":70,"Communication":0,"Judgment":75,"Adaptability":75}'::jsonb,
    false,
    to_timestamp(1747486400), to_timestamp(1747486700), to_timestamp(1747486710), to_timestamp(1747486720)
  ) on conflict (id) do update set
    user_id = excluded.user_id,
    scenario_id = excluded.scenario_id,
    path_id = excluded.path_id,
    difficulty = excluded.difficulty,
    thinking_trace = excluded.thinking_trace,
    final_response = excluded.final_response,
    score = excluded.score,
    skill_scores = excluded.skill_scores,
    ai_feedback = excluded.ai_feedback,
    fingerprint_before = excluded.fingerprint_before,
    fingerprint_after = excluded.fingerprint_after,
    fallback_used = excluded.fallback_used,
    started_at = excluded.started_at,
    submitted_at = excluded.submitted_at,
    evaluated_at = excluded.evaluated_at,
    completed_at = excluded.completed_at;

  ------------------------------------------------------------
  -- SE-02 — mid (62). Decomposition shaky.
  ------------------------------------------------------------
  insert into leetskill.completed_attempts (
    id, user_id, scenario_id, path_id, difficulty,
    thinking_trace, final_response, score,
    skill_scores, ai_feedback,
    fingerprint_before, fingerprint_after,
    fallback_used, started_at, submitted_at, evaluated_at, completed_at
  ) values (
    'seed_attempt_SE-02', uid, 'SE-02', 'software-engineering-problem-solving', 'Easy',
    'Jumped straight to code without breaking the problem down. Realized halfway I needed validation.',
    'Reversed the string with two-pointer swap. Forgot to handle null input on first pass — added a check after.',
    62,
    '[
      {"skill":"Decomposition","rating_0_to_4":2,"weight":30,"weighted_score":15,"feedback":"Skipped breaking problem into validation + algorithm."},
      {"skill":"Algorithmic Pattern Recognition","rating_0_to_4":3,"weight":20,"weighted_score":15,"feedback":"Two-pointer is right."},
      {"skill":"Edge Case Handling","rating_0_to_4":2,"weight":30,"weighted_score":15,"feedback":"Missed null until reread."},
      {"skill":"Implementation Accuracy","rating_0_to_4":3,"weight":20,"weighted_score":15,"feedback":"Works after fix."}
    ]'::jsonb,
    '{"scenario_id":"SE-02","path_id":"software-engineering-problem-solving","difficulty":"Easy","overall_score":62,
      "skill_scores":[
        {"skill":"Decomposition","rating_0_to_4":2,"weight":30,"weighted_score":15,"feedback":"Skipped breakdown."},
        {"skill":"Algorithmic Pattern Recognition","rating_0_to_4":3,"weight":20,"weighted_score":15,"feedback":"Right approach."},
        {"skill":"Edge Case Handling","rating_0_to_4":2,"weight":30,"weighted_score":15,"feedback":"Missed null."},
        {"skill":"Implementation Accuracy","rating_0_to_4":3,"weight":20,"weighted_score":15,"feedback":"Final code works."}
      ],
      "strengths":["Picked right algorithm"],
      "improvements":["List input constraints before coding"],
      "improved_example_response":"Step 1: validate input. Step 2: algorithm. Step 3: test cases.",
      "timestamp":1747572800000}'::jsonb,
    '{"Decomposition":75,"Pattern Recognition":75,"Execution Quality":70,"Communication":0,"Judgment":75,"Adaptability":75}'::jsonb,
    '{"Decomposition":63,"Pattern Recognition":75,"Execution Quality":67,"Communication":0,"Judgment":63,"Adaptability":63}'::jsonb,
    false,
    to_timestamp(1747572800), to_timestamp(1747573100), to_timestamp(1747573110), to_timestamp(1747573120)
  ) on conflict (id) do update set
    user_id = excluded.user_id,
    scenario_id = excluded.scenario_id,
    path_id = excluded.path_id,
    difficulty = excluded.difficulty,
    thinking_trace = excluded.thinking_trace,
    final_response = excluded.final_response,
    score = excluded.score,
    skill_scores = excluded.skill_scores,
    ai_feedback = excluded.ai_feedback,
    fingerprint_before = excluded.fingerprint_before,
    fingerprint_after = excluded.fingerprint_after,
    fallback_used = excluded.fallback_used,
    started_at = excluded.started_at,
    submitted_at = excluded.submitted_at,
    evaluated_at = excluded.evaluated_at,
    completed_at = excluded.completed_at;

  ------------------------------------------------------------
  -- DQ-01 — strong (82). Methodical bug repro.
  ------------------------------------------------------------
  insert into leetskill.completed_attempts (
    id, user_id, scenario_id, path_id, difficulty,
    thinking_trace, final_response, score,
    skill_scores, ai_feedback,
    fingerprint_before, fingerprint_after,
    fallback_used, started_at, submitted_at, evaluated_at, completed_at
  ) values (
    'seed_attempt_DQ-01', uid, 'DQ-01', 'debugging-testing-quality', 'Easy',
    'Started from the user report. Checked logs, narrowed to one endpoint, then to one branch.',
    'Repro: POST /api/checkout with cart_total=0. Root cause: division by quantity before guard. Fix: validate quantity > 0 at request boundary, add regression test.',
    82,
    '[
      {"skill":"Bug Reproduction","rating_0_to_4":4,"weight":30,"weighted_score":30,"feedback":"Crisp repro steps."},
      {"skill":"Root Cause Analysis","rating_0_to_4":3,"weight":40,"weighted_score":30,"feedback":"Followed symptom to cause."},
      {"skill":"Regression Prevention","rating_0_to_4":3,"weight":30,"weighted_score":22.5,"feedback":"Added test."}
    ]'::jsonb,
    '{"scenario_id":"DQ-01","path_id":"debugging-testing-quality","difficulty":"Easy","overall_score":82,
      "skill_scores":[
        {"skill":"Bug Reproduction","rating_0_to_4":4,"weight":30,"weighted_score":30,"feedback":"Clean."},
        {"skill":"Root Cause Analysis","rating_0_to_4":3,"weight":40,"weighted_score":30,"feedback":"Solid."},
        {"skill":"Regression Prevention","rating_0_to_4":3,"weight":30,"weighted_score":22.5,"feedback":"Test added."}
      ],
      "strengths":["Boundary validation","Regression test included"],
      "improvements":["Add monitoring alert for divide-by-zero"],
      "improved_example_response":"Plus: log + alert on guard rejections so we catch upstream callers.",
      "timestamp":1747659200000}'::jsonb,
    '{"Decomposition":63,"Pattern Recognition":75,"Execution Quality":67,"Communication":0,"Judgment":63,"Adaptability":63}'::jsonb,
    '{"Decomposition":70,"Pattern Recognition":75,"Execution Quality":75,"Communication":0,"Judgment":72,"Adaptability":68}'::jsonb,
    false,
    to_timestamp(1747659200), to_timestamp(1747659500), to_timestamp(1747659510), to_timestamp(1747659520)
  ) on conflict (id) do update set
    user_id = excluded.user_id,
    scenario_id = excluded.scenario_id,
    path_id = excluded.path_id,
    difficulty = excluded.difficulty,
    thinking_trace = excluded.thinking_trace,
    final_response = excluded.final_response,
    score = excluded.score,
    skill_scores = excluded.skill_scores,
    ai_feedback = excluded.ai_feedback,
    fingerprint_before = excluded.fingerprint_before,
    fingerprint_after = excluded.fingerprint_after,
    fallback_used = excluded.fallback_used,
    started_at = excluded.started_at,
    submitted_at = excluded.submitted_at,
    evaluated_at = excluded.evaluated_at,
    completed_at = excluded.completed_at;

  ------------------------------------------------------------
  -- PC-01 — weak (38). Clear Communication gap.
  ------------------------------------------------------------
  insert into leetskill.completed_attempts (
    id, user_id, scenario_id, path_id, difficulty,
    thinking_trace, final_response, score,
    skill_scores, ai_feedback,
    fingerprint_before, fingerprint_after,
    fallback_used, started_at, submitted_at, evaluated_at, completed_at
  ) values (
    'seed_attempt_PC-01', uid, 'PC-01', 'professional-communication', 'Easy',
    'Just want to send the update fast.',
    'hey so the thing is kinda broken right now idk we should maybe fix it whenever',
    38,
    '[
      {"skill":"Message Structure","rating_0_to_4":1,"weight":30,"weighted_score":7.5,"feedback":"No ask, no context, no next step."},
      {"skill":"Audience Awareness","rating_0_to_4":1,"weight":30,"weighted_score":7.5,"feedback":"Too casual for the audience."},
      {"skill":"Conciseness","rating_0_to_4":2,"weight":20,"weighted_score":10,"feedback":"Short but unclear."},
      {"skill":"Respectful Tone","rating_0_to_4":2,"weight":20,"weighted_score":10,"feedback":"Not rude but careless."}
    ]'::jsonb,
    '{"scenario_id":"PC-01","path_id":"professional-communication","difficulty":"Easy","overall_score":38,
      "skill_scores":[
        {"skill":"Message Structure","rating_0_to_4":1,"weight":30,"weighted_score":7.5,"feedback":"Missing structure."},
        {"skill":"Audience Awareness","rating_0_to_4":1,"weight":30,"weighted_score":7.5,"feedback":"Off-register."},
        {"skill":"Conciseness","rating_0_to_4":2,"weight":20,"weighted_score":10,"feedback":"Brief but vague."},
        {"skill":"Respectful Tone","rating_0_to_4":2,"weight":20,"weighted_score":10,"feedback":"Careless."}
      ],
      "strengths":["Short"],
      "improvements":["State what is broken","Propose a concrete next step","Match the receiver''s formality"],
      "improved_example_response":"Heads up — checkout is failing for users with empty carts (~12% of traffic). Patching today, will share root cause once confirmed.",
      "timestamp":1747745600000}'::jsonb,
    '{"Decomposition":70,"Pattern Recognition":75,"Execution Quality":75,"Communication":0,"Judgment":72,"Adaptability":68}'::jsonb,
    '{"Decomposition":70,"Pattern Recognition":75,"Execution Quality":75,"Communication":35,"Judgment":68,"Adaptability":65}'::jsonb,
    false,
    to_timestamp(1747745600), to_timestamp(1747745800), to_timestamp(1747745810), to_timestamp(1747745820)
  ) on conflict (id) do update set
    user_id = excluded.user_id,
    scenario_id = excluded.scenario_id,
    path_id = excluded.path_id,
    difficulty = excluded.difficulty,
    thinking_trace = excluded.thinking_trace,
    final_response = excluded.final_response,
    score = excluded.score,
    skill_scores = excluded.skill_scores,
    ai_feedback = excluded.ai_feedback,
    fingerprint_before = excluded.fingerprint_before,
    fingerprint_after = excluded.fingerprint_after,
    fallback_used = excluded.fallback_used,
    started_at = excluded.started_at,
    submitted_at = excluded.submitted_at,
    evaluated_at = excluded.evaluated_at,
    completed_at = excluded.completed_at;

  ------------------------------------------------------------
  -- AI-01 — strong (90). Mature AI use.
  ------------------------------------------------------------
  insert into leetskill.completed_attempts (
    id, user_id, scenario_id, path_id, difficulty,
    thinking_trace, final_response, score,
    skill_scores, ai_feedback,
    fingerprint_before, fingerprint_after,
    fallback_used, started_at, submitted_at, evaluated_at, completed_at
  ) values (
    'seed_attempt_AI-01', uid, 'AI-01', 'ai-literacy-responsible-use', 'Hard',
    'Need a tight prompt with explicit format and a verification step before I trust the output.',
    'Prompt: "Summarize this interview transcript in 5 bullets. Flag any claim that is not directly quoted. Do not invent details." Then I diff against the transcript before sharing.',
    90,
    '[
      {"skill":"Prompt Clarity","rating_0_to_4":4,"weight":30,"weighted_score":30,"feedback":"Goal, format, and constraint stated."},
      {"skill":"Output Evaluation","rating_0_to_4":4,"weight":30,"weighted_score":30,"feedback":"Plans a verification pass."},
      {"skill":"Human-in-the-Loop Judgment","rating_0_to_4":4,"weight":20,"weighted_score":20,"feedback":"Cross-check before share."},
      {"skill":"Privacy Awareness","rating_0_to_4":3,"weight":20,"weighted_score":15,"feedback":"Could call out PII redaction."}
    ]'::jsonb,
    '{"scenario_id":"AI-01","path_id":"ai-literacy-responsible-use","difficulty":"Hard","overall_score":90,
      "skill_scores":[
        {"skill":"Prompt Clarity","rating_0_to_4":4,"weight":30,"weighted_score":30,"feedback":"Excellent."},
        {"skill":"Output Evaluation","rating_0_to_4":4,"weight":30,"weighted_score":30,"feedback":"Strong."},
        {"skill":"Human-in-the-Loop Judgment","rating_0_to_4":4,"weight":20,"weighted_score":20,"feedback":"Mature."},
        {"skill":"Privacy Awareness","rating_0_to_4":3,"weight":20,"weighted_score":15,"feedback":"Add PII step."}
      ],
      "strengths":["Verification baked in","Explicit no-fabrication constraint"],
      "improvements":["Redact names/emails before sending"],
      "improved_example_response":"Add step 0: strip PII from transcript before prompt.",
      "timestamp":1747832000000}'::jsonb,
    '{"Decomposition":70,"Pattern Recognition":75,"Execution Quality":75,"Communication":35,"Judgment":68,"Adaptability":65}'::jsonb,
    '{"Decomposition":72,"Pattern Recognition":75,"Execution Quality":76,"Communication":35,"Judgment":80,"Adaptability":72}'::jsonb,
    false,
    to_timestamp(1747832000), to_timestamp(1747832400), to_timestamp(1747832410), to_timestamp(1747832420)
  ) on conflict (id) do update set
    user_id = excluded.user_id,
    scenario_id = excluded.scenario_id,
    path_id = excluded.path_id,
    difficulty = excluded.difficulty,
    thinking_trace = excluded.thinking_trace,
    final_response = excluded.final_response,
    score = excluded.score,
    skill_scores = excluded.skill_scores,
    ai_feedback = excluded.ai_feedback,
    fingerprint_before = excluded.fingerprint_before,
    fingerprint_after = excluded.fingerprint_after,
    fallback_used = excluded.fallback_used,
    started_at = excluded.started_at,
    submitted_at = excluded.submitted_at,
    evaluated_at = excluded.evaluated_at,
    completed_at = excluded.completed_at;

end;
$$;
