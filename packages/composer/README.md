# Finara Icons for Composer / PHP

This package contains the PHP helper. Canonical SVG assets live in `packages/icons/src/` at the repository root. Generated distribution files are created during release and are not committed to the repository.

```php
use Finara\Icons\Icon;

$path = Icon::path('BankLogo/BRI');
$svg = Icon::svg('BankLogo/BRI');
```

The CSS/CDN bundle and SVG files are generated from the same canonical sources into `packages/composer/dist/` during the tagged GitHub release workflow. The release archive contains the Composer helper and generated assets. For local preview, run `RELEASE_TAG=main npm run generate`; do not commit generated `dist/` files.
