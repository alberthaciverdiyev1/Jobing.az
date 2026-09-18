<?php

namespace App\Modules\Seo\Services;

use App\Modules\Blog\Models\Blog;
use App\Modules\Company\Models\Company;
use App\Modules\JobSeeker\Models\JobSeeker;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Support\Facades\File;

class SitemapService
{
    public const CHUNK_SIZE = 10000;

    public function generate(): array
    {
        $baseUrl = rtrim(config('app.url'), '/');
        $urls = [];

        // 1. Statik səhifələr
        $staticRoutes = [
            [url('/'), 'daily', '1.0'],
            [route('companies.index'), 'daily', '0.8'],
            [route('job-seekers.index'), 'daily', '0.8'],
            [route('resumes.index'), 'daily', '0.8'],
            [route('blog.index'), 'weekly', '0.6'],
            [route('about'), 'monthly', '0.4'],
            [route('faq.index'), 'monthly', '0.4'],
            [route('contact.index'), 'monthly', '0.3'],
        ];

        foreach ($staticRoutes as [$loc, $freq, $priority]) {
            $urls[] = [
                'loc' => $loc,
                'lastmod' => now()->toIso8601String(),
                'changefreq' => $freq,
                'priority' => $priority,
            ];
        }

        // 2. Aktiv vakansiyalar
        Vacancy::active()->orderByDesc('id')->chunk(500, function ($items) use (&$urls) {
            foreach ($items as $v) {
                $urls[] = [
                    'loc' => route('jobs.show', $v->slug),
                    'lastmod' => ($v->updated_at ?? $v->created_at ?? now())->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority' => '0.9',
                ];
            }
        });

        // 3. Şirkət profilləri
        Company::publicProfile()->orderByDesc('id')->chunk(500, function ($items) use (&$urls) {
            foreach ($items as $c) {
                $urls[] = [
                    'loc' => route('companies.show', $c->slug),
                    'lastmod' => ($c->updated_at ?? $c->created_at ?? now())->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority' => '0.6',
                ];
            }
        });

        // 4. Blog yazıları
        Blog::published()->orderByDesc('id')->chunk(500, function ($items) use (&$urls) {
            foreach ($items as $b) {
                $urls[] = [
                    'loc' => route('blog.show', $b->slug),
                    'lastmod' => ($b->updated_at ?? $b->published_at ?? now())->toIso8601String(),
                    'changefreq' => 'monthly',
                    'priority' => '0.5',
                ];
            }
        });

        // 5. İş arayan elanları
        JobSeeker::query()->whereNotNull('slug')->orderByDesc('id')->chunk(500, function ($items) use (&$urls) {
            foreach ($items as $s) {
                $urls[] = [
                    'loc' => route('job-seekers.show', $s->slug),
                    'lastmod' => ($s->updated_at ?? $s->created_at ?? now())->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            }
        });

        $totalUrls = count($urls);
        $generatedFiles = [];
        $publicPath = public_path();

        foreach (File::glob($publicPath . '/sitemap*.xml') as $oldFile) {
            @unlink($oldFile);
        }

        if ($totalUrls <= self::CHUNK_SIZE) {
            $this->writeSitemapFile($publicPath . '/sitemap.xml', $urls);
            $generatedFiles[] = [
                'name' => 'sitemap.xml',
                'url' => $baseUrl . '/sitemap.xml',
                'count' => $totalUrls,
            ];
        } else {
            $chunks = array_chunk($urls, self::CHUNK_SIZE);
            $sitemaps = [];

            foreach ($chunks as $index => $chunkUrls) {
                $fileName = 'sitemap_' . ($index + 1) . '.xml';
                $this->writeSitemapFile($publicPath . '/' . $fileName, $chunkUrls);
                $sitemaps[] = ['loc' => $baseUrl . '/' . $fileName, 'lastmod' => now()->toIso8601String()];
                $generatedFiles[] = ['name' => $fileName, 'url' => $baseUrl . '/' . $fileName, 'count' => count($chunkUrls)];
            }

            $this->writeSitemapIndexFile($publicPath . '/sitemap.xml', $sitemaps);
            array_unshift($generatedFiles, [
                'name' => 'sitemap.xml (İndeks)',
                'url' => $baseUrl . '/sitemap.xml',
                'count' => $totalUrls,
            ]);
        }

        return $generatedFiles;
    }

    private function writeSitemapFile(string $path, array $urls): void
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        foreach ($urls as $url) {
            $xml .= '    <url>' . PHP_EOL;
            $xml .= '        <loc>' . htmlspecialchars($url['loc'], ENT_XML1) . '</loc>' . PHP_EOL;
            $xml .= '        <lastmod>' . htmlspecialchars($url['lastmod'], ENT_XML1) . '</lastmod>' . PHP_EOL;
            $xml .= '        <changefreq>' . $url['changefreq'] . '</changefreq>' . PHP_EOL;
            $xml .= '        <priority>' . $url['priority'] . '</priority>' . PHP_EOL;
            $xml .= '    </url>' . PHP_EOL;
        }

        $xml .= '</urlset>';

        File::put($path, $xml);
    }

    private function writeSitemapIndexFile(string $path, array $sitemaps): void
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        foreach ($sitemaps as $sitemap) {
            $xml .= '    <sitemap>' . PHP_EOL;
            $xml .= '        <loc>' . htmlspecialchars($sitemap['loc'], ENT_XML1) . '</loc>' . PHP_EOL;
            $xml .= '        <lastmod>' . htmlspecialchars($sitemap['lastmod'], ENT_XML1) . '</lastmod>' . PHP_EOL;
            $xml .= '    </sitemap>' . PHP_EOL;
        }

        $xml .= '</sitemapindex>';

        File::put($path, $xml);
    }
}
