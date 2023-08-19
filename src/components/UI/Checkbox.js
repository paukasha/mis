export const Checkbox = {
  delimiters: ['#{', '}'],
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    value: { type: [String, Object, Number] },
    modelValue: { default: '' },
    icon: { default: '' },
    small: { default: Boolean },
    trueValue: { default: true },
    falseValue: { default: false },
  },

  methods: {
    updateInput(event) {
      let isChecked = event.target.checked;
      if (this.modelValue instanceof Array) {
        let newValue = [...this.modelValue];
        if (isChecked) {
          newValue.push(this.value);
        } else {
          newValue.splice(newValue.indexOf(this.value), 1);
        }
        this.$emit('change', newValue);
      } else {
        this.$emit('change', isChecked ? this.trueValue : this.falseValue);
      }
    },
  },
  computed: {
    className() {
      let className = this.icon == 'minus' ? 'negative' : 'default';
      let small = this.small ? 'small' : '';

      return className + ' ' + small;
    },
    isChecked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value);
      }
      // Note that `true-value` and `false-value` are camelCase in the JS
      return this.modelValue === this.trueValue;
    },
  },
  template: `<label class="checkbox" :class='className'>
        <input type="checkbox" 
              class="checkbox__input" 
              :checked="isChecked" :value="value" @change="updateInput"> 
              <span class='checkbox-before'>
                <slot></slot>
              </span>
              
    </label>`,
};
