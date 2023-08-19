<template>
  <div class='scroll-top-wrapper' v-if='isVisible'>
    <span @click.prevent="scrollTop" class='scroll-top'>
    </span>
  </div>
</template>

<script>

export default {
  name: 'ScrollTopBtn',
  data() {
    return {
      scTimer: 0,
      scY: 0,
      isVisible: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      let content = document.querySelector('.content')
      content.addEventListener('scroll', this.handleScroll);
    })
  },
  beforeDestroy() {
    let content = document.querySelector('.content')
    content.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    scrollTop() {
      let content = document.querySelector('.content')
      content.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll(e) {
      if (e.target.scrollTop > 160) {
        this.isVisible = true
      } else {
        this.isVisible = false
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
