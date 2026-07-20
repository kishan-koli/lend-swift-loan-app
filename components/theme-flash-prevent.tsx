import Script from 'next/script';

export function ThemeFlashPrevent() {
  return (
    <Script
      id="theme-flash-prevent"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const stored = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const resolved = stored === 'dark' ? 'dark' : stored === 'light' ? 'light' : (prefersDark ? 'dark' : 'light');
            if (resolved === 'dark') {
              document.documentElement.classList.add('dark');
            }
          } catch (e) {}
        `,
      }}
    />
  );
}
