<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * GET /api/articles
     * Used by React frontend
     */
    public function index()
    {
        return response()->json(Article::all());
    }

    /**
     * PUT /api/articles/{id}
     * Used in Phase-2 to save enhanced content
     */
    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $article->update([
            'enhanced_content' => $request->enhanced_content,
            'phase2_done' => true,
        ]);

        return response()->json($article);
    }

    /**
     * POST /api/admin/reset-articles
     * Deletes all articles & fetches oldest 5 from BeyondChats
     */
    public function resetOldest()
    {
        try {
            // 🔥 Step 1: Delete existing articles
            Article::query()->delete();

            // 🔥 Step 2: Fetch blogs page
            $response = Http::timeout(20)->get("https://beyondchats.com/blogs/");

            if (!$response->ok()) {
                return response()->json([
                    "success" => false,
                    "message" => "Failed to fetch blogs page"
                ], 500);
            }

            $html = $response->body();

            // 🔥 Step 3: Extract blog URLs
            preg_match_all(
                '/<a href="(https:\/\/beyondchats\.com\/blogs\/[^"]+)"/',
                $html,
                $matches
            );

            if (!isset($matches[1]) || count($matches[1]) === 0) {
                return response()->json([
                    "success" => false,
                    "message" => "No blog URLs found"
                ], 500);
            }

            // Oldest 5 articles
            $urls = array_slice(array_unique($matches[1]), -5);

            // 🔥 Step 4: Fetch each article
            foreach ($urls as $url) {
                try {
                    $page = Http::timeout(20)->get($url);
                    if (!$page->ok()) continue;

                    $pageHtml = $page->body();

                    preg_match('/<h1[^>]*>(.*?)<\/h1>/', $pageHtml, $titleMatch);
                    preg_match('/<article[^>]*>(.*?)<\/article>/s', $pageHtml, $contentMatch);

                    Article::create([
                        'title' => strip_tags($titleMatch[1] ?? 'Untitled'),
                        'content' => strip_tags($contentMatch[1] ?? ''),
                        'source_url' => $url, // 🔥 IMPORTANT FIX
                        'phase2_done' => false,
                    ]);
                } catch (\Exception $e) {
                    // Skip individual article failure
                    continue;
                }
            }

            return response()->json([
                "success" => true,
                "message" => "Oldest 5 articles reset successfully"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function enhanceOne($id)
    {
        $article = Article::findOrFail($id);

        // Skip if already enhanced
        if ($article->phase2_done) {
            return response()->json([
                "success" => false,
                "message" => "Article already enhanced"
            ], 400);
        }

        // Dummy placeholder (LLM handled in Node Phase-2 script)
        // Here we just mark it ready to be enhanced
        $article->update([
            'phase2_done' => false
        ]);

        return response()->json([
            "success" => true,
            "message" => "Article queued for enhancement"
        ]);
    }

    public function enhanceAll()
    {
        Article::where('phase2_done', false)->update([
            'phase2_done' => false
        ]);

        return response()->json([
            "success" => true,
            "message" => "All articles queued for enhancement"
        ]);
    }
}
