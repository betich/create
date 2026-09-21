# Design rules

`DESIGN.md` holds the tokens and components, and `impeccable` enforces craft. These rules sit on top of both, and when they conflict, these win.

## The One-Screen Rule

Every main job fits in one screen height, with no page scroll. The key information, the main action and every control the job needs are visible at once. When content is long, it scrolls *inside* its own container (a list, a panel, a timeline), while the action bar and headers stay pinned. Check this at 390×844 (phone), 1024×768 (tablet) and 1440×900 (desktop).

## Clear as day

- **Make the CTA and key info unmistakable.** Each surface has one primary button. Put it where people expect it, for example at the bottom right of the panel it acts on.
- **Key info goes big.** The number, the status or the name someone came to see is set far larger than anything else, often at display size (`clamp(3rem, 6vw, 7rem)`). Personal projects can push this much further.
- **What you can click should look clickable.** Keep action buttons visibly separate from instructions. A mode switch is a real control, not a text link.
- **Disabled means explained.** A disabled button says which step is blocking it, and why.
- **The first thing a user needs to act on comes first,** for example the base image at the top of the left panel.

## Familiar before novel

Borrow the interaction model of a tool people already know, usually Figma: panels, alignment buttons, and component-style "revert to main". Surfaces get named after the metaphor they follow:

- **launchpad:** the index, where each tool is a large door
- **bench:** a left-to-right flow of in, then convert, then out
- **room:** a full-screen editor with its own chrome
- **timeline:** anything sequenced

## Delight, within reason

- Things respond immediately: previews are live, and uploaded media plays on loop.
- Motion confirms what happened. Every animation has a `prefers-reduced-motion` alternative.
- Make it foolproof. Destructive actions get a confirmation dialog, and every change can be undone. Anywhere input might be wrong, offer a template or an example.

## Data-heavy screens

These should feel professional and snappy, and be data-first without looking like a dev tool. Density is fine; clutter isn't. When you remove something, keep what the user came to do.
