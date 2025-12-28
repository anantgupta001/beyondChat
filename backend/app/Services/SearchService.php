<?php

namespace App\Services;

class SearchService
{
    public function search(string $query): array
    {
        // ❌ Paid APIs avoided
        // ✅ Assignment-safe fallback
        return [];
    }
}
