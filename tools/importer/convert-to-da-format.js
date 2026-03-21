/**
 * Converts .plain.html (delivery format) to DA authoring format.
 *
 * Delivery format:  <div class="block-name"><div><div>cell</div></div></div>
 * DA format:        <table><tr><th>Block Name</th></tr><tr><td>cell</td></tr></table>
 *
 * Also unwraps section <div> wrappers, preserving <hr> between sections.
 */
import { parseHTML } from 'linkedom';
import { readFileSync, writeFileSync } from 'fs';

const KNOWN_BLOCKS = [
  'hero-dark', 'cards-product', 'cards-numbered', 'cards-article',
  'columns-award', 'columns-feature', 'accordion-faq',
  'section-metadata', 'metadata',
];

function kebabToTitle(name) {
  // hero-dark → Hero Dark, section-metadata → Section Metadata
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function convertBlockDivToTable(blockDiv, document) {
  const blockName = blockDiv.getAttribute('class');
  const titleName = kebabToTitle(blockName);

  const table = document.createElement('table');

  // Header row with block name
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Count max cells in any row to set colspan
  let maxCols = 1;
  const rows = blockDiv.querySelectorAll(':scope > div');
  rows.forEach(row => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length > maxCols) maxCols = cells.length;
  });

  const th = document.createElement('th');
  if (maxCols > 1) th.setAttribute('colspan', String(maxCols));
  th.textContent = titleName;
  headerRow.appendChild(th);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body rows
  const tbody = document.createElement('tbody');
  rows.forEach(row => {
    const cells = row.querySelectorAll(':scope > div');
    const tr = document.createElement('tr');

    if (cells.length === 0) {
      // Single cell - use the row content directly
      const td = document.createElement('td');
      td.innerHTML = row.innerHTML;
      tr.appendChild(td);
    } else {
      cells.forEach(cell => {
        const td = document.createElement('td');
        td.innerHTML = cell.innerHTML;
        tr.appendChild(td);
      });
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
}

function convertFile(inputPath, outputPath) {
  const html = readFileSync(inputPath, 'utf-8');
  const { document } = parseHTML(`<!DOCTYPE html><html><body>${html}</body></html>`);
  const body = document.body;

  // Step 1: Convert block divs to tables
  // Find all divs and check class attribute directly (avoids CSS.escape issues)
  const allDivs = Array.from(body.querySelectorAll('div[class]'));
  allDivs.forEach(div => {
    const className = div.getAttribute('class');
    if (KNOWN_BLOCKS.includes(className)) {
      const table = convertBlockDivToTable(div, document);
      div.replaceWith(table);
    }
  });

  // Step 2: Unwrap section wrapper divs
  // In .plain.html, each section is wrapped in a <div>. We need to unwrap them
  // and ensure <hr> separates sections.
  const topLevelDivs = Array.from(body.querySelectorAll(':scope > div'));

  if (topLevelDivs.length > 0) {
    const fragment = document.createDocumentFragment();

    topLevelDivs.forEach((sectionDiv, index) => {
      // Add <hr> between sections (not before the first one)
      if (index > 0) {
        fragment.appendChild(document.createElement('hr'));
      }

      // Move all children out of the section wrapper
      while (sectionDiv.firstChild) {
        fragment.appendChild(sectionDiv.firstChild);
      }
    });

    // Replace body content
    body.innerHTML = '';
    body.appendChild(fragment);
  }

  // Step 3: Serialize
  let output = body.innerHTML;

  writeFileSync(outputPath, output, 'utf-8');
  console.log(`Converted: ${inputPath} → ${outputPath}`);
}

// Process all content files
const files = [
  { input: 'content/bank.plain.html', output: 'content/bank.da.html' },
  { input: 'content/bank/premium-savings-account.plain.html', output: 'content/bank/premium-savings-account.da.html' },
  { input: 'content/bank/max-rate-checking.plain.html', output: 'content/bank/max-rate-checking.da.html' },
  { input: 'content/bank/checking.plain.html', output: 'content/bank/checking.da.html' },
  { input: 'content/bank/certificate-of-deposit.plain.html', output: 'content/bank/certificate-of-deposit.da.html' },
  { input: 'content/bank/line-of-credit.plain.html', output: 'content/bank/line-of-credit.da.html' },
];

files.forEach(({ input, output }) => {
  try {
    convertFile(input, output);
  } catch (e) {
    console.error(`Failed to convert ${input}:`, e.message);
  }
});

console.log('\nDone. DA-format files written as .da.html');
