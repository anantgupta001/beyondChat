<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;

class ScraperService
{
    public function scrape(string $url): ?string
    {
        try {
            $html = Http::timeout(8)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0'])
                ->get($url)
                ->body();

            $crawler = new Crawler($html);
            return trim($crawler->filter('p')->each(fn ($p) => $p->text())[0] ?? null);
        } catch (\Exception $e) {
            return null;
        }
    }
}
