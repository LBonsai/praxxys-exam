<?php

namespace App\Http\Traits;

trait ImageTrait {
    /**
     * uploadImage
     * @param array $images
     * @return array
     */
    public function uploadImage(array $images): array
    {
        $uploadedImages = [];
        foreach ($images as $image) {
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
