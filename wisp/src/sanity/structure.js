// Customizes the Sanity Studio sidebar structure.
// Pins Site Settings as a singleton at the top; lists Pages beneath.

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
      ...S.documentTypeListItems().filter(
        (listItem) => !["siteSettings", "page"].includes(listItem.getId()),
      ),
    ]);
