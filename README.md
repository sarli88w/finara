# Finara Icons

Koleksi logo dan ikon SVG dengan adapter untuk React/Next.js, Vue 3, React Native, PHP/Composer, serta penggunaan HTML langsung. Sumber SVG utama berada di `packages/icons/src/` dan dikelompokkan menurut kategori.

## Struktur proyek

```text
packages/
├── icons/          # Sumber utama SVG
├── react/          # Adapter React dan Next.js
├── vue/            # Adapter Vue 3
├── react-native/   # Adapter React Native
└── composer/       # Paket PHP/Composer dan aset SVG
scripts/            # Generator dan validasi ikon
```

## Mulai lokal

Persyaratan: Node.js 18 atau lebih baru dan npm.

```sh
npm install
npm run validate
npm run generate
```

Untuk dokumentasi lengkap tentang penggunaan HTML/framework, pengembangan, serta rilis publik, lihat [`docs/PUBLICATION.md`](docs/PUBLICATION.md).

## Lisensi

Lihat [`LICENSE`](./LICENSE). Lisensi repository tidak menggantikan hak merek atau ketentuan penggunaan logo pihak ketiga.
