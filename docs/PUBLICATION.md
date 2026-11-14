# Penggunaan Finara Icons

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

Persyaratan: Node.js 24 atau lebih baru dan npm.

```sh
npm install
npm run validate
npm run generate
```

Generator menyalin SVG ke lokasi aset Composer dan membangkitkan komponen dari SVG yang valid:

- React: `packages/react/src/generated/`
- Vue: `packages/vue/src/generated/`
- React Native: `packages/react-native/src/generated/`

Berkas SVG kosong dilewati untuk pembuatan komponen. Perbaiki atau hapus berkas kosong sebelum digunakan. Jalankan kembali validasi dan generator setelah menambah atau mengubah sumber ikon.

## Menggunakan SVG pada HTML

Salin atau sajikan `packages/icons/src/` dari direktori publik situs, misalnya `public/icons/`, lalu rujuk file dengan URL relatif:

```html
<img src="/icons/BankLogo/BSI.svg" alt="BSI" width="48" height="48">
```

Untuk ikon dekoratif gunakan `alt=""`. SVG yang digunakan melalui `<img>` tidak dapat diwarnai menggunakan CSS halaman; warnanya mengikuti isi berkas SVG. Jika perlu menata elemen SVG dengan CSS, sisipkan markup SVG inline dari sumber tepercaya.

## Menggunakan adapter framework

Komponen dikembangkan dari sumber SVG yang sama. Setelah adapter dikemas dan dirilis ke npm, instal paket framework yang sesuai. Nama berikut adalah nama paket yang direncanakan.

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

## PHP / Composer

Paket Composer direncanakan menggunakan nama `finara/icons`. Setelah tersedia di Packagist:

```sh
composer require finara/icons
```

Pastikan aset SVG disertakan dalam distribusi paket dan lokasi aset sesuai dengan implementasi helper. Hindari menyisipkan SVG dari sumber tak tepercaya tanpa sanitasi.

## Konvensi sumber ikon

- Tambahkan SVG ke `packages/icons/src/<kategori>/`.
- Gunakan nama file yang jelas dan pertahankan kategori agar nama ikon tidak bertabrakan.
- Usahakan SVG memiliki `viewBox`; sumber SVG logo boleh memiliki dimensi dan proporsi yang berbeda.
- Jangan masukkan skrip, event handler, atau konten SVG yang tidak tepercaya.
- Setelah mengubah sumber, jalankan `npm run validate` dan `npm run generate`.
