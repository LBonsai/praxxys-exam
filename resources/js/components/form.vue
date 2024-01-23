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
        <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file" multiple>
        <p class="mt-1 text-sm text-gray-700" id="file_input_help">PNG, JPG or GIF only</p>
    </div>

    <div class="mb-5">
        <div class="relative max-w-sm">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                </svg>
            </div>
          <input id="dateInput" datepicker datepicker-format="mm/dd/yyyy" type="text" @change="changeDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date">
        </div>
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

    const { id } = defineProps(['id']);

    const productStore = useProductStore();
    const categoryStore = useCategoryStore();

    const errors = reactive({
      name: '',
      category_id: '',
      description: '',
    })

    const validateProductFields = () => {
      const validationErrors = validateProduct(productStore.$state.product);

      errors.name = validationErrors.name || '';
      errors.category_id = validationErrors.category_id || '';
      errors.description = validationErrors.description || '';

      if (!errors.name && !errors.category_id && !errors.description) {
          if (id) {
              productStore.updateProduct(id);
          } else {
              productStore.createProduct();
          }
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

    const changeDate = (event) => {
        // state.date = event.target.value;
    };

    onMounted( () => {
        if (id) {
            productStore.getProductById(id);
        }

        categoryStore.getCategories();

        // document.addEventListener('DOMContentLoaded', function () {
        //     let today = new Date();
        //     let dateInput = document.getElementById('dateInput');
        //     dateInput.value = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
        // });
    });
</script>