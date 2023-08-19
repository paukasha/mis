import { mapGetters } from "../../libs/vuex.esm.browser.js";
import {Menu} from "../Menu.js";

export const Dropdown = {
  props: ['icon', 'list', 'isListOpened'],
  components: {
    'custom-menu': Menu
  },
  mounted () {
    document.addEventListener('click', this.close)
  },
  beforeDestroy () {
    document.removeEventListener('click',this.close)
  },
  computed: {
      ...mapGetters(['dropDownZIndex'])
  },
  methods: {
    toggleDropdown() {
      this.$emit('update:isListOpened', !this.isListOpened)
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.$emit('update:isListOpened', false)
      }
    },
    doSomeThing(e) {
      this.$emit('custom-menu-event', e)
    }
  },
  template: `
      <div class='dropdown'
            :style='dropDownZIndex'
      >
       
        <base-btn :style='isListOpened ?  {opacity: 1} : ""'
                  :icon='icon'
                  @click.native='toggleDropdown'
        ></base-btn>
        
        <div class='dropdown-list' 
              v-if='isListOpened'
             >
           <custom-menu :list='list'
                        @close-menu='close($event)'
           ></custom-menu>
        </div>
      </div>
  `
}