#!/usr/bin/env node
/**
 * Generuje PDF ze specyfikacji technicznej ClientOps CRM
 * Użycie: node generate-pdf.js [wersja]
 * Przykład: node generate-pdf.js 1.1.0
 * Domyślnie: node generate-pdf.js  →  używa wersji z nazwy pliku lub "draft"
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const version = process.argv[2] || 'draft';
const INPUT   = path.join(__dirname, 'clientops-crm-spec.html');
const OUTPUT  = path.join(__dirname, 'pdf', `clientops-crm-spec-v${version}.pdf`);

if (!fs.existsSync(path.join(__dirname, 'pdf'))) {
  fs.mkdirSync(path.join(__dirname, 'pdf'));
}

(async () => {
  console.log(`Generowanie PDF v${version}...`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`file://${INPUT}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: OUTPUT,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`PDF zapisany: ${OUTPUT}`);
})();
