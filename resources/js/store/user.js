import { defineStore } from 'pinia'
import { useStorage } from "@vueuse/core";

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        user: useStorage('user', {
            name: null,
            email: null,
            username: null,
        })
    }),
    actions: {
        setUserDetails(response) {
            this.user.id = response.data.data.id
            this.user.name = response.data.data.name
            this.user.email = response.data.data.email
            this.user.username = response.data.data.username;
        },

        clearUser() {
            this.user.id = null
            this.user.name = null
            this.user.email = null
            this.user.username = null;
        }
    },
    persist: true
});
