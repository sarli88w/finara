# Penggunaan dan publikasi Finara Icons

> Status: fondasi proyek. Generator komponen tersedia, tetapi proses build dan publikasi paket ke registry publik belum disiapkan sepenuhnya. Nama paket contoh di bawah merupakan rencana dan belum tentu tersedia untuk instalasi.

## Struktur proyek

```text
packages/
├── icons/          # Sumber utama SVG
├── react/          # Adapter React dan Next.js
├── vue/            # Adapter Vue 3
├── react-native/   # Adapter React Native (react-native-svg)
└── composer/       # Paket PHP/Composer dan aset SVG
scripts/
├── generate-icons.mjs
└── validate-icons.mjs
```

## Pengembangan lokal

Persyaratan: Node.js 18 atau lebih baru dan npm.

```sh
npm install
npm run validate
npm run generate
```

Generator menyalin SVG ke lokasi aset Composer dan membangkitkan komponen dari SVG yang valid:

- React: `packages/react/src/generated/`
- Vue: `packages/vue/src/generated/`
- React Native: `packages/react-native/src/generated/`

Berkas SVG kosong dilewati untuk pembuatan komponen. Perbaiki atau hapus berkas kosong sebelum rilis publik. Jalankan kembali validasi dan generator setelah menambah atau mengubah sumber ikon.

## Menggunakan SVG pada HTML

Salin atau sajikan `packages/icons/src/` dari direktori publik situs, misalnya `public/icons/`, lalu rujuk file dengan URL relatif:

```html
<img src="/icons/BankLogo/BSI.svg" alt="BSI" width="48" height="48">
```

Untuk ikon dekoratif gunakan `alt=""`. SVG yang digunakan melalui `<img>` tidak dapat diwarnai menggunakan CSS halaman; warnanya mengikuti isi berkas SVG. Jika perlu menata elemen SVG dengan CSS, sisipkan markup SVG inline dari sumber tepercaya.

## Menggunakan adapter framework

Komponen dikembangkan dari sumber SVG yang sama. Setelah adapter dikemas dan dirilis ke npm, instal paket framework yang sesuai. Nama berikut adalah nama paket yang direncanakan, bukan jaminan sudah tersedia di npm.

### React / Next.js

```sh
npm install @finara-icons/react
```

```tsx
import { BSIIcon } from "@finara-icons/react";

export function Example() {
  return <BSIIcon size={48} aria-label="BSI" />;
}
```

### Vue 3

```sh
npm install @finara-icons/vue
```

```vue
<script setup lang="ts">
import { BSIIcon } from "@finara-icons/vue";
</script>

<template>
  <BSIIcon :size="48" aria-label="BSI" />
</template>
```

### React Native

```sh
npm install @finara-icons/react-native react-native-svg
```

```tsx
import { BSIIcon } from "@finara-icons/react-native";

export function Example() {
  return <BSIIcon size={48} accessibilityLabel="BSI" />;
}
```

API komponen dan contoh di atas menjadi target penggunaan; verifikasi dengan proyek contoh setelah build dan pengujian adapter disiapkan.

## PHP / Composer

Paket Composer direncanakan menggunakan nama `finara/icons`. Setelah dipublikasikan ke Packagist:

```sh
composer require finara/icons
```

Paket menyediakan helper untuk membaca ikon berdasarkan nama. Pastikan aset SVG disertakan di arsip distribusi dan lokasi aset sesuai dengan implementasi helper sebelum rilis. Hindari menyisipkan SVG dari sumber tak tepercaya tanpa sanitasi.

## Publikasi untuk penggunaan umum

Rilis publik membutuhkan distribusi terpisah untuk tiap ekosistem:

1. **GitHub** — publikasikan repository, lisensi, dokumentasi, dan changelog.
2. **npm** — bangun dan publikasikan paket React, Vue, dan React Native. Pastikan nama/scope paket tersedia, tetapkan `exports`, tipe, `files`, peer dependencies, serta uji instalasi dari proyek terpisah.
3. **Packagist** — lengkapi `composer.json`, pastikan kelas PHP dan semua aset SVG masuk arsip, lalu tautkan repository ke Packagist.
4. **Hosting statis/CDN** — unggah SVG dari `packages/icons/src/` ke hosting publik. Gunakan URL versi tetap, misalnya `https://cdn.example.com/1.0.0/BankLogo/BSI.svg`, bukan URL yang isinya dapat berubah tanpa versi.
5. **CI dan rilis** — jalankan validasi, generator, build dan tes adapter secara otomatis sebelum membuat tag/rilis. Gunakan SemVer dan jaga versi paket tetap selaras.

Sebelum memublikasikan, tinjau hak penggunaan dan atribusi setiap logo merek. Logo bank dan penyedia pembayaran dapat memiliki ketentuan merek dagang tersendiri; keberadaan sebuah berkas di repository tidak otomatis memberikan hak untuk mendistribusikannya.

## Konvensi sumber ikon

- Tambahkan SVG ke `packages/icons/src/<kategori>/`.
- Gunakan nama file yang jelas dan pertahankan kategori agar nama ikon tidak bertabrakan.
- Usahakan SVG memiliki `viewBox`; sumber SVG logo boleh memiliki dimensi dan proporsi yang berbeda.
- Jangan masukkan skrip, event handler, atau konten SVG yang tidak tepercaya.
- Setelah mengubah sumber, jalankan `npm run validate` dan `npm run generate`.
