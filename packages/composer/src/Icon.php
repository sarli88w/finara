<?php

declare(strict_types=1);

namespace Finara\Icons;

final class Icon
{
    public static function path(string $name): string
    {
        if (!preg_match('#^[A-Za-z0-9_-]+(?:/[A-Za-z0-9_-]+)*$#', $name)) {
            throw new \InvalidArgumentException('Invalid icon name.');
        }

        $path = dirname(__DIR__) . '/dist/' . $name . '.svg';
        $realPath = realpath($path);
        $iconsDirectory = realpath(dirname(__DIR__) . '/dist');

        if ($realPath === false || $iconsDirectory === false || !str_starts_with($realPath, $iconsDirectory . DIRECTORY_SEPARATOR)) {
            throw new \OutOfBoundsException("Icon not found: {$name}");
        }

        return $realPath;
    }

    public static function svg(string $name): string
    {
        $path = self::path($name);
        if (!is_file($path)) {
            throw new \OutOfBoundsException("Icon not found: {$name}");
        }

        return (string) file_get_contents($path);
    }
}
