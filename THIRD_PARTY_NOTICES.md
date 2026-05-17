# Third-party Notices

## CHISE-IDS

This project includes data derived from the CHISE-IDS package.

- Upstream: [CHISE / CHISE IDS database](https://gitlab.chise.org/CHISE/ids)
- Project site: [CHISE project](https://www.chise.org/)
- License: GNU General Public License, version 2 or any later version (`GPL-2.0-or-later`)
- Generated data: `public/data/kanji-parts-map.json`
- Public notice: `public/data/CHISE-IDS-NOTICE.txt`
- GPL v2 text: `public/licenses/GPL-2.0.txt`

The generated data is built from:

- `vendor/chise-ids/IDS-UCS-Basic.txt`
- `vendor/chise-ids/IDS-UCS-Ext-A.txt`
- `vendor/chise-ids/IDS-UCS-Compat.txt`

The upstream CHISE-IDS acknowledgment notes that some `IDS-UCS*` data are derived and expanded from the CDP database developed by C.C. Hsieh and his team at Academia Sinica, Taipei, Taiwan.

The generator is `scripts/build-map.ts`.
