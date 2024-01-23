<?php

namespace App\Http\Traits;

trait ImageTrait {
    /**
     * @param $params
     * @return array
     */
    public function uploadImage($params): array
    {
        $uploadedImages = [];
        foreach ($params['images'] as $image) {
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads'), $imageName);
            $uploadedImages[] = [
                'name' => $imageName,
                'path' => 'uploads/' . $imageName,
            ];
        }

        return $uploadedImages;
    }
}
