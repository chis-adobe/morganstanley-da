/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: etrade sections.
 * Adds section breaks and section-metadata blocks based on template sections.
 * Runs in afterTransform only, using payload.template.sections.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const template = payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues
    const sections = [...template.sections].reverse();

    for (const section of sections) {
      // Find the first element matching the section selector
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        try {
          sectionEl = element.querySelector(sel);
        } catch (e) {
          // Selector may not be valid in this context
        }
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> section break before each section (except the first)
      if (section.id !== sections[sections.length - 1].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
