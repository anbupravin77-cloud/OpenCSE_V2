import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
}

export function SEO({
  title,
  description = "Distraction-free academic resources, curriculum guides, course outcomes, and verified study materials for Computer Science & Engineering students.",
  canonicalPath = "/",
  type = "website"
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
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);

    // 4. Set Canonical Link
    const currentOrigin = window.location.origin;
    const fullCanonicalUrl = `${currentOrigin}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', fullCanonicalUrl);

    // 5. Optional Google Site Verification if configured in env
    const googleSite = (import.meta as any).env?.VITE_GOOGLE_SITE;
    if (googleSite && typeof googleSite === 'string' && googleSite.trim().length > 0) {
      setMetaTag('name', 'google-site-verification', googleSite.trim());
    }

    // 6. Optional AdSense Auto-script if configured in env
    const adsenseClient = (import.meta as any).env?.VITE_ADSENSE_CLIENT;
    if (adsenseClient && typeof adsenseClient === 'string' && adsenseClient.startsWith('ca-pub-')) {
      const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient.trim()}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, [title, description, canonicalPath, type]);

  return null;
}
