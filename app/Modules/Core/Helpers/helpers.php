<?php

use Illuminate\Support\Str;

if (!function_exists('generate_unique_slug')) {
    function generate_unique_slug(string|object $model, mixed $title, string $column = 'slug', $ignoreId = null): string
    {
        if (is_array($title)) {
            $title = $title['az'] ?? $title['tr'] ?? $title['en'] ?? $title['ru'] ?? reset($title) ?: '';
        }

        $baseSlug = Str::slug((string) $title);
        if (empty($baseSlug)) {
            $baseSlug = 'item-' . Str::lower(Str::random(6));
        }

        $queryClass = is_object($model) ? get_class($model) : $model;
        $slug = $baseSlug;
        $counter = 1;

        while (true) {
            $query = $queryClass::where($column, $slug);
            if ($ignoreId !== null) {
                $query->where('id', '!=', $ignoreId);
            }

            if (!$query->exists()) {
                break;
            }

            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}

if (! function_exists('sanitize_html')) {
    function sanitize_html(?string $html, ?array $allowedTags = null): string
    {
        $html = (string) $html;
        if (trim($html) === '') {
            return '';
        }

        $allowedTags = $allowedTags ?: [
            'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'span', 'div',
            'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'blockquote', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'img', 'figure', 'figcaption',
        ];

        $allowedAttrs = [
            'a' => ['href', 'title', 'target', 'rel'],
            'img' => ['src', 'alt', 'title', 'width', 'height'],
            'th' => ['colspan', 'rowspan', 'scope'],
            'td' => ['colspan', 'rowspan'],
        ];

        $dropTags = ['script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'svg', 'math', 'form'];

        $doc = new \DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML(
            '<?xml encoding="UTF-8"><div id="__sanitize_root__">' . $html . '</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();

        $xpath = new \DOMXPath($doc);
        $root = $xpath->query('//*[@id="__sanitize_root__"]')->item(0);
        if (! $root) {
            return '';
        }

        $walk = function (\DOMNode $node) use (&$walk, $allowedTags, $allowedAttrs, $dropTags): void {
            if (! $node instanceof \DOMElement) {
                foreach (iterator_to_array($node->childNodes) as $child) {
                    $walk($child);
                }
                return;
            }

            $tag = strtolower($node->tagName);

            if (in_array($tag, $dropTags, true)) {
                $node->parentNode?->removeChild($node);
                return;
            }

            if (! in_array($tag, $allowedTags, true)) {
                $parent = $node->parentNode;
                $children = iterator_to_array($node->childNodes);
                foreach ($children as $child) {
                    $parent->insertBefore($child, $node);
                }
                $parent->removeChild($node);
                foreach ($children as $child) {
                    $walk($child);
                }
                return;
            }

            $allowed = $allowedAttrs[$tag] ?? [];
            foreach (iterator_to_array($node->attributes) as $attr) {
                $name = strtolower($attr->name);

                if (str_starts_with($name, 'on') || ! in_array($name, $allowed, true)) {
                    $node->removeAttribute($attr->name);
                    continue;
                }

                if (in_array($name, ['href', 'src'], true)) {
                    $value = preg_replace('/[\x00-\x20\x7f]+/', '', strtolower(html_entity_decode($attr->value)));
                    if (preg_match('/^(javascript|vbscript|data):/', $value) && ! str_starts_with($value, 'data:image/')) {
                        $node->removeAttribute($attr->name);
                    }
                }
            }

            if ($tag === 'a' && $node->hasAttribute('href')) {
                $node->setAttribute('rel', 'noopener noreferrer nofollow');
            }

            foreach (iterator_to_array($node->childNodes) as $child) {
                $walk($child);
            }
        };

        $walk($root);

        $out = '';
        foreach ($root->childNodes as $child) {
            $out .= $doc->saveHTML($child);
        }

        return $out;
    }
}

if (! function_exists('is_bot_request')) {
    function is_bot_request(): bool
    {
        $ua = mb_strtolower((string) request()->header('User-Agent', ''));

        if ($ua === '') {
            return false;
        }

        $crawlers = [
            'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
            'yandexbot', 'sogou', 'exabot', 'facebookexternalhit', 'facebot',
            'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot', 'discordbot',
            'pinterest', 'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
            'petalbot', 'applebot', 'gptbot', 'ccbot', 'perplexitybot', 'bytespider',
        ];

        foreach ($crawlers as $crawler) {
            if (str_contains($ua, $crawler)) {
                return true;
            }
        }

        return false;
    }
}
