// Базовый класс для создания кнопок-компонентов
import icons from "../../helpers/icons.js";
export const BaseBtn = {
  delimiters: ["#{", "}"],
  props: {
    type: {
      type: String,
      default: "button",
    },
    text: String,
    icon: String,
    order: String,
  },
  computed: {
    btnIcon() {
      return icons[this.icon];
    },
  },
  template: `<button class='base-btn'
                    :type='type'>
                <span v-if='icon'
                      :style='{order: order}'
                      v-html='btnIcon'
                     ></span>
                     
                <span :style='icon && !order ? "marginLeft: 8px" : ""'
                      v-if='text'
                >#{text}</span>
                <slot></slot>
              </button>`,
};
