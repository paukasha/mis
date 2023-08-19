export const GridItem = {
  props: {
    border: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    gridItemStyles() {
      return {
        // border: '1px solid var(--color-mercury)',
      };
    },
  },
  template: `
  <div :style='gridItemStyles'>
    <slot></slot>
  </div>
  `,
};
