import { defineStore } from 'pinia'
import axios from "axios";
import router from "../router/router.js";

export const useProductStore = defineStore({
    id: 'product',
    state: () => ({
        count: 0,
        products: [],
        filters: {
            search: "",
            category_id: 0
        },
        current_page: 1,
        per_page: 10,
        total_pages: 0,
        product: {
            name: '',
            category_id: 0,
            description: '',
            images: ''
        }
    }),
    getters: {
        productList(state) {
            return state.products;
        },
        productCount(state) {
            return state.count;
        },
        currentPage(state) {
            return state.current_page;
        },
        totalPages(state) {
            return state.total_pages;
        }
    },
    actions: {
        async getProducts() {
            const params = {
                search: this.$state.filters.search,
                category_id: this.$state.filters.category_id,
                page: this.$state.current_page,
                per_page: this.$state.per_page,
            };

            await axios.get("/api/auth/products", { params })
                .then((response) => {
                    this.$state.products = response.data.data;
                    this.$state.count = response.data.meta.total;
                    this.setTotalPagesValue(response.data.meta.last_page);
                }).catch(error => {
                    if (error.response.status === 404) {
                        alert(error.response.data.message);
                        this.$state.products = [];
                        this.$state.count = 0;
                        this.setTotalPagesValue(1);
                        return false;
                    }

                    alert("There is an error while fetching products.");
                    this.$state.products = [];
                    this.$state.count = 0;
                    this.setTotalPagesValue(1);
                });
        },
        async getProductById(id) {
            await axios.get("/api/auth/products/" + id)
                .then((response) => {
                    this.$state.product.name = response.data.data.name;
                    this.$state.product.category_id = response.data.data.category_id;
                    this.$state.product.description = response.data.data.description;
                }).catch(error => {
                    alert(error.response.data.message);
                    // router.push({ name: "products.list" });
                });
        },
        async createProduct(formData) {
            await axios.post("/api/auth/products", formData)
                .then((response) => {
                    alert("The product created successfully.");
                    router.push({ name: "products.list" })
                }).catch(error => {
                    alert("There is an error while creating products.");
                });
        },
        async updateProduct(formData, id) {
            await axios.post("/api/auth/products/" + id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((response) => {
                alert("The product updated successfully.");
                router.push({ name: "products.list" })
            }).catch(error => {
                alert("There is an error while updating products.");
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
        setTotalPagesValue(value) {
            this.$state.total_pages = value;
        },
        clearProductState() {
            this.$state.product.name = '';
            this.$state.product.category_id = 0;
            this.$state.product.description = '';
        }
    },
    persist: true
});
