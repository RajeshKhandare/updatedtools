import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('out');
const festivalSlugs = [
  'navratri-colors-2026',
  'diwali-mithai-faral-calculator',
  'diwali-puja-samagri-checklist',
  'diwali-budget-calculator',
  'diya-requirement-calculator',
  'diwali-cleaning-planner',
  'diwali-countdown-preparation-planner',
];

const hindiKeywordChecks = {
  'navratri-colors-2026': ['नवरात्रि 9 रंग 2026', 'आज का नवरात्रि रंग', 'नवरात्रि ड्रेस कलर 2026'],
  'diwali-mithai-faral-calculator': ['दिवाली मिठाई मात्रा', 'फराल प्लानिंग', 'महाराष्ट्रियन फराल'],
  'diwali-puja-samagri-checklist': ['दिवाली पूजा सामग्री सूची', 'लक्ष्मी पूजा सामग्री', 'दिवाली पूजा सामान'],
  'diwali-budget-calculator': ['दिवाली बजट कैलकुलेटर', 'दिवाली शॉपिंग बजट', 'दिवाली बजट प्लानर'],
  'diya-requirement-calculator': ['दीया कैलकुलेटर', 'दिवाली दीया कैलकुलेटर', 'दिवाली के लिए कितने दीये'],
  'diwali-cleaning-planner': ['दिवाली सफाई चेकलिस्ट', 'दिवाली सफाई प्लान', 'दिवाली डीप क्लीनिंग'],
  'diwali-countdown-preparation-planner': ['दिवाली काउंटडाउन 2026', 'दिवाली तैयारी चेकलिस्ट', 'दिवाली शॉपिंग चेकलिस्ट'],
};

function read(rel) {
  const file = path.join(out, rel);
  if (!fs.existsSync(file)) throw new Error('Missing generated page: ' + rel);
  return fs.readFileSync(file, 'utf8');
}

function hasHreflang(html, lang, href) {
  const normalized = html.replace(/\s+/g, ' ');
  return new RegExp(`(?:hreflang|hrefLang)=[\"']${lang}[\"'][^>]*href=[\"']${href.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\\\$&')}[\"']`, 'i').test(normalized)
    || new RegExp(`href=[\"']${href.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\\\$&')}[\"'][^>]*(?:hreflang|hrefLang)=[\"']${lang}[\"']`, 'i').test(normalized);
}

let checked = 0;
for (const slug of festivalSlugs) {
  const en = read(`tools/${slug}/index.html`);
  const hi = read(`hi/tools/${slug}/index.html`);
  const enUrl = `https://toolployee.com/tools/${slug}/`;
  const hiUrl = `https://toolployee.com/hi/tools/${slug}/`;
  if (!hasHreflang(en, 'en', enUrl) || !hasHreflang(en, 'hi', hiUrl)) throw new Error('English hreflang missing for ' + slug);
  if (!hasHreflang(hi, 'en', enUrl) || !hasHreflang(hi, 'hi', hiUrl)) throw new Error('Hindi hreflang missing for ' + slug);

  const foundKeywords = (hindiKeywordChecks[slug] || []).filter((keyword) => hi.includes(keyword));
  if (foundKeywords.length < 2) throw new Error(`Hindi SEO keyword coverage too low for ${slug}: ${foundKeywords.join(', ')}`);

  const amazonLinks = (hi.match(/https:\/\/www\.amazon\.in\/s\?/g) || []).length;
  if (amazonLinks < 2) throw new Error('Amazon shopping links missing from Hindi page: ' + slug);
  checked++;
}

for (let day = 1; day <= 9; day++) {
  const en = read(`tools/navratri-colors-2026/day-${day}/index.html`);
  const hi = read(`hi/tools/navratri-colors-2026/day-${day}/index.html`);
  const enUrl = `https://toolployee.com/tools/navratri-colors-2026/day-${day}/`;
  const hiUrl = `https://toolployee.com/hi/tools/navratri-colors-2026/day-${day}/`;
  if (!hasHreflang(en, 'en', enUrl) || !hasHreflang(en, 'hi', hiUrl)) throw new Error('English Navratri day hreflang missing: day-' + day);
  if (!hasHreflang(hi, 'en', enUrl) || !hasHreflang(hi, 'hi', hiUrl)) throw new Error('Hindi Navratri day hreflang missing: day-' + day);
}

const tag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG?.trim() || '';
if (tag) {
  const sample = read('hi/tools/diwali-puja-samagri-checklist/index.html');
  if (!sample.includes(`tag=${tag}`) && !sample.includes(`tag%3D${tag}`)) {
    throw new Error('Amazon Associate tag is configured but was not present in generated affiliate links.');
  }
  console.log('Amazon Associates tag: present in generated links.');
} else {
  console.log('Amazon Associates tag: not configured in CI; Amazon search links are present and will become tagged when the Cloudflare build variable is set.');
}

console.log(`Festival SEO verification OK: ${checked} Hindi/English festival pages + 18 Navratri day pages checked for hreflang, Hindi search-intent content, and Amazon link placement.`);
