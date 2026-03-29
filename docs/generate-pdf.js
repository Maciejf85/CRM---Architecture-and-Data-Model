#!/usr/bin/env node
/**
 * Generuje PDF ze specyfikacji technicznej ClientOps CRM
 *
 * Użycie:
 *   node generate-pdf.js [plik] [wersja]
 *
 * Przykłady:
 *   node generate-pdf.js 1.5.0                              → clientops-crm-spec v1.5.0
 *   node generate-pdf.js clientops-architecture 2.0.0       → architecture v2.0.0
 *   node generate-pdf.js clientops-seo 1.0.0                → SEO module v1.0.0
 *   node generate-pdf.js clientops-audit 1.0.0              → Audit module v1.0.0
 *   node generate-pdf.js clientops-infrastructure 1.0.0     → Infrastructure v1.0.0
 *   node generate-pdf.js all 1.0.0                          → wszystkie pliki
 *
 * Numerowanie PDF:
 *   01 - clientops-crm-spec
 *   02 - clientops-architecture
 *   03 - clientops-libraries
 *   04 - clientops-structure
 *   05 - clientops-implementation
 *   06 - clientops-seo
 *   07 - clientops-audit
 *   08 - clientops-infrastructure
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Mapa plików → numery w serii PDF
const FILE_ORDER = {
  'clientops-crm-spec':       '01',
  'clientops-architecture':   '02',
  'clientops-libraries':      '03',
  'clientops-structure':      '04',
  'clientops-implementation': '05',
  'clientops-seo':            '06',
  'clientops-audit':          '07',
  'clientops-infrastructure': '08',
};

const ALL_FILES = Object.keys(FILE_ORDER);

// Parsuj argumenty: node generate-pdf.js [plik] [wersja]
// Backward compat: node generate-pdf.js [wersja]  → zakłada clientops-crm-spec
let fileArg   = process.argv[2] || null;
let versionArg = process.argv[3] || null;

// Jeśli pierwszy argument wygląda jak wersja (np. "1.5.0") — stary tryb
if (fileArg && /^\d+\.\d+/.test(fileArg)) {
  versionArg = fileArg;
  fileArg    = 'clientops-crm-spec';
}

const version  = versionArg || 'draft';
const filesToProcess = (fileArg === 'all') ? ALL_FILES : [fileArg || 'clientops-crm-spec'];

if (!fs.existsSync(path.join(__dirname, 'pdf'))) {
  fs.mkdirSync(path.join(__dirname, 'pdf'));
}

async function generatePdf(fileName, ver) {
  const inputPath = path.join(__dirname, `${fileName}.html`);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌  Plik nie istnieje: ${inputPath}`);
    return;
  }

  const num    = FILE_ORDER[fileName] || '00';
  const output = path.join(__dirname, 'pdf', `${num}-${fileName}-v${ver}.pdf`);

  console.log(`\n📄 Generowanie: ${fileName} v${ver}`);
  console.log(`   Źródło: ${inputPath}`);
  console.log(`   Wyjście: ${output}`);

  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();

  await page.goto(`file://${inputPath}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`   ✅  Zapisano: ${output}`);
}

(async () => {
  console.log(`\nClientOps — Generator PDF`);
  console.log(`Wersja: ${version} | Pliki: ${filesToProcess.join(', ')}\n`);

  for (const file of filesToProcess) {
    await generatePdf(file, version);
  }

  console.log('\n✅  Wszystkie PDF wygenerowane.\n');
})();
