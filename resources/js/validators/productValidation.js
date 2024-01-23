export function validateProduct(formData) {
    const errors = {};

    if (!formData.name) {
        errors.name = 'Name is required';
    } else if (formData.name.length > 50) {
        errors.name = 'Name cannot be longer than 50 characters';
    }

    if (formData.category_id === 0) {
        errors.category_id = 'Category is required';
    }

    if (!formData.description) {
        errors.description = 'Description is required';
    }

    return errors;
}
