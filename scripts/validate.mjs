// Dependency-free checks for observances.json. Run with `npm test`.
import { readFileSync } from 'node:fs';

const file = new URL('../observances.json', import.meta.url);
const data = JSON.parse(readFileSync(file, 'utf8'));
const errors = [];
const seen = new Set();
const types = ['monthly', 'yearly', 'date', 'rule'];
const daysIn = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

if (!Array.isArray(data.observances)) errors.push('observances must be an array');

for (const [i, o] of (data.observances ?? []).entries()) {
  const at = `#${i} ${o.id ?? o.name ?? '?'}`;
  const bad = (msg) => errors.push(`${at}: ${msg}`);

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(o.id ?? '')) bad('id must be a lowercase slug');
  if (seen.has(o.id)) bad('duplicate id');
  seen.add(o.id);
  if (!o.name) bad('name is required');
  if (!types.includes(o.type)) bad(`type must be one of ${types.join(', ')}`);
  if (!Array.isArray(o.countries) || !o.countries.length || !o.countries.every((c) => /^([A-Z]{2}|\*)$/.test(c))) {
    bad('countries must be ISO 3166-1 alpha-2 codes or "*"');
  }
  if (!o.category) bad('category is required');
  if (o.source_url && !/^https?:\/\//.test(o.source_url)) bad('source_url must be an http(s) URL');

  if (o.days !== undefined) {
    if (!Number.isInteger(o.days) || o.days < 2 || o.days > 366) bad('days must be an integer from 2 to 366');
    if (o.type === 'monthly') bad('monthly already covers the whole month, drop days');
  }

  if (o.type === 'monthly' && !(o.month >= 1 && o.month <= 12)) bad('monthly needs month 1-12');
  if (o.type === 'yearly') {
    if (!(o.month >= 1 && o.month <= 12)) bad('yearly needs month 1-12');
    else if (!(o.day >= 1 && o.day <= daysIn[o.month - 1])) bad('yearly day is not valid for that month');
  }
  if (o.type === 'date' && Number.isNaN(Date.parse(o.date))) bad('date needs a valid date');
  if (o.type === 'rule') {
    const r = o.rule ?? {};
    if (!['nth_weekday', 'weekday_before'].includes(r.kind)) bad('rule.kind must be nth_weekday or weekday_before');
    if (!(r.month >= 1 && r.month <= 12)) bad('rule.month must be 1-12');
    if (!(r.weekday >= 1 && r.weekday <= 7)) bad('rule.weekday must be 1 (Monday) to 7 (Sunday)');
    if (r.kind === 'nth_weekday' && ![-1, 1, 2, 3, 4, 5].includes(r.nth)) bad('nth_weekday needs nth 1-5, or -1 for the last');
    if (r.kind === 'weekday_before' && !(r.day >= 1 && r.day <= 31)) bad('weekday_before needs day');
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`OK: ${data.observances.length} observances`);
