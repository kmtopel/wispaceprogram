// Customizes the Sanity Studio sidebar structure.
// Pins Site Settings as a singleton at the top; lists document types beneath.

import { ChartUpwardIcon, ControlsIcon, RefreshIcon } from "@sanity/icons";
import RefreshShowsTool from "@/sanity/tools/RefreshShowsTool";
import AnalyticsLink from "@/sanity/tools/AnalyticsLink";

export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("pressItem").title("Press"),
      // Fallback: show any other document types we add later.
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["siteSettings", "page", "pressItem"].includes(listItem.getId()),
      ),
      S.divider(),
      // Site-level operations that aren't tied to a specific document.
      // Add new entries here as needed (revalidations, exports, etc.).
      S.listItem()
        .title("Site Controls")
        .icon(ControlsIcon)
        .child(
          S.list()
            .title("Site Controls")
            .id("site-controls")
            .items([
              S.listItem()
                .title("Refresh Shows")
                .icon(RefreshIcon)
                .child(
                  S.component(RefreshShowsTool)
                    .title("Refresh Shows")
                    .id("refresh-shows"),
                ),
              S.listItem()
                .title("Analytics")
                .icon(ChartUpwardIcon)
                .child(
                  S.component(AnalyticsLink)
                    .title("Analytics")
                    .id("analytics-link"),
                ),
            ]),
        ),
    ]);
