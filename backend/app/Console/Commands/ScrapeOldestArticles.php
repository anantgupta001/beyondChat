<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;

class ScrapeOldestArticles extends Command
{
    protected $signature = 'articles:scrape';
    protected $description = 'Scrape OLDEST 5 articles from BeyondChats blog';

    public function handle()
    {
        $this->info('Fetching blog homepage...');

        $response = Http::get('https://beyondchats.com/blogs');

        if (!$response->ok()) {
            $this->error('Failed to fetch blog homepage');
            return;
        }

        $crawler = new Crawler($response->body());

        // ✅ 1️⃣ Find last page number from pagination
        $lastPage = 1;

        $crawler->filter('a.page-numbers')->each(function (Crawler $node) use (&$lastPage) {
            $text = trim($node->text());
            if (is_numeric($text)) {
                $lastPage = max($lastPage, (int)$text);
            }
        });

        $this->info("Last page detected: {$lastPage}");

        $savedCount = 0;
        $page = $lastPage;

        // ✅ 2️⃣ Loop backwards until we get 5 articles
        while ($page >= 1 && $savedCount < 5) {

            $url = $page === 1
                ? 'https://beyondchats.com/blogs'
                : "https://beyondchats.com/blogs/page/{$page}";

            $this->info("Scanning page: {$url}");

            $pageRes = Http::get($url);
            if (!$pageRes->ok()) {
                $page--;
                continue;
            }

            $pageCrawler = new Crawler($pageRes->body());

            $pageCrawler->filter('article.entry-card')->each(function (Crawler $node) use (&$savedCount) {

                if ($savedCount >= 5) return;

                $linkNode = $node->filter('h2.entry-title a');
                if ($linkNode->count() === 0) return;

                $title = trim($linkNode->text());
                $articleUrl = trim($linkNode->attr('href'));

                if (Article::where('source_url', $articleUrl)->exists()) {
                    return;
                }

                $this->info("Scraping: {$title}");

                $articleRes = Http::get($articleUrl);
                if (!$articleRes->ok()) return;

                $articleCrawler = new Crawler($articleRes->body());
                if ($articleCrawler->filter('article')->count() === 0) return;

                $content = trim(
                    $articleCrawler->filter('article')->text('', true)
                );

                Article::create([
                    'title' => $title,
                    'content' => $content,
                    'source_url' => $articleUrl,
                    'source' => 'beyondchats',
                ]);

                $savedCount++;
                $this->info('Saved ✅');
            });

            $page--;
        }

        $this->info("🎉 Phase-1 completed: TRUE OLDEST 5 articles scraped");
    }
}
