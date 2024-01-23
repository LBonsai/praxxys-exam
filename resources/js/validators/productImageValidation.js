export function validateProductImages(files) {
    const allowedExtensions = ['png', 'jpg', 'jpeg'];

    const imagesError = Array.from(files).some((file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        return !allowedExtensions.includes(extension);
    })
        ? 'Only PNG, JPG, or GIF files are allowed.'
        : '';

    return { images: imagesError };
}
