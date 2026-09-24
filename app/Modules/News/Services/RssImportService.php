<?php

namespace App\Modules\News\Services;

use App\Modules\News\Models\News;
use App\Modules\News\Models\RssSource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * RSS/Atom lentlərini oxuyub xəbər yaradır. Xarici paket tələb etmir (SimpleXML).
 */
class RssImportService
{
    public function importAll(): array
    {
        $result = [];

        foreach (RssSource::where('is_active', true)->get() as $source) {
            $result[$source->name] = $this->importSource($source);
        }

        return $result;
    }

    public function importSource(RssSource $source): int
    {
        $xml = $this->fetch($source->url);
        if ($xml === null) {
            return 0;
        }

        $doc = @simplexml_load_string($xml);
        if ($doc === false) {
            return 0;
        }

        $items = $doc->channel->item ?? $doc->entry ?? [];
        $count = 0;

        foreach ($items as $item) {
            $title = trim((string) ($item->title ?? ''));
            $link = trim((string) ($item->link ?? $item->link['href'] ?? ''));
            $description = trim((string) ($item->description ?? $item->summary ?? ''));

            if ($title === '') {
                continue;
            }

            // Atom link obyekti
            if ($link === '' && isset($item->link)) {
                foreach ($item->link as $l) {
                    if ((string) $l['rel'] === 'alternate' || (string) $l['href'] !== '') {
                        $link = (string) $l['href'];
                        break;
                    }
                }
            }

            $pubDate = (string) ($item->pubDate ?? $item->published ?? $item->updated ?? '');
            $publishedAt = $pubDate ? date('Y-m-d H:i:s', strtotime($pubDate) ?: time()) : now()->toDateTimeString();

            $slug = Str::slug($title) ?: 'news-' . Str::random(8);

            News::firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => ['tr' => $title],
                    'category' => (string) ($item->category ?? $source->category ?? ''),
                    'description' => ['tr' => Str::limit(strip_tags($description), 300)],
                    'content' => ['tr' => $description],
                    'source_name' => $source->name,
                    'source_url' => $link ?: null,
                    'is_active' => true,
                    'published_at' => $publishedAt,
                ]
            ) && $count++;
        }

        $source->update(['last_fetched_at' => now()]);

        return $count;
    }

    protected function fetch(string $url): ?string
    {
        try {
            $res = Http::timeout(15)->withHeaders(['User-Agent' => 'KibrisKareBot/1.0'])->get($url);

            return $res->successful() ? $res->body() : null;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
