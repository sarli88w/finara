# Finara Icons

Kerangka monorepo untuk membangun dan mendistribusikan ikon SVG lintas platform: Vue, React/Next.js, React Native, PHP Composer, dan CDN.

## Struktur

- `packages/icons/src/` — sumber SVG utama.
- `packages/react/`, `packages/vue/`, `packages/react-native/` — adapter komponen per framework.
- `packages/composer/` — paket PHP yang didistribusikan melalui Composer.
- `scripts/` — generator dan validasi sumber ikon.

## Mulai

```sh
npm install
npm run validate
npm run generate
```

Workspace ini adalah fondasi awal. Paket adapter belum dipublikasikan dan implementasi generator akan dikembangkan seiring penambahan ikon.

## Konvensi ikon

Simpan ikon sebagai SVG di `packages/icons/src/` dengan nama file kebab-case. Gunakan `viewBox="0 0 24 24"`, tanpa ukuran tetap, dan `stroke="currentColor"` atau `fill="currentColor"` jika sesuai desain. Jangan memasukkan skrip atau konten SVG yang tidak tepercaya.
