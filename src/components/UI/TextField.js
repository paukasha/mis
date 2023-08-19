export const TextField = {
  props: {
    size: {
      type: [String, Number],
      default: '1rem',
    },
    weight: {
      type: [String, Number],
      default: '',
    },
    color: {
      type: String,
    },
    textRight: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    textStyles() {
      return {
        fontSize: `${this.size}rem`,
        fontWeight: this.weight,
        color: this.color,
        textAlign: this.textRight && 'right',
      };
    },
  },
  template: `<span :style='textStyles'>
    <slot></slot>
    </span>`,
};
