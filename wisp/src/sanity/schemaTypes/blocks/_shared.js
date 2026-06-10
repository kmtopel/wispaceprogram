import { defineField, defineArrayMember } from "sanity";

// Optional anchor ID for deep-linking to a block (e.g., /#shows).
// Shared across all block types so they behave consistently.
export const anchorField = defineField({
  name: "anchor",
  title: "Anchor ID",
  type: "string",
  description:
    "Optional. Link directly to this section with /#your-id. Lowercase letters, numbers, and hyphens only.",
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return true;
      if (!/^[a-z][a-z0-9-]*$/.test(value)) {
        return "Use lowercase letters, numbers, and hyphens. Must start with a letter.";
      }
      return true;
    }),
});

// CTA buttons at the bottom of a block. Shared across blocks so editors
// learn one pattern: header buttons sit above the block's content; these
// sit below it. Either can be used independently or together.
export const ctaButtonsField = defineField({
  name: "ctaButtons",
  title: "CTA buttons",
  type: "array",
  description:
    "Optional buttons shown beneath the block's content. Drag to reorder.",
  of: [defineArrayMember({ type: "button" })],
});

// Alignment for the CTA buttons row. Defaults to center.
export const ctaButtonsAlignField = defineField({
  name: "ctaButtonsAlign",
  title: "CTA buttons alignment",
  type: "string",
  initialValue: "center",
  options: {
    list: [
      { title: "Left", value: "left" },
      { title: "Center", value: "center" },
      { title: "Right", value: "right" },
    ],
    layout: "radio",
  },
  hidden: ({ parent }) => !parent?.ctaButtons?.length,
});
