/**
 * JsonLd — injects a JSON-LD <script> block into the <head> for structured data.
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", ... }} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
