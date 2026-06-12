// Renders a JSON-LD structured-data script tag. Use to declare schema.org
// types (MusicGroup, Event, NewsArticle, etc.) so search engines can
// understand the content's shape and surface rich results.
//
// dangerouslySetInnerHTML is safe here because the input is a JSON object
// we control; we JSON.stringify it ourselves so no untrusted strings
// reach the DOM as HTML.
export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
