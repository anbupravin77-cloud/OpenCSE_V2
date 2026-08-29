import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  breadcrumbs?: Array<{ name: string; path: string }>;
  loadAdsense?: boolean;
}

export function SEO({
  title,
  description = "Distraction-free academic resources, curriculum guides, course outcomes, and verified study materials for Computer Science & Engineering students.",
  canonicalPath = "/",
  type = "website",
  breadcrumbs,
  loadAdsense = false
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes('OpenCSE') ? title : `${title} | OpenCSE`;
    document.title = formattedTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Set Description & Open Graph
    const productionOrigin = 'https://opencse.in';
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const currentOrigin = isLocalhost ? window.location.origin : productionOrigin;
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const fullCanonicalUrl = `${currentOrigin}${cleanPath}`;

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', fullCanonicalUrl);
    setMetaTag('property', 'og:site_name', 'OpenCSE');
    
    // Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);

    // 4. Set Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', fullCanonicalUrl);

    // 5. Dynamic JSON-LD Structured Data Schema for Route
    let dynamicSchemaScript = document.getElementById('dynamic-page-schema');
    if (!dynamicSchemaScript) {
      dynamicSchemaScript = document.createElement('script');
      dynamicSchemaScript.id = 'dynamic-page-schema';
      dynamicSchemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(dynamicSchemaScript);
    }

    const schemaData: any = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebPage',
      'name': formattedTitle,
      'description': description,
      'url': fullCanonicalUrl,
      'isPartOf': {
        '@type': 'WebSite',
        'name': 'OpenCSE',
        'url': currentOrigin
      }
    };

    if (breadcrumbs && breadcrumbs.length > 0) {
      schemaData['breadcrumb'] = {
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': b.name,
          'item': `${currentOrigin}${b.path.startsWith('/') ? b.path : `/${b.path}`}`
        }))
      };
    }

    dynamicSchemaScript.textContent = JSON.stringify(schemaData);

    // 6. Optional Google Site Verification if configured in env
    const googleSite = (import.meta as any).env?.VITE_GOOGLE_SITE;
    if (googleSite && typeof googleSite === 'string' && googleSite.trim().length > 0) {
      setMetaTag('name', 'google-site-verification', googleSite.trim());
    }

    // 7. AdSense Loading
    if (loadAdsense) {
      const adsenseClient = 'ca-pub-5652255852120529';
      const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, [title, description, canonicalPath, type, breadcrumbs, loadAdsense]);

  return null;
}

