<template>
  <div class='panel__wrapper'>
    <div class='panel__top'>
      <div class='waitlist-panel__top'>
        <h2 class='panel__title'>
          Лист ожидания
          <span class='wait-list__quantity'>
                                  #{filteredListItem.length}
                            </span>
        </h2>

        <base-btn text='Добавить'
                  class='apply-btn'
                  icon='plus'
                  @click.native='addWaitList'>
        </base-btn>
      </div>

      <div v-html='cross'
           class='cross'
           @click='hidePanel("isWaitListOpened")'
      ></div>
    </div>
    <div class='panel__content'>
      <div class="wait__spec-fixed-wrapper">
        <div  class='wait__spec--fixed'>
          <span class='input__title'>Специалист</span>
          <v-select placeholder='Выберите специалиста'
                    :options='specs'
                    label='name'
                    v-model='selectedSpec'>
            <template slot="no-options">Поиск специалиста</template>
          </v-select>
        </div>
      </div>

      <div class='wait-list item' v-if='filteredListItem.length'>
        <wait-list-card v-for='waitListItem in filteredListItem'
                        :key='waitListItem.id'
                        :wait-item.sync='waitListItem'
                        draggable="true"
                        @dragstart.native="handleDragStart($event, waitListItem)"
                        dragover.prevent
                        drageneter.prevent
        ></wait-list-card>
      </div>
      <div v-else>Ничего не найдено</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import WaitListCard from "./WaitListCard.vue";
import { handleNewKeys } from "@/helpers/handleNewKeys.js";
import { handleIncomeAppoints } from "@/helpers/handleIncomeData.js";
import { cross } from "@/helpers/icons.js";
export default {
  name: 'WaitList',
  delimiters: ["#{", "}"],
  components: {
    WaitListCard,
  },
  data() {
    return {
      cross,
      selectedSpec: "",
    };
  },
  mounted() {
    this.getWaitList();
  },
  methods: {
    ...mapMutations(["panels", ["openPanel"], "updatePayload"]),
    hidePanel(panel) {
      this.$store.commit("panels/closePanel", panel);
    },
    async getWaitList() {
      await waitListApi.getWaitList(this.selectedSpec?.id).then(({ data }) => {
        let newdata = data.map((el) => {
          return {
            ...handleIncomeAppoints(handleNewKeys(el, "waitListNewKeys")),
            waitItemId: el.id,
          };
        });

        this.$store.commit("updatePayload", {
          option: "waitList",
          payload: newdata,
        });
      });
    },
    addWaitList() {
      this.$store.commit("panels/openPanel", "isCreateWaitListItemOpened");
    },
    handleDragStart(e, item) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("PatientData", JSON.stringify(item));
    },
  },
  watch: {
    selectedSpec() {
      this.getWaitList();
    },
  },
  computed: {
    ...mapState({
      isWaitListOpened: (state) => state.panels.isWaitListOpened,
      specs: (state) => state.specs,
      waitList: (state) => state.waitList,
    }),
    filteredListItem() {
      return this.waitList;
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
