<?php

namespace App\Http\Requests;

use App\Rules\ExistingCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        // add product image
        $productId = $this->route('product');

        return [
            'name' => 'required|string|unique:products,name,' . $productId,
            'category_id' => ['required', 'integer', new ExistingCategory],
            'description' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif'
        ];
    }
}
