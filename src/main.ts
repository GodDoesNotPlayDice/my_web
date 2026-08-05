import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createI18n } from "vue-i18n";
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import { es } from "./i18n/es";
import { en } from "./i18n/en";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { es, en },
});

const app = createApp(App);

app.use(Particles, {
  init: async (engine: unknown) => {
    await loadSlim(engine as Engine);
  },
});

app.use(i18n);
app.mount("#app");
