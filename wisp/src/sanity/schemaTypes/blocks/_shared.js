import { defineField } from "sanity";

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
