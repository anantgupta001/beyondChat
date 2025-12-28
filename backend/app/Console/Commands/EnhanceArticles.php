<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Article;
use App\Services\SearchService;
use App\Services\ScraperService;
use App\Services\LLMService;

class EnhanceArticles extends Command
{
    protected $signature = 'articles:enhance';
    protected $description = 'Enhance articles using competitor content';

    public function handle(
        SearchService $search,
        ScraperService $scraper,
        LLMService $llm
    ) {
        $articles = Article::where('phase2_done', false)->get();

        if ($articles->isEmpty()) {
            $this->info('No articles to enhance');
            return;
        }

        foreach ($articles as $article) {
            $this->info("Processing: {$article->title}");

            $links = $search->search($article->title);
            if (empty($links)) {
                $this->warn('No competitors found, skipping');
                continue;
            }

            $contents = [];
            foreach ($links as $link) {
                $text = $scraper->scrape($link);
                if ($text) $contents[] = $text;
            }

            if (empty($contents)) {
                $this->warn('No competitor content scraped');
                continue;
            }

            $article->enhanced_content = $llm->enhance(
                $article->content,
                $contents
            );

            $article->phase2_done = true;
            $article->save();

            $this->info('Enhanced successfully ✅');
        }

        $this->info('🚀 Phase-2 completed');
    }
}
