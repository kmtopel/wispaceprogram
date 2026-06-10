import { buttonType } from "./button";
import { sectionHeaderType } from "./sectionHeader";

// Shared object schemas — reusable schema fragments that aren't documents
// and aren't page blocks. Include these on top-level field definitions
// (e.g., `type: "sectionHeader"`) inside blocks or documents.
export const objectTypes = [buttonType, sectionHeaderType];
