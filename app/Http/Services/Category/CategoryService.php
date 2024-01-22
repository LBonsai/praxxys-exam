<?php

namespace App\Http\Services\Category;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryService
{
    /**
     * getCategories
     * @return Collection
     */
    public function getCategories(): Collection
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            throw new ModelNotFoundException('No category data found.');
        }

        return $categories;
    }
}
