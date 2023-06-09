import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

import buildImageTextBlock from './image-text-block.js'
import postForm from './post-form.js'

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

function wrapElements(className, content) {
  const elements = Array.isArray(content) ? content : [content]
  const wrapper = document.createElement('div');
  wrapper.className = className
  elements.forEach(element => wrapper.append(element))
  return wrapper
}

function wrapHome(icon, href) {
  const link = document.createElement('a')
  link.href = href;
  link.append(icon)
  return link
}

function buildBreadcrumbTitle(/** @type {Element} */ main) {
  const icon = main.querySelector('div p span.icon-home')
  const breadcrumb = icon && icon.parentElement
  if (breadcrumb && breadcrumb.textContent.includes('/')) {
    //const slices = breadcrumb.textContent.split('/')
    //const home = slices.shift()
    //const page = slices.pop()
    breadcrumb.prepend(wrapHome(icon, '/'))
    //slices.map()
    const div = breadcrumb.parentElement
    const h1 = div.querySelector(':scope h1')
    if (h1) {
      const block = buildBlock('breadcrumb-title', [])
      block.append(wrapElements('breadcrumb', breadcrumb))
      block.append(wrapElements('title', h1))
      block.append(wrapElements('intro', [...div.children]))
      div.append(block)
      main.prepend(div)
    }
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    // SS customisations
    buildBreadcrumbTitle(main)
    buildImageTextBlock(main)
    window['postForm'] = postForm
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.replaceWith(link);
  } else {
    document.head.append(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  /* OSS Allow buttons in the header */
  loadHeader(doc.querySelector('header')).then(() => decorateButtons(doc.querySelector('header')));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  // console.log(document.body.innerHTML)
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
