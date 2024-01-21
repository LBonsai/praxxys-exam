<template>
    <h1 class="text-center mt-28 mb-4 font-extrabold leading-none tracking-tight text-gray-700 lg:text-6xl">Login Page</h1>
    <form class="max-w-sm mx-auto mt-10" method="POST">
        <div class="mb-5">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Email or username</label>
            <input
                v-model="formData.username_or_email"
                name="email"
                type="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your email or username"
            />
        </div>
        <div class="mb-5">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
                v-model="formData.password"
                type="password"
                id="password"
                class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your password"
            />
        </div>
        <div class="flex items-start mb-5">
            <div class="flex items-center h-5">
                <input
                    v-model="formData.remember_me"
                    id="remember_me"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
            <label for="remember_me" class="ms-2 text-sm font-medium text-gray-700">Remember me</label>
        </div>
        <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600"
            :disabled="state.loading"
            @click.prevent="login"
        >Submit</button>
    </form>
</template>

<script setup>
    import { reactive } from 'vue';
    import axios from "axios";
    import router from "../router/index.js"
    import { useUserStore } from '../store/user.js'

    const state = reactive ({
        loading: false
    });

    const storedValue = sessionStorage.getItem('username_or_email');

    const userStore = useUserStore()

    const formData = reactive({
        username_or_email: sessionStorage.getItem('username_or_email') || "",
        password: "",
        remember_me: storedValue !== undefined && storedValue !== null
    });

    const login = async () => {
        state.errors = [];
        state.loading = true;

        rememberUsernameOrEmail();

        await axios.get('/sanctum/csrf-cookie')

        axios.post("/api/auth/login", {
            username_or_email: formData.username_or_email,
            password: formData.password,
            remember_me: formData.remember_me
        }).then((response) => {
            userStore.setUserDetails(response)

            router.push({ name: 'app.dashboard' })
        }).catch(error => {
            state.loading = false;
        })
    }

    function rememberUsernameOrEmail() {
        if (formData.remember_me === true) {
            sessionStorage.setItem('username_or_email', formData.username_or_email);
        } else {
            sessionStorage.removeItem('username_or_email');
        }
    }
</script>
