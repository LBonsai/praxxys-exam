<template>
  <Header/>
  <h1 class="text-center mt-28 mb-4 font-extrabold leading-none tracking-tight text-gray-700 lg:text-6xl">
    {{ id ? 'Update ' : 'Register ' }} Product
  </h1>
  <form class="max-w-sm mx-auto mt-10">
    <div class="mb-5">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-700">Name:</label>
        <input
            v-model="productStore.$state.product.name"
            name="name"
            type="text"
            id="name"
            class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
            placeholder="Enter product name"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-500"><span class="font-medium">{{ errors.name }}</span></p>
    </div>

    <div class="mb-5">
        <label for="category" class="block mb-2 text-sm font-medium text-gray-700">Category:</label>
        <select id="category" v-model="productStore.$state.product.category_id" name="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="0" selected disabled>Select a category</option>
          <option v-for="category in categoryStore.categoryList" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <p v-if="errors.category_id" class="mt-1 text-sm text-red-600 dark:text-red-500"><span class="font-medium">{{ errors.category_id }}</span></p>
    </div>

    <div class="mb-5">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-700">Description:</label>
        <textarea
            v-model="productStore.$state.product.description"
            id="description"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
        />
        <p v-if="errors.description" class="mt-1 text-sm text-red-600 dark:text-red-500"><span class="font-medium">{{ errors.description }}</span></p>
    </div>

    <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-700" for="default_size">Image</label>
        <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="default_size"
            type="file"
            multiple
            @change="handleFileChange"
        />
        <p class="mt-1 text-sm text-gray-700" id="file_input_help">PNG, JPG, JPEG or GIF only</p>
        <p v-if="errors.images" class="mt-1 text-sm text-red-600 dark:text-red-500">
          <span class="font-medium">{{ errors.images }}</span>
        </p>
    </div>

    <button
        type="submit"
        class="mr-2 text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600"
        @click.prevent="validateProductFields"
    >
      Save
    </button>

    <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600"
        @click.prevent="cancel"
    >
      Cancel
    </button>
  </form>
</template>

<script setup>
    import { reactive, onMounted, defineProps } from "vue";
    import { useCategoryStore } from "../store/category.js";
    import Header from "../components/header.vue";
    import router from "../router/router.js";
    import { validateProduct } from "../validators/productValidation.js";
    import { useProductStore } from "../store/product.js";
    import { validateProductImages } from "../validators/productImageValidation.js";

    const { id } = defineProps(['id']);

    const productStore = useProductStore();
    const categoryStore = useCategoryStore();

    const errors = reactive({
        name: '',
        category_id: '',
        description: '',
        images: ''
    });

    const handleFileChange = (event) => {
      productStore.$state.product.images = event.target.files;
    };

    const validateProductFields = () => {
      const productErrors = validateProduct(productStore.$state.product);
      const productImageError = validateProductImages(productStore.$state.product.images);

      resetErrors();

      if (productErrors.name || productErrors.category_id || productErrors.description) {
          errors.name = productErrors.name;
          errors.category_id = productErrors.category_id;
          errors.description = productErrors.description;
          return false;
      }

      if (productImageError.images) {
          errors.images = productImageError.images;
          return false;
      }

      if (id) {
          productStore.updateProduct(
              appendData(), id
          );
      } else {
          productStore.createProduct(appendData());
      }
    }

    const cancel = () => {
      const action = id ? 'update' : 'register';
      const confirmationMessage = `Are you sure you want to cancel ${action}?`;

      if (confirm(confirmationMessage)) {
          productStore.clearProductState();
          router.push({ name: "products.list" });
      }
    };

    const appendData = () => {
        let formData = new FormData();

        for (let i = 0; i < productStore.$state.product.images.length; i++) {
            formData.append('images[]', productStore.$state.product.images[i]);
        }

        formData.append('name', productStore.$state.product.name);
        formData.append('category_id', productStore.$state.product.category_id);
        formData.append('description', productStore.$state.product.description);

        if (id) {
            formData.append('_method', 'put');
        }

        return formData;
    }

    const resetErrors = () => {
        errors.name = '';
        errors.category_id = '';
        errors.description = '';
        errors.images = '';
    }

    onMounted( () => {
        if (id) {
            productStore.getProductById(id);
        }

        categoryStore.getCategories();
    });
</script>
