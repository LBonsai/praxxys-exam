<template>
  <Header/>
  <aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li>
          <button @click.prevent="createProduct" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Create Products</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
  <div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            </div>
            <input
                v-model.trim="searchFilter"
                type="text"
                id="table-search"
                class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by Name or Description"
            />
            <button
                @click.prevent="searchProduct(true)"
                type="button"
                class="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-500 text-white rounded-r-lg"
            >
                Search
            </button>
          </div>
          <div>
            <select @change="searchProduct(false)" id="categories" v-model="productStore.filters.category_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="0" selected disabled>Select a category</option>
              <option v-for="category in categoryStore.categoryList" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
          <tr>
            <th scope="col" class="px-6 py-3">
              Name
            </th>
            <th scope="col" class="px-6 py-3">
              Category
            </th>
            <th scope="col" class="px-6 py-3">
              Description
            </th>
            <th scope="col" class="px-6 py-3">
              Actions
            </th>
          </tr>
          </thead>
          <tbody>
              <tr v-if="productStore.productList.length === 0">
                  <td colspan="4" class="text-center py-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    No data available
                  </td>
              </tr>
              <tr v-else v-for="product in productStore.productList" :key="product.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td class="px-6 py-4">{{ product.name }}</td>
                  <td class="px-6 py-4">{{ product.category.name }}</td>
                  <td class="px-6 py-4">{{ product.description }}</td>
                  <td class="px-6 py-4">
                      <button
                          @click.prevent="editProduct(product.id)"
                          class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                      >
                          Edit
                      </button>
                      <button
                          @click.prevent="deleteProduct(product.id)"
                          class="font-medium text-blue-600 dark:text-red-500 hover:underline"
                      >
                          Delete
                      </button>
                  </td>
              </tr>
          </tbody>
        </table>
        <div class="absolute bottom-2 right-2 text-dark-900 dark:text-gray-900">
          Total Products: {{ productStore.productCount }}
        </div>
        <Pagination/>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import { useProductStore } from "../Store/product";
    import { useCategoryStore } from "../Store/category";
    import Pagination from "../components/pagination.vue";
    import Header from "../components/header.vue";
    import _ from 'lodash';
    import router from "../router/router.js";

    const searchFilter = ref('')

    const productStore = useProductStore();
    const categoryStore = useCategoryStore();

    const searchProduct = _.debounce((isClicked) => {
      if (isClicked) {
        productStore.filters.search = searchFilter.value;
      }

      productStore.getProducts();
    }, 300);

    const deleteProduct = async (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await productStore.removeProduct(id);
        }

        return false;
    }

    const editProduct = (id) => {
        router.push({ name: 'products.edit', params: { id } });
    }

    const createProduct = () => {
        router.push({ name: "products.create" });
    }

    onMounted( () => {
        productStore.getProducts();
        productStore.clearProductState();
        categoryStore.getCategories();
    });
</script>
