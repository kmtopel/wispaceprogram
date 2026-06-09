// Customizes the Sanity Studio sidebar structure.
// Pins Site Settings as a singleton at the top; lists document types beneath.

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
    ]);
