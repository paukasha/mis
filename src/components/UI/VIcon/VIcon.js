import icons from "../../../helpers/icons.js"
export const VIcon = {
  props: ['icon'],
  computed: {
    vIcon() {
      return icons[this.icon]
    }
  },
  template: `
    <span v-html='vIcon'>

    </span>  
  `
}