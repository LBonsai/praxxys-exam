import { createRouter, createWebHistory } from "vue-router";

import Login from "../components/login.vue"
import { useUserStore } from "../Store/user";
import auth from "../layout/auth.vue";
import app from "../layout/app.vue";
import Dashboard from "../layout/dashboard.vue";
import Form from "../components/form.vue";

const routes = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "login",
        component: auth,
        beforeEnter: (to, from, next) => {
            useUserStore().user.id ? next({ name: "products.list" }) : next()
        },
        children: [
            {
                path: '/login',
                name: 'app.login',
                component: Login,
            }
        ],
    },
    {
        path: "/products",
        name: "products",
        component: app,
        beforeEnter: (to, from, next) => {
            useUserStore().user.id ? next() : next({ name: "app.login" })
        },
        children: [
            {
                path: '/products',
                name: 'products.list',
                component: Dashboard,
            },
            {
                path: '/products/create',
                name: 'products.create',
                component: Form
            },
            {
                path: '/products/:id/edit',
                name: 'products.edit',
                component: Form,
                props: true
            }
        ]
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
