import './bootstrap';
import 'flowbite';

import {createApp} from 'vue'
import App from './App.vue'
import router from "./Router/router"
import { createPinia } from "pinia"

createApp(App)
    .use(router)
    .use(createPinia())
    .mount("#app")
