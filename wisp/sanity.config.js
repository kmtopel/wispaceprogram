"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Prevent users from creating multiple Site Settings documents or deleting the singleton.
    templates: (prev) => prev.filter((t) => t.schemaType !== "siteSettings"),
  },
  document: {
    actions: (prev, { schemaType }) => {
      if (schemaType === "siteSettings") {
        // Remove "duplicate" and "delete" for the settings singleton.
        return prev.filter(
          ({ action }) => !["duplicate", "delete"].includes(action),
        );
      }
      return prev;
    },
  },
});
