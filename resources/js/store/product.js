import { defineStore } from 'pinia'
import axios from "axios";

export const useProductStore = defineStore({
    id: 'product',
    state: () => ({
        products: []
    }),
    getters: {
        productLists(state) {
            return state.products;
        }
    },
    actions: {
        async getProducts() {
            await axios.get("/api/auth/products")
                .then((response) => {
                    this.$state.products = response.data.data;
                }).catch(error => {
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
