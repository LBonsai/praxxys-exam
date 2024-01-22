import { createRouter, createWebHistory } from "vue-router";

import Login from "../components/login.vue"
import { useUserStore } from "../Store/user";
import auth from "../layout/auth.vue";
import Dashboard from "../layout/dashboard.vue";

const routes = [
    {
        path: "/",
        redirect: "/auth/login",
    },
    {
        path: "/auth",
        name: "auth",
        component: auth,
        beforeEnter: (to, from, next) => {
            useUserStore().user.id ? next({ name: "app.dashboard" }) : next()
        },
        children: [
            {
                path: 'login',
                component: Login,
                name: 'auth.login'
            }
        ],
    },
    {
        path: "/app",
        beforeEnter: (to, from, next) => {
            useUserStore().user.id ? next() : next({ name: "auth.login" })
        },
        name: "app.dashboard",
        component: Dashboard,
        children: []
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    },
    routes,
});

export default router;
