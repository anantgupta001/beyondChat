<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Article;

class EnhanceArticles extends Command
{
    protected $signature = 'articles:enhance';
    protected $description = 'Enhance articles using competitor content and AI';

    public function handle()
    {
        $articles = Article::where('phase2_done', false)->get();

        if ($articles->isEmpty()) {
            $this->info('No articles to enhance');
            return;
        }

        foreach ($articles as $article) {
            $this->info("Processing: {$article->title}");

            // Phase 2 logic yaha aayega
            // (Search → Scrape → AI → Save)

            // Temporary placeholder
            $article->enhanced_content = $article->content;
            $article->phase2_done = true;
            $article->save();

            $this->info("Enhanced successfully ✅");
        }

        $this->info("🚀 Phase-2 basic flow completed");
    }
}
