// Resolves a Sanity nav item into a usable href.
// Nav items come in three shapes (discriminated by _type):
//   navInternal — { label, page: { slug: { current } } }
//   navAnchor   — { label, anchor, page?: { slug: { current } } }
//   navExternal — { label, url, newTab }
export function getNavHref(item) {
  if (!item) return null;

  const slug = item.page?.slug?.current;

  if (item._type === "navInternal") {
    if (!slug) return null;
    return slug === "home" ? "/" : `/${slug}`;
  }

  if (item._type === "navAnchor") {
    if (!item.anchor) return null;
    const base = !slug || slug === "home" ? "" : `/${slug}`;
    return `${base}/#${item.anchor}`;
  }

  if (item._type === "navExternal") {
    return item.url || null;
  }

  return null;
}

export function isExternal(item) {
  return item?._type === "navExternal";
}
