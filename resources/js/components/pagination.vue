<template>
    <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
        <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
                <button @click.prevent="changePage('prev')" :disabled="productStore.currentPage === 1" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
            </li>
            <li v-for="pageNumber in productStore.totalPages" :key="pageNumber">
                <button :disabled="productStore.currentPage === pageNumber" @click.prevent="changePage(pageNumber)" :class="{ 'text-blue-900 dark:border-gray-800 dark:bg-blue-900 dark:text-white': productStore.currentPage === pageNumber }" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{{ pageNumber }}</button>
            </li>
            <li>
                <button @click.prevent="changePage('next')" :disabled="productStore.currentPage === productStore.totalPages" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
    import { useProductStore } from "../store/product";

    const productStore = useProductStore();

    const changePage = (page) => {
      if (page === 'prev' && productStore.currentPage > 1) {
        productStore.$state.current_page--;
      } else if (page === 'next' && productStore.currentPage < productStore.totalPages) {
        productStore.$state.current_page++;
      } else if (typeof page === 'number') {
        productStore.$state.current_page = page;
      }

      productStore.getProducts();
    }
</script>
