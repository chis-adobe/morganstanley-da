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

function closeAllMenus() {
  const openMenus = document.body.querySelectorAll('header .is-open');
  for (const openMenu of openMenus) {
    openMenu.classList.remove('is-open');
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

function decorateBrandSection(section) {
  section.classList.add('brand-section');
  const brandLink = section.querySelector('a');
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

      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMenu(li);
        });
      }
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

async function decorateHeader(fragment) {
  const sections = [
    ...fragment.querySelectorAll(':scope > .section'),
  ];
  if (sections.length < 3) return;

  // First section = brand
  decorateBrandSection(sections[0]);

  // Last section = actions/tools
  decorateActionSection(sections[sections.length - 1]);

  // Second section = nav (contains nav-flyout blocks)
  decorateNavSection(sections[1]);

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
    await decorateHeader(fragment);
    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }
}
