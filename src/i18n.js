import Vue from "vue";
import VueI18n from 'vue-i18n'
import {langs, defaultLocale} from "@/i18n/index.js";

const messages = Object.assign(langs)


Vue.use(VueI18n)

export default new VueI18n({
  legacy: true,
  locale: localStorage.getItem('locale'),
  fallbackLocale: "ru",
  messages
  // messages: loadLocaleMessages()
});