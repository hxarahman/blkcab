import { Helmet } from "react-helmet-async";

const SITE_URL = "https://blkcab.com";
const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/16fefc91-a02f-45b3-8737-313e850549d3/id-preview-4f98dc52--048f424f-79bd-4144-8fe5-4b006f58ccdc.lovable.app-1777467699268.png";

interface SeoProps {
  title: string;
  description: string;
  /** Route path starting with "/" — used for canonical + og:url */
  path: string;
  image?: string;
  jsonLd?: object | object[];
}

export const Seo = ({ title, description, path, image = DEFAULT_OG_IMAGE, jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};
