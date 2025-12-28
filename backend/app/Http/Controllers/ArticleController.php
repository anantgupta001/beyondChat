<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // POST /api/articles
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'source'  => 'nullable|string',
        ]);

        $article = Article::create([
            'title'   => $data['title'],
            'content' => $data['content'],
            'source'  => $data['source'] ?? 'original',
        ]);

        return response()->json($article, 201);
    }

    // GET /api/articles
    public function index()
    {
        return Article::latest()->get();
    }

    // GET /api/articles/{id}
    public function show($id)
    {
        return Article::findOrFail($id);
    }
}
