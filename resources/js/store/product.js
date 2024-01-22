import { defineStore } from 'pinia'
import axios from "axios";

export const useProductStore = defineStore({
    id: 'product',
    state: () => ({
        products: [],
        filters: {
            search: "",
            category_id: 0
        }
    }),
    getters: {
        productList(state) {
            return state.products;
        },
        productCount(state) {
            return state.products.length;
        }
    },
    actions: {
        async getProducts() {
            const params = {
                search: this.$state.filters.search,
                category_id: this.$state.filters.category_id,
            };

            await axios.get("/api/auth/products", { params })
                .then((response) => {
                    this.$state.products = response.data.data;
                }).catch(error => {
                    if (error.response.status === 404) {
                        alert(error.response.data.message);
                        this.$state.products = [];
                        return false;
                    }

                    alert("There is an error while fetching products.");
                    this.$state.products = [];
                });
        },
        async removeProduct(id) {
            await axios.delete("/api/auth/products/" + id)
                .then((response) => {
                    this.getProducts();
                    alert('Product deleted successfully.');
                }).catch(error => {
                    alert('There is an error while deleting product.');
                    this.$state.products = [];
            });
        },
    },
    persist: true
});
