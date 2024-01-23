import { defineStore } from "pinia";
import axios from "axios";
import router from "../router/router.js";
import { useStorage } from "@vueuse/core";

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        id: null,
        name: "",
        email: "",
        loading: false,
        username: "",
        user: useStorage("user", {
            id: "",
            username: "",
        })
    }),
    getters: {
        currentUserUsername() {
            return this.user.username.charAt(0).toUpperCase() + this.user.username.slice(1);
        },
        currentUserId() {
            return this.user.id;
        }
    },
    actions: {
        async loginAdmin(formdata) {
            await axios.get("/sanctum/csrf-cookie");

            await axios.post("/api/auth/login", formdata)
                .then((response) => {
                    this.setUserDetails(response);
                    router.push({ name: "products.list" })
                }).catch(error => {
                    alert("There is an error while logging in.");
                }).finally(() => {
                    this.loading = false;
                })
        },
        async logoutAdmin() {
            await axios.delete("/api/auth/logout")
                .then(() => {
                    this.clearUser();
                    router.push({ name: "app.login" });
                }).catch(error => {
                    alert("There is an error while logging out.");
                })
        },
        setUserDetails(response) {
            this.user.id = response.data.data.id;
            this.user.username = response.data.data.username;
        },
        setLoadingValue(value) {
            this.loading = value;
        },
        clearUser() {
            this.user.id = "";
            this.user.username = "";
        }
    },
    persist: true
});
