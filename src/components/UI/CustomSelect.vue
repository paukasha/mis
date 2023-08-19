<template>
  <div class="custom-select"
       :tabindex="tabindex"
       @blur="open = false">
    <div class="selected"
         :class="{ open: open, }"
         @click="open = !open">
      <div>{{ $t(`affiliates.` + selected.name) }}</div>
      <span :class="{ arrow: options.length > 1 }"></span>
    </div>
    <div class="items"
         :class="{ selectHide: !open }"
         v-click-outside="closeList"
    >
      <div
          v-for="(option, i) of options"
          :key="i"
          @click="clickHandler(option)"
      >
        <a href='#'>{{ $t(`affiliates.` + option.name) }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: ['options', 'default', 'tabindex'],
  data() {
    return {
      selected: '',
      open: false,
      localOptions: []
    };
  },
  mounted() {
    this.selected = this.options[0]
    this.$emit("input", this.selected);
  },
  watch: {
    options: {
      handler() {
        this.selected = this.options[0];
      }
    }
  },
  methods: {
    clickHandler(option) {
      this.selected = option;
      this.open = false;
      this.$emit('input', option);
    },
    closeList(e) {
      if (e.target.classList.contains('selected') || e.target.closest('.selected')) {
        return
      }
      if (!e.target.classList.contains('items') && !e.target.closest('.items')) {
        this.open = false
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
