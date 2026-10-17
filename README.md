# Observances

An open list of holidays, heritage months and awareness days, with country codes, date rules and sources. It started as the calendar behind the Canadian Podcast Awards and is meant to grow into a global list.

- One file: [`observances.json`](observances.json)
- Licensed [CC BY 4.0](LICENSE.md): use it freely, give credit
- Contributions welcome, see [CONTRIBUTING.md](CONTRIBUTING.md)

## Use it

Raw file:

```
https://raw.githubusercontent.com/picard102/observances/main/observances.json
```

Pin a [release tag](../../releases) such as `v1.0.0` if you need a stable copy.

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable lowercase slug. Never reuse or change one. |
| `name` | yes | English name. |
| `type` | yes | `monthly`, `yearly`, `date` or `rule`. |
| `month`, `day` | by type | `monthly` needs `month`. `yearly` needs both. |
| `date` | `date` type | A single `YYYY-MM-DD` date, for one-off events. |
| `rule` | `rule` type | Floating dates, see below. |
| `countries` | yes | ISO 3166-1 alpha-2 codes, or `"*"` for global days. |
| `category` | yes | For example `heritage`, `civic`, `un`, `health`, `environment`, `media`, `pop-culture`. |
| `description`, `origin` | no | One or two neutral sentences each. |
| `organizer` | no | Who created or runs the day. |
| `names` | no | Translations, like `{ "fr": "Fête du Canada" }`. |
| `source_url` | no | A primary source. |
| `tags`, `since` | no | Free tags and first year. |

A day that falls on a different date in different countries gets one entry per country and date.

### Date rules

```json
{ "type": "rule", "rule": { "kind": "nth_weekday", "month": 10, "weekday": 1, "nth": 2 } }
```

Second Monday of October. `weekday` is 1 (Monday) to 7 (Sunday).

```json
{ "type": "rule", "rule": { "kind": "weekday_before", "month": 5, "day": 25, "weekday": 1 } }
```

The Monday before May 25.

## Examples

JavaScript, observances for a country in a given year:

```js
const res = await fetch('https://raw.githubusercontent.com/picard102/observances/main/observances.json');
const { observances } = await res.json();

const forCountry = (code) =>
  observances.filter((o) => o.countries.includes(code) || o.countries.includes('*'));

function dateIn(o, year) {
  if (o.type === 'yearly') return new Date(Date.UTC(year, o.month - 1, o.day));
  if (o.type === 'date') return new Date(o.date);
  if (o.type !== 'rule') return null; // monthly: use o.month

  const { kind, month, weekday, nth, day } = o.rule;
  if (kind === 'nth_weekday') {
    const first = new Date(Date.UTC(year, month - 1, 1));
    const offset = (weekday - (first.getUTCDay() || 7) + 7) % 7;
    return new Date(Date.UTC(year, month - 1, 1 + offset + (nth - 1) * 7));
  }
  const d = new Date(Date.UTC(year, month - 1, day - 1)); // weekday_before
  return new Date(d.getTime() - (((d.getUTCDay() || 7) - weekday + 7) % 7) * 864e5);
}
```

Python, filtering by country:

```python
import json, urllib.request

url = "https://raw.githubusercontent.com/picard102/observances/main/observances.json"
data = json.load(urllib.request.urlopen(url))
canada = [o for o in data["observances"] if {"CA", "*"} & set(o["countries"])]
```

## Contributing and credit

Please follow [CONTRIBUTING.md](CONTRIBUTING.md). When you use the data, credit "Observances (picard102/observances), CC BY 4.0".
