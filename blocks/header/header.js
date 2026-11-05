import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';
import { setColorScheme } from '../section-metadata/section-metadata.js';

const { locale } = getConfig();

const HEADER_PATH = '/fragments/nav/header';
const HEADER_ACTIONS = [
  '/tools/widgets/scheme',
  '/tools/widgets/language',
  '/tools/widgets/toggle',
];
const DESKTOP_MQ = window.matchMedia('(min-width: 1200px)');
const HOVER_DELAY = 150;

function closeAllMenus() {
  const openMenus = document.body.querySelectorAll('header .is-open');
  for (const openMenu of openMenus) {
    openMenu.classList.remove('is-open');
    openMenu.querySelectorAll(':scope > [aria-expanded]')
      .forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
  }
}

function docClose(e) {
  if (e.target.closest('header')) return;
  closeAllMenus();
}

function toggleMenu(menu) {
  const isOpen = menu.classList.contains('is-open');
  closeAllMenus();
  if (isOpen) {
    document.removeEventListener('click', docClose);
    return;
  }

  // Setup the global close event
  document.addEventListener('click', docClose);
  menu.classList.add('is-open');
}

function decorateLanguage(btn) {
  const section = btn.closest('.section');
  btn.addEventListener('click', async () => {
    let menu = section.querySelector('.language.menu');
    if (!menu) {
      const content = document.createElement('div');
      content.classList.add('block-content');
      const fragment = await loadFragment(
        `${locale.prefix}${HEADER_PATH}/languages`,
      );
      menu = document.createElement('div');
      menu.className = 'language menu';
      menu.append(fragment);
      content.append(menu);
      section.append(content);
    }
    toggleMenu(section);
  });
}

function decorateScheme(btn) {
  btn.addEventListener('click', async () => {
    const { body } = document;

    let currPref = localStorage.getItem('color-scheme');
    if (!currPref) {
      currPref = matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark-scheme' : 'light-scheme';
    }

    const theme = currPref === 'dark-scheme'
      ? { add: 'light-scheme', remove: 'dark-scheme' }
      : { add: 'dark-scheme', remove: 'light-scheme' };

    body.classList.remove(theme.remove);
    body.classList.add(theme.add);
    localStorage.setItem('color-scheme', theme.add);
    // Re-calculate section schemes
    const sections = document.querySelectorAll('.section');
    for (const section of sections) {
      setColorScheme(section);
    }
  });
}

function decorateNavToggle(btn) {
  btn.addEventListener('click', () => {
    const header = document.body.querySelector('header');
    if (header) header.classList.toggle('is-mobile-open');
  });
}

async function decorateAction(header, pattern) {
  const link = header.querySelector(`[href*="${pattern}"]`);
  if (!link) return;

  const icon = link.querySelector('.icon');
  const text = link.textContent;
  const btn = document.createElement('button');
  if (icon) btn.append(icon);
  if (text) {
    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = text;
    btn.append(textSpan);
  }
  const wrapper = document.createElement('div');
  wrapper.className = [
    'action-wrapper',
    icon.classList[1].replace('icon-', ''),
  ].join(' ');
  wrapper.append(btn);
  link.parentElement.parentElement
    .replaceChild(wrapper, link.parentElement);

  if (pattern === '/tools/widgets/language') {
    decorateLanguage(btn);
  }
  if (pattern === '/tools/widgets/scheme') {
    decorateScheme(btn);
  }
  if (pattern === '/tools/widgets/toggle') {
    decorateNavToggle(btn);
  }
}

function stripButtons(root) {
  root.querySelectorAll('.button').forEach((btn) => {
    btn.classList.remove('button');
    const bc = btn.closest('.button-container');
    if (bc) bc.classList.remove('button-container');
  });
}

const SEARCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15.5 15.5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const CLOSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/**
 * Utility links shown top-right above the toolbar.
 * A list item with plain text and a nested list becomes a dropdown.
 */
function decorateUtilitySection(section) {
  section.classList.add('utility-section');
  const list = section.querySelector('ul');
  if (!list) return;
  list.classList.add('utility-list');
  // loose lists wrap item content in <p>; unwrap so links sit directly in the <li>
  list.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
  [...list.children].forEach((li, idx) => {
    li.classList.add('utility-item');
    const submenu = li.querySelector(':scope > ul');
    if (!submenu) return;
    const label = [...li.childNodes]
      .filter((n) => n !== submenu)
      .map((n) => n.textContent).join('').trim();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'utility-toggle';
    button.textContent = label;
    button.setAttribute('aria-expanded', 'false');
    submenu.id = `utility-menu-${idx}`;
    submenu.classList.add('utility-menu');
    button.setAttribute('aria-controls', submenu.id);
    button.addEventListener('click', () => {
      const open = !li.classList.contains('is-open');
      closeAllMenus();
      li.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      if (open) document.addEventListener('click', docClose);
    });
    li.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !li.classList.contains('is-open')) return;
      closeAllMenus();
      button.focus();
    });
    li.replaceChildren(button, submenu);
  });
}

/**
 * Turns the "Search" link into a toggle that opens a search field over the toolbar.
 * The link href is the search results page; the query is sent as "q".
 */
function decorateSearch(section) {
  const link = [...section.querySelectorAll('a')]
    .find((a) => a.textContent.trim().toLowerCase() === 'search');
  if (!link) return;
  const container = link.closest('p') || link;

  const search = document.createElement('div');
  search.className = 'header-search';
  search.innerHTML = `
    <button type="button" class="header-search-toggle" aria-label="Search" aria-expanded="false">${SEARCH_ICON}</button>
    <form class="header-search-form" role="search" action="${link.href}" method="get">
      <label class="header-search-label" for="header-search-input">Search by keyword or symbol</label>
      <input id="header-search-input" type="search" name="q" placeholder="Enter keyword/symbol" autocomplete="off">
      <button type="button" class="header-search-close" aria-label="Close search">${CLOSE_ICON}</button>
    </form>`;
  const toggle = search.querySelector('.header-search-toggle');
  const input = search.querySelector('input');
  const setOpen = (open) => {
    search.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
    else toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(true));
  search.querySelector('.header-search-close').addEventListener('click', () => setOpen(false));
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  container.replaceWith(search);
}

function decorateMobileToggle(header, actions, nav) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'header-menu-toggle';
  button.setAttribute('aria-label', 'Open menu');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<span></span><span></span><span></span>';
  if (nav) {
    nav.id = 'header-main-nav';
    button.setAttribute('aria-controls', nav.id);
  }
  button.addEventListener('click', () => {
    const open = header.classList.toggle('is-mobile-open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  (actions.querySelector('.default-content') || actions).append(button);
}

function decorateBrandSection(section) {
  section.classList.add('brand-section');
  let brandLink = section.querySelector('a');
  const picture = section.querySelector('picture');
  if (!brandLink && picture) {
    brandLink = document.createElement('a');
    brandLink.href = '/';
    brandLink.setAttribute('aria-label', picture.querySelector('img')?.alt || 'Home');
    picture.replaceWith(brandLink);
    brandLink.append(picture);
  }
  if (!brandLink) return;
  const textNodes = [...brandLink.childNodes]
    .filter((n) => n.nodeType === 3 && n.textContent.trim());
  if (textNodes.length) {
    const span = document.createElement('span');
    span.className = 'brand-text';
    span.append(...textNodes);
    brandLink.append(span);
  }
}

/**
 * Build the main nav list from nav-flyout blocks.
 * Each .nav-flyout block contains a .nav-flyout-link and
 * an optional .nav-flyout-menu with columns + footer.
 */
function decorateNavSection(section) {
  section.classList.add('main-nav-section');

  const flyouts = [...section.querySelectorAll('.nav-flyout')];
  if (!flyouts.length) return;

  const navList = document.createElement('ul');
  navList.classList.add('main-nav-list');

  for (const flyout of flyouts) {
    const li = document.createElement('li');
    li.classList.add('main-nav-item');

    // Extract the top-level link
    const linkEl = flyout.querySelector('.nav-flyout-link');
    const link = linkEl?.querySelector('a');

    if (link) {
      link.classList.add('main-nav-link');
      stripButtons(linkEl);
      li.append(link);
    }

    // Attach the flyout menu (if any columns exist)
    const menu = flyout.querySelector('.nav-flyout-menu');
    if (menu) {
      menu.classList.add('mega-menu');
      stripButtons(menu);
      li.append(menu);

      // Click handler (mobile + fallback)
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMenu(li);
        });
      }

      // Desktop hover intent
      let hoverTimer;
      li.addEventListener('mouseenter', () => {
        if (!DESKTOP_MQ.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          closeAllMenus();
          document.addEventListener('click', docClose);
          li.classList.add('is-open');
        }, HOVER_DELAY);
      });
      li.addEventListener('mouseleave', () => {
        if (!DESKTOP_MQ.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          li.classList.remove('is-open');
        }, HOVER_DELAY);
      });
    }

    navList.append(li);

    // Remove the original block wrapper from the section
    const wrapper = flyout.closest('.nav-flyout-wrapper') || flyout;
    wrapper.remove();
  }

  const nav = document.createElement('nav');
  nav.append(navList);

  const defaultContent = section.querySelector('.default-content');
  if (defaultContent) {
    defaultContent.append(nav);
  } else {
    section.append(nav);
  }
}

async function decorateActionSection(section) {
  section.classList.add('actions-section');
}

async function decorateHeader(fragment, header) {
  const sections = [
    ...fragment.querySelectorAll(':scope > .section'),
  ];
  if (sections.length < 3) return;

  // Optional first section = utility links (shown top right)
  const utility = sections.length > 3 ? sections.shift() : null;
  if (utility) decorateUtilitySection(utility);

  const [brand, nav] = sections;
  const actions = sections[sections.length - 1];
  decorateBrandSection(brand);
  decorateActionSection(actions);
  decorateNavSection(nav);
  decorateSearch(actions);

  // Keep a copy of the primary CTA in the mobile menu
  const cta = actions.querySelector('a.btn');
  const navList = nav.querySelector('.main-nav-list');
  if (cta && navList) {
    const li = document.createElement('li');
    li.className = 'main-nav-item main-nav-cta';
    li.append(cta.cloneNode(true));
    navList.append(li);
  }
  decorateMobileToggle(header, actions, nav.querySelector('nav'));

  // Brand, nav and actions sit together in the rounded toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'header-toolbar';
  toolbar.append(brand, nav, actions);
  fragment.append(toolbar);

  for (const pattern of HEADER_ACTIONS) {
    decorateAction(fragment, pattern);
  }
}

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(
      `${locale.prefix}${path}`,
    );
    fragment.classList.add('header-content');
    await decorateHeader(fragment, el);
    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }
}
