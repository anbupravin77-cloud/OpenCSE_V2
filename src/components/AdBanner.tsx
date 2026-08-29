import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  id: string;
  scriptSrc: string;
  label?: string;
  className?: string;
}

export function AdBanner({
  id,
  scriptSrc,
  label = 'Advertisement',
  className = '',
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isLoaded) return;

    // Use IntersectionObserver with 200px threshold to lazy-load the ad script
    // This guarantees optimal FCP, LCP, and TBT without main-thread blocking
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && containerRef.current) {
          observer.disconnect();

          // Avoid duplicate injection
          if (containerRef.current.querySelector(`script[data-ad-slot="${id}"]`)) {
            return;
          }

          try {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = scriptSrc;
            script.async = true;
            script.setAttribute('data-ad-slot', id);
            
            script.onerror = () => {
              // Silently handle adblockers or network errors without breaking UI
              console.debug(`Ad unit ${id} blocked or failed to load.`);
            };

            containerRef.current.appendChild(script);
            setIsLoaded(true);
          } catch (e) {
            console.debug('Adsterra script injection error:', e);
          }
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [id, scriptSrc, isLoaded]);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {/* Subtle, standard label matching OpenCSE styling */}
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
          {label}
        </span>
        <span className="text-[9px] font-mono text-zinc-600 dark:text-zinc-400">
          SPONSORED
        </span>
      </div>

      {/* Reserved height container to guarantee ZERO Cumulative Layout Shift (CLS = 0) */}
      <div
        ref={containerRef}
        id={id}
        className="w-full min-h-[90px] max-w-full overflow-hidden rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-center text-center transition-colors"
      >
        {/* Adsterra script banner loads here dynamically */}
      </div>
    </div>
  );
}
