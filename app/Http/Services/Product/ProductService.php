<?php

namespace App\Http\Services\Product;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;

class ProductService
{
    /**
     * @param array $params
     * @return mixed
     */
    public function getProduct(array $params)
    {
        $perPage = Arr::get($params, 'per_page', 10); // Adjust the number of items per page

        $query = Product::orderBy('created_at', 'desc');

        if (Arr::exists($params, 'search') && !empty(Arr::get($params, 'search'))) {
            $searchTerm = Arr::get($params, 'search');
            $query->where(function (Builder $query) use ($searchTerm) {
                $query->where('name', 'like', "%$searchTerm%")
                    ->orWhere('description', 'like', "%$searchTerm%");
            });
        }

        if (Arr::exists($params, 'category_id') && (int)Arr::get($params, 'category_id') !== 0) {
            $categoryId = Arr::get($params, 'category_id');
            $query->where('category_id', '=', $categoryId);
        }

        $products = $query->with('category')->paginate($perPage);

        if ($products->isEmpty()) {
            throw new ModelNotFoundException('No product data found.');
        }

        return $products;
    }

    /**
     * createProduct
     * @param array $params
     * @return mixed
     */
    public function createProduct(array $params): mixed
    {
        // Add insert of product images
        // Add uploading of product images(multiple)
        // Separate the process in ImageService
        return Product::create($params);
    }

    /**
     * getProductById
     * @param int $id
     * @return mixed
     */
    public function getProductById(int $id)
    {
        try {
            return Product::findOrFail($id);
        } catch (ModelNotFoundException) {
            throw new ModelNotFoundException('Product not found.');
        }
    }

    /**
     * updateProduct
     * @param array $params
     * @param int $id
     * @return mixed
     */
    public function updateProduct(array $params, int $id)
    {
        // Add update of product images
        // Add uploading of product images(multiple)
        // Separate the process in ImageService
        return tap(Product::whereId($id))->update($params)->first();
    }

    /**
     * deleteProduct
     * @param int $id
     * @return array
     */
    public function deleteProduct(int $id): array
    {
        try {
            $product = Product::findOrFail($id);

            $product->delete();

            return ['message' => 'Product deleted successfully.', 'code' => Response::HTTP_OK];
        } catch (ModelNotFoundException) {
            return ['message' => 'Product not found.', 'code' => Response::HTTP_NOT_FOUND];
        }
    }
}
