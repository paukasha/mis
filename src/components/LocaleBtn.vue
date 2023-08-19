<template>
  <base-btn :text="locale"
            @click.native="changeLocale"></base-btn>
</template>

<script>
import moment from "moment/moment.js";
import {mapState} from "vuex";
import Vue from "vue";

export default {
  name: 'locale-btn',
  computed: {
    ...mapState({
      locale: ({locale}) => locale,
    }),
  },
  methods: {
    changeLocale() {
      let locale = localStorage.getItem('locale')
      if (locale == 'ru') {
        localStorage.setItem('locale','en')
        // this.$i18n.locale = 'en'
        // moment.locale('en')
        // Vue.prototype.moment.locale('en')
      } else {
        localStorage.setItem('locale','ru')
        // Vue.prototype.moment.locale('ru')
      }

      locale = localStorage.getItem('locale')
      this.$i18n.locale = locale
      // moment.locale(locale)
      // Vue.prototype.moment.locale(locale)
      this.$store.commit('updatePayload', {option: 'locale', payload: locale})
      // window.location.reload()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>