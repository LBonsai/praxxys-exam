<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductFormRequest;
use App\Http\Resources\ProductResource;
use App\Http\Services\Product\ProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    private ProductService $productService;

    /**
     * ProductController constructor
     * @param ProductService $productService
     */
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * index
     * @param Request $request
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function index(Request $request): JsonResponse|AnonymousResourceCollection
    {
        try {
            $response = $this->productService->getProduct($request->all());
            return ProductResource::collection($response);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * store
     * @param ProductFormRequest $request
     * @return ProductResource
     */
    public function store(ProductFormRequest $request): ProductResource
    {
        $response = $this->productService->createProduct($request->validated());
        return new ProductResource($response);
    }

    /**
     * show
     * @param int $id
     * @return ProductResource|JsonResponse
     */
    public function show(int $id): JsonResponse|ProductResource
    {
        try {
            $result = $this->productService->getProductById($id);
            return new ProductResource($result);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * update
     * @param ProductFormRequest $request
     * @param int $id
     * @return ProductResource
     */
    public function update(ProductFormRequest $request, int $id): ProductResource
    {
        $response = $this->productService->updateProduct($request->validated(), $id);
        return new ProductResource($response);
    }

    /**
     * destroy
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $result = $this->productService->deleteProduct($id);
        return response()->json(['message' => $result['message']], $result['code']);
    }
}
