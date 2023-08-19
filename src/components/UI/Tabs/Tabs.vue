<template>
  <div>
    <ul class="tabs"
        :style='cols'>
      <li
          v-for="(tab, index) in tabList"
          :key="index"
          class='tab'
          :class="{
          'current-tab': index + 1 === activeTab,
        }"
      >
        <label
            :for="_uid+index"
            class="pointer"
        >
          {{ $t(tab) }}
          <input
              :id="_uid+index"
              type="radio"
              :name="_uid+'-tab'"
              :value="index + 1"
              v-model="activeTab"
              style='display: none;'
          />
        </label>
      </li>
    </ul>

    <template v-for="(tab, index) in tabList">
      <div
          :key="index"
          v-if="index + 1 === activeTab"
      >
        <slot :name="'tabPanel-'+(index + 1)" :tab="'tabPanel-'+(index + 1)"></slot>
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      required: true,
    },
    variant: {
      type: String,
      required: false,
      default: () => 'vertical',
      validator: (value) => ['horizontal', 'vertical'].includes(value),
    },
  },
  data() {
    return {
      activeTab: 1,
    };
  },
  watch: {
    activeTab(val) {
      this.$emit('change-tab', this.tabList[val - 1]);
    },
  },
  computed: {
    activeTabText() {
      return this.tabList[this.activeTab - 1];
    },
    cols() {
      return {
        gridTemplateColumns: `repeat(${this.tabList.length}, max-content)`,
      };
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
