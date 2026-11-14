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

## Auto-publish dari GitHub Actions

Workflow rilis berada di `.github/workflows/release.yml` dan berjalan saat tag dengan pola `v*.*.*` didorong ke GitHub. Workflow memvalidasi SVG, menjalankan generator, lalu menerbitkan paket npm.

### Persiapan npm

1. Buat token npm dengan izin publish yang sesuai.
2. Tambahkan token sebagai repository secret bernama `NPM_TOKEN` di GitHub: **Settings → Secrets and variables → Actions**.
3. Pastikan nama paket tersedia di npm, versi paket-paket yang akan dirilis sudah dinaikkan, serta masing-masing `package.json` memiliki konfigurasi publik yang sesuai, misalnya `publishConfig.access: public` untuk paket berscope.
4. Setelah workflow dan paket siap, push tag rilis:

```sh
git tag v0.1.0
git push origin v0.1.0
```

Workflow yang ada mencoba menerbitkan paket adapter React, Vue, React Native, serta paket SVG `@finara-icons/icons`. Periksa log Actions dan pastikan versi di tag sesuai dengan versi `package.json`. Workflow ini tidak memublikasikan paket Composer.

### Packagist

Packagist umumnya mengambil metadata paket Composer dari repository Git. Daftarkan paket repository di Packagist satu kali dan aktifkan GitHub integration/webhook agar tag Git baru memicu pembaruan. Pastikan `packages/composer/composer.json` valid sebagai paket mandiri dan konfigurasi distribusi aset/helper benar. Monorepo Composer subdirectory sering memerlukan konfigurasi khusus atau split repository; uji publikasi terlebih dahulu. Jangan mengasumsikan tag root `v0.1.0` otomatis menjadi versi Composer yang benar tanpa mengatur strategi versi/subdirectory.

Jika memilih memicu pembaruan Packagist dari Actions, simpan token Packagist sebagai secret GitHub (misalnya `PACKAGIST_TOKEN`) dan panggil endpoint update resmi dengan nama vendor/paket yang sudah terdaftar. Jangan menaruh token di workflow atau repository. Webhook otomatis biasanya lebih sederhana.

### CDN

Untuk aset statis, tidak perlu job upload CDN jika sumber sudah dapat diakses publik di GitHub atau npm. Setelah tag/release tersedia, jsDelivr dapat menyajikan berkas dari repository GitHub, misalnya:

```html
<img src="https://cdn.jsdelivr.net/gh/USERNAME/REPOSITORY@v0.1.0/packages/icons/src/BankLogo/BSI.svg" alt="BSI">
```

Ganti `USERNAME` dan `REPOSITORY` dengan alamat repository sebenarnya. URL versi/tag bersifat tetap untuk konsumen; hindari `@main` pada production. CDN di atas mengambil aset langsung dari GitHub, bukan upload terpisah ke layanan CDN. Jika menginginkan domain/CDN dengan kontrol penuh, tambahkan job deploy khusus (misalnya ke Cloudflare R2/Pages atau S3) dan simpan kredensial sebagai GitHub Secrets.

> Sebelum mengaktifkan publikasi otomatis, lengkapi build/test dan konfigurasi packaging. Workflow saat ini baru melakukan validasi/generasi lalu `npm publish`; uji dengan versi pra-rilis atau registry staging bila memungkinkan, dan jangan membuat tag produksi sampai semua paket benar-benar siap.

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
