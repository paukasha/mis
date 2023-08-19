const TextareaBase = {
  props: ['val', 'id', 'value'],
  data() {
    return {
      textarea: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.textarea = this.$refs["textarea-" + this.id];
      if (this.textarea) {
        this.textarea.style.height = 'auto'
        // this.textarea.style.height = this.textarea.scrollHeight - (this.textarea.scrollHeight * 0.30) + 'px';
        this.textarea.style.height = this.textarea.scrollHeight - 4 + 'px';
      }

    })
  },
  methods: {
    resize(e) {
      this.$emit('update:val', e.target.value)
      this.$emit('input', e.target.value)
      this.textarea.style.height = 'auto'
      this.textarea.style.height = this.textarea.scrollHeight - 4 + 'px';
    },
    handleBlur(e) {
      this.$emit('custom-blur', e)
    }
  },
  watch: {
    val(val) {
      if (!val) {
        if (this.id === 'new-message') {
          this.textarea.style.height = '40px'
        }
      }
    }
  },
  template: `
        <textarea :ref='"textarea-" + id'
                  @input='resize($event)'
                  :value='value'
                  class='textarea-base'
                  @blur='handleBlur($event)'
        ></textarea>
  `
}

export default TextareaBase