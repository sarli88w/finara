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

## Menggunakan ikon di HTML

Ikon SVG mentah tersedia di `packages/icons/src/`, dikelompokkan berdasarkan kategori. Untuk menggunakannya, salin atau sajikan direktori tersebut dari web server aplikasi Anda, misalnya ke direktori publik `public/icons/`.

```html
<img src="/icons/BankLogo/BSI.svg" alt="BSI" width="48" height="48">
```

Ganti URL dengan lokasi ikon yang sesuai di aplikasi Anda. Karena SVG dimuat melalui elemen `<img>`, warna ikon tidak dapat diubah dengan CSS halaman; tampilannya mengikuti warna yang ditetapkan di berkas SVG. Untuk aksesibilitas, berikan teks `alt` yang bermakna, atau gunakan `alt=""` jika ikon dekoratif.

Berkas SVG juga bisa disisipkan langsung ke HTML (inline) jika perlu mengatur tampilannya dengan CSS. Pastikan markup SVG berasal dari sumber tepercaya.

## Konvensi ikon

Simpan ikon sebagai SVG di `packages/icons/src/` dengan nama file kebab-case. Gunakan `viewBox="0 0 24 24"`, tanpa ukuran tetap, dan `stroke="currentColor"` atau `fill="currentColor"` jika sesuai desain. Jangan memasukkan skrip atau konten SVG yang tidak tepercaya.
