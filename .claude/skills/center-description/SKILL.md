---
name: center-description
description: Generate a bilingual (English + Spanish) Markdown description for a PrintForHelp collection center. Use when the user provides a center description (in Spanish, English, or as a rough list of what can be donated / what the center does) and wants a clean .md file with both an English and a Spanish version ready to copy-paste into the center page.
---

# Center Description Generator

Turn a raw collection-center description into a polished, bilingual
Markdown file the user can paste directly into a PrintForHelp center page.

## When to use

The user gives you a center description, donation list, or details about a
collection center and asks for a `.md` file with English and Spanish
versions. The input may arrive in Spanish only, English only, or as a
bulleted list with emojis.

## Output format

Write a single `.md` file with **English first, Spanish second**, separated
by a `---` horizontal rule. Each language block uses the same structure so
the two are mirror translations of each other.

Template:

```markdown
## 🌎 English

<English version of the content here>

---

## 🌎 Español

<Spanish version of the content here>
```

## Rules

- **Bilingual, English on top, Spanish on the bottom.** Both versions must
  carry the same information and structure.
- **Preserve the user's emojis** and place them consistently in both
  languages. If the input has no emojis, add a few tasteful ones (not on
  every line) in a warm, social-media-friendly tone.
- **Preserve lists as Markdown lists** (`- item`). Convert any inline
  bullets (•, ​, etc.) into proper `-` list items.
- **Bold the closing call-to-action** (e.g. "We are counting on your
  solidarity!" / "¡Contamos con tu solidaridad!") in both languages.
- **No em dashes (—)** anywhere in the copy. Reword with commas or colons.
  This is a standing user preference.
- Keep section headings short. Reuse the user's heading if they gave one
  (translate it for the English block).
- If the input is Spanish-only, translate naturally into English (not
  word-for-word). If English-only, translate naturally into Spanish.

## Where to save

**Always save to `center-description.md` at the repo root**, overwriting
the existing file every time. Do not create numbered, suffixed, or
center-named variants, and do not ask before overwriting. If the user
explicitly specifies a different path, use that instead.

## After writing

Tell the user the filename and give a one-line summary of what you
produced. Flag any names, spellings, or ambiguous terms you had to infer so
they can correct them.

## Reference example

Input (Spanish only):

```
📦 ¿Qué puedes donar?
💧 Agua potable
🥫 Alimentos no perecederos
¡Contamos con tu solidaridad!
```

Output file:

```markdown
## 🌎 English

### 📦 What can you donate?

- 💧 Drinking water
- 🥫 Non-perishable food

**We are counting on your solidarity!** 💚

---

## 🌎 Español

### 📦 ¿Qué puedes donar?

- 💧 Agua potable
- 🥫 Alimentos no perecederos

**¡Contamos con tu solidaridad!** 💚
```
