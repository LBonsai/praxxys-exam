import { defineStore } from "pinia";
import axios from "axios";
import _ from 'lodash';

export const useCategoryStore = defineStore({
    id: 'category',
    state: () => ({
        categories: []
    }),
    getters: {
        categoryList(state) {
            return _.sortBy(state.categories, 'name');
        }
    },
    actions: {
        async getCategories() {
            await axios.get("/api/auth/categories")
                .then((response) => {
                    this.$state.categories = response.data.data;
                }).catch(error => {
                    if (error.response.status === 404) {
                        alert(error.response.data.message);
                        return false;
                    }

                    alert("There is an error while fetching categories.");
                    this.$state.categories = [];
                });
        }
    },
    persist: true
});
