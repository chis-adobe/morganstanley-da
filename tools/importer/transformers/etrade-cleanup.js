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
    // header#mainHeader: site header with nav and utility bar (line 3-826)
    // footer#mainFooter: site footer with links and disclaimers (line 1955+)
    // .sticky-cta-xf: sticky CTA bar overlay (line 1927-1951)
    // .skip-navigation: accessibility skip link (line 7)
    WebImporter.DOMUtils.remove(element, [
      'header#mainHeader',
      'footer#mainFooter',
      '.sticky-cta-xf',
      '.skip-navigation',
      'iframe',
    ]);

    // Clean tracking attributes from all elements
    element.querySelectorAll('[data-cmp-link-accessibility-enabled]').forEach((el) => {
      el.removeAttribute('data-cmp-link-accessibility-enabled');
    });
  }
}
