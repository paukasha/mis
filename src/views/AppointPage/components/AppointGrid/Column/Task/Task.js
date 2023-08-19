import { gridItemMix } from "../../../../../../mixins/GridItem.js";

export const AppointTask = {
  delimiters: ["#{", "}"],
  props: ["gridItem", "columnId"],
  mixins: [gridItemMix],
  methods: {
    async openModal(e, appoint) {
      e.stopPropagation();

      if (
        e.target.classList.contains("column-titles") ||
        e.target.closest(".column-titles")
      ) {
        e.preventDefault();
        return;
      }

      let taskModalData = {
        ...this.gridItem,
        isAppointEdit: true,
        tab: "task",
      };

      this.$store.commit('modal/updatePayload', {option: 'isTaskEdit', payload: true})

      this.$store.commit("modal/openModal", "isAppointModalTabsOpened");
      this.$store.commit("modal/updateAppointModalData", taskModalData);
    },
    calcCommentStyles() {
      let commentHeight = parseInt(this.itemCoordsStyle.height, 10),
        // 14 - это размер шрифта, вообще размер шрифта 11 - но со значением 11 неправильно расситываетс количество строк
        commentStrings = Math.ceil(commentHeight / 14) - 1;
      return {
        height: commentHeight + "px",
        "-webkit-line-clamp": commentStrings,
      };
    },
    catchDrop() {
      console.log();
    },
  },
  watch: {
    "gridItem.d_t_s": {
      handler() {
        this.updateItemCoords();
      },
      deep: true,
    },
  },
  computed: {
    taskCommentStyle() {
      return this.calcCommentStyles();
    },
  },
  template: `<div class='appoint__item appoint__task'
                      :style="[itemCoordsStyle]"
                      @click='openModal'
                      @drop='catchDrop'
                  >
                  <div class='patient__category'
                  ></div>
                    
                    <div class='appoint-status-type' 
                        >
                    </div>

                    <span class='text-xxs-400 text-overflow'
                          :style='taskCommentStyle'
                          ref='appointComment'
                          :title='gridItem.cmt'
                    >
                    #{gridItem.cmt}
                    </span>
                </div>`,
};
