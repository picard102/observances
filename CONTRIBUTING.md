# Contributing

Thanks for helping. The most useful contributions are corrections, sources and new observances for countries not covered yet.

## Adding or changing an entry

1. Edit `observances.json`. Keep entries grouped as they are and keep ids unique.
2. Run `npm test`. It checks ids, countries, dates and rules.
3. Open a pull request and fill in the checklist.

## Rules

- **Sources:** Every new entry needs a `source_url` pointing to a primary source: the organizer, a government site or a UN agency. Wikipedia is fine to find the source but not to cite as one.
- **Countries:** Use ISO 3166-1 alpha-2 codes, or `"*"` for global days. If the date differs by country, add one entry per country and date.
- **Floating dates:** Use a `rule`, not a hard-coded day, for things like "second Monday of October".
- **Ids:** A lowercase slug of the name, for example `world-diabetes-day`. If a country-specific entry would clash, add the country: `thanksgiving-day-ca`. Do not change an existing id.
- **Text:** Keep `description` and `origin` to one or two neutral sentences. No promotional wording, and do not copy text from other sites.
- **Translations:** Add them under `names` with a language code, like `fr`.

## Not accepted

- Commercial or sponsored "days" with no independent organizer.
- Personal or private events.
- Entries with no source and no way to check them.

## Reporting a mistake

Open an issue with the entry id, what is wrong and a link to a source.
