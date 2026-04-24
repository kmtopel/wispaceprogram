// Fetches the site-wide settings singleton.
export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0] {
  title,
  description,
  socialLinks,
  footerText
}`;

// Fetches a single page by slug, including its blocks with referenced assets.
export const pageQuery = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  blocks[] {
    ...,
    _type == "heroBlock" => {
      ...,
      backgroundImage { ..., asset-> }
    }
  }
}`;
