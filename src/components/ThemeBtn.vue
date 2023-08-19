<template>


  <base-btn @click.native="toggleTheme">
    <v-icon  >
      {{ themeIcon }}
    </v-icon>
  </base-btn>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'theme-btn',
  computed: {
    ...mapState({
      theme: ({theme}) => theme
    }),
    themeIcon() {
      return this.theme === 'custom-light-theme' ? 'mdi-weather-sunny' : 'mdi-weather-night'
    }
  },
  methods: {
    toggleTheme() {
      if (this.theme === 'custom-light-theme') {
        this.$store.commit('updateTheme', 'dark')
        return
      }
      if (this.theme === 'custom-dark-theme') {

        this.$store.commit('updateTheme','light')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>