---
name: thai-ux-copy
description: Write and review Thai (and paired English) UI copy — buttons, headings, helper text, empty states, errors, status lines, share images. Use when writing or editing user-facing strings in a Thai-first product, translating UI strings between Thai and English, or when the user says the copy is unclear, stiff, or wrong. For paragraph-length Thai prose (landing sections, docs, announcements), use kien-thai instead and apply the voice rules here on top.
---

# Thai UX copy

Start by reading the project's `docs/copywriting.md`, which records its voice, glossary and register. Rules there override the ones below. Then read [examples.md](examples.md) to calibrate the voice.

## Voice

Write casual-polite Thai, like a friendly neighbour and not a government department. The product should be trusted, but it shouldn't sound stiff. Thai is written first and never translated from English. Write each language natively, and don't copy English sentence structure into Thai.

## Rules

1. **Put the action in the CTA.** Write a verb plus its object for exactly what the button does: `เลือกคนที่จะสมัคร`, `ส่งกิจกรรมวันนี้`, `ลงทะเบียนอีเวนต์นี้!`. A CTA can end in `เลย` (`ตอบเลย`), and an exclamation mark is fine on a share image or celebration.
2. **Key info has to be clear at a glance.** If a label doesn't name the real distinction, rename it (for example `Dog Tickets` vs `People Tickets`, not a vague category). Put numbers inside the sentence: `ไม่ใช้รถมาแล้ว 3 วัน`.
3. **Frame status by what the user can do.** Write `ส่งได้แล้ววันนี้`, not `ส่งได้ถึงวันนี้`. Say what's possible now before any deadline.
4. **Cut filler.** Don't tell users what they don't need to do (`ยังไม่ต้องกรอกข้อมูล`), don't label something twice, and remove copy that doesn't apply to this case. If extra context is needed, say what they *can* do: `หากต้องการสมัครเพิ่มสำหรับผู้อื่น สามารถลงทะเบียนได้อีกครั้งหลังซื้อบัตรของท่านแล้ว`.
5. **Every disabled state and error says why, and what to do next.** Errors follow the pattern `X ไม่สำเร็จ` + the fix: `บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง`. When the user's input survived, tell them so: `ข้อมูลและภาพยังอยู่`.
6. **Frame rejection as a nudge, not a failure.** Give each reason its own sentence, so that "the challenge ended" never reads as "you were too slow". Don't use guilt, lecturing or shaming.
7. **Real numbers or none.** Put ≈ or `ประมาณ` in front of any estimate. Don't overclaim or make health claims, and every number in the copy must match the real rules.

## Mechanics

- **Particles:** never use ครับ or ค่ะ in UI. Use `นะ` sparingly for warmth, and `เลย` in CTAs.
- **Pronouns:** use `คุณ` in UI. `ท่าน` is only for formal or official rule text. The team calls itself `ทีมงาน` or `เรา`.
- **Softeners:** prefer `โปรด` to `กรุณา`. Never use `ล้มเหลว`, and avoid `ขออภัย`.
- **Spacing:** leave a space between Thai and Latin text or numbers (`ชาเลนจ์ 21 วัน`), and a space before and after `ๆ` (`ค่อย ๆ`). Separate clauses with a space, not a comma.
- **Loanwords:** product and campaign terms can stay in Latin script (`Leaderboard`, `Challenge`). Common loanwords are transliterated (`อีเวนต์`, `คอนเทนต์`). Keep each term consistent with the glossary in `docs/copywriting.md`.
- **English inside Thai:** credits and proper labels stay in English (`Special Thanks`). Label the language toggle in each language's own script: `ไทย / English`.
- **Dates:** in prose, write the Buddhist-era year in full (`20 กันยายน 2569 เวลา 00.00 น.`). In compact columns, write the year as digits only, without `พ.ศ.`.
- **Line breaks:** a Thai word must never split across lines (`หลักฐาน` stays on one line). Use `<wbr>` or zero-width-space break points, or `word-break: keep-all` with explicit breaks, and check headings at phone width.
- **English copy:** use Title Case for headings and CTAs, and keep it as short as the Thai.

## Review pass

When reviewing strings, check each one against the rules above, and report each finding as the current string → your replacement → which rule it breaks. Then look across the whole screen: a CTA should use the same verb as the heading it answers, the same term shouldn't appear in two spellings, and helper text shouldn't just repeat the label.
