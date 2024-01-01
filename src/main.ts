import App from "./App.vue";
import { createApp } from "vue";
import { registerPlugins } from "@/plugins";
import VueCountdown from "@chenfengyuan/vue-countdown";

const app = createApp(App);
app.component(VueCountdown.name, VueCountdown);

registerPlugins(app);
app.mount("#app");
