<?php

declare(strict_types=1);

namespace Finara\Icons;

final class Icon
{
    public static function path(string $name): string
    {
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $name)) {
            throw new \InvalidArgumentException('Invalid icon name.');
        }

        return dirname(__DIR__, 2) . '/icons/src/' . $name . '.svg';
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
