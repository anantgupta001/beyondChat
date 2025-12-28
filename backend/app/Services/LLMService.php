<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class LLMService
{
    public function enhance(string $original, array $references): string
    {
        $prompt = "Rewrite this article to be more SEO optimized.\n\n"
            . "Original:\n$original\n\n"
            . "Competitors:\n" . implode("\n\n", $references);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.1-8b-instant',
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.4,
        ]);

        return $response->json('choices.0.message.content') ?? $original;
    }
}
