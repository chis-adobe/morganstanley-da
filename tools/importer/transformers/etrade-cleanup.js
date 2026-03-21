/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: etrade cleanup.
 * Removes non-authorable content from us.etrade.com pages.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove elements that could interfere with block parsing
    // .lip-container: decorative line/pill separator (found at ~line 1560 in cleaned.html)
    // .cq\:featuredimage: empty featured image placeholder (line 1924)
    WebImporter.DOMUtils.remove(element, [
      '.lip-container',
      '.cq\\:featuredimage',
      'link',
      'noscript',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // header: bare <header> tag wrapping div#mainHeader (line 3-827)
    // footer#mainFooter: site footer with links and disclaimers (line 1955+)
    // .sticky-cta-xf: sticky CTA bar overlay (line 1927-1951)
    // .skip-navigation: accessibility skip link (line 7)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer#mainFooter',
      'footer',
      '.sticky-cta-xf',
      '.skip-navigation',
      'iframe',
    ]);

    // Remove tracking pixels (1x1 images from analytics/ad networks)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.match(/doubleclick\.net|bing\.com\/action|analytics\.twitter|t\.co\/1\/i|adentifi\.com|podscribe\.com|cognitivlabs\.com|yahoo\.com\/sp/)) {
        img.remove();
      }
    });

    // Remove empty paragraphs that only contained tracking pixels
    element.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('img, a, table, div')) {
        p.remove();
      }
    });

    // Clean tracking attributes from all elements
    element.querySelectorAll('[data-cmp-link-accessibility-enabled]').forEach((el) => {
      el.removeAttribute('data-cmp-link-accessibility-enabled');
    });
  }
}
