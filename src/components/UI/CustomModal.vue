<template>
  <div  :class='[{"is-dark": isDark}, modalName]'
        :key='modalName'
        @click.self='closeModal'
  >
    <div class='modal-container'
         @click='changeModalFocus'
         id='modal'
         @dragstart='preventDrag'
         @mousedown.self='dragStart($event)'
         @mouseup.self='dragEnd($event)'
         ref='modal'
         :style='styles'
    >

      <div>
        <div v-html='crossIcon'
             v-if='cross'
             class='cross'
             @click.stop='closeModal'
        ></div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { cross as crossIcon } from '@/helpers/icons.js';
import {
  mapGetters
} from 'vuex';
export default {
  name: 'CustomModal',
  props: ['isDark', 'cross', 'width', 'modalName', 'height'],
  data() {
    return {
      crossIcon,
      dx: 0,
      dy: 0,
      draggedEl: '',
    };
  },
  mounted() {
  },
  beforeDestroyed() {
    document.removeEventListener('mousemove', this.onMouseMove);
  },
  computed: {
    ...mapGetters(['lastOpenedElement']),
    styles() {
      let styles = {

        maxWidth: this.width ? this.width + 'px' : '1200px',
        zIndex:
            this.lastOpenedElement.modalName === this.modalName
                ? this.lastOpenedElement.zIndex
                : this.lastOpenedElement.zIndex - 1,

      };

      if (this.height) {
        styles.height = this.height
      }

      return styles
    },
  },
  watch: {},
  methods: {
    changeModalFocus() {
      this.$store.commit('updateOpenedElements', this.modalName);
    },

    closeModal() {
      this.$store.commit('modal/closeModal', this.modalName);
    },

    dragStart(e) {
      let textFields = ['input', 'textarea'];
      if (textFields.includes(e.target.tagName.toLowerCase())) {
        e.stopPropagation();
        return;
      }
      this.shiftX = e.clientX - this.$refs.modal.getBoundingClientRect().left;
      this.shiftY = e.clientY - this.$refs.modal.getBoundingClientRect().top;

      this.dragMove(e.pageX, e.pageY);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.dragEnd);
    },

    onMouseMove(e) {
      // if (!e.target.classList.contains('modal-container')) return
      this.dragMove(e.pageX, e.pageY);
    },

    dragMove(pageX, pageY) {
      this.$refs.modal.style.top = pageY - this.shiftY + 'px';
      this.$refs.modal.style.left = pageX - this.shiftX + 'px';
      this.$refs.modal.style.transform = 'initial';
    },

    dragEnd(e) {
      document.removeEventListener('mousemove', this.onMouseMove);
    },
    preventDrag() {
      return false;
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
