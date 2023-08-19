<template>
  <div class='panel__wrapper'>
    <div class='panel__top'>
      <h2 class='panel__title'>{{ $t('Расчет стоимости')}}</h2>
      <div v-html='cross'
           class='cross'
           @click='hidePanel("isPriceOpened")'
      ></div>
    </div>

    <div class='panel__content'>
      <div class='label-wrapper'>
        <span class='input__title'>{{$t('Группа')}}</span>
        <v-select :placeholder='$t("Выберите группу")'
                  :options='serviceGroups'
                  label='name'
                  v-model='selectedGroup'>
          <template slot="no-options">{{ $t('Поиск группы') }}</template>
        </v-select>
      </div>

      <div class='label-wrapper'>
        <span class='input__title'>{{ $t('Название') }}</span>
        <v-select :placeholder='$t("Выберите название")'
                  :options='filteredServices'
                  label='name'
                  v-model='selectedService'
                  @change="selectedService = ''">
          <template #no-options="{ search, searching, loading }">
            <span>$t('Поиск услуги')</span>
          </template>
          <template #option="{ name, price }">
            <div class='price__option-text'>
              <span>{{ name }}</span>
              <span>{{ price }}</span>
            </div>
          </template>
        </v-select>
      </div>


      <base-btn icon='plus'
                :text='$t("Добавить услугу")'
                :title='!selectedService ? $t("Выберите услугу"): ""'
                :disabled='!selectedService'
                @click.native='addServiceToTotalList("service")'
      ></base-btn>

      <div>
        <span class='input__title'>{{ $t("Материалы") }}</span>
        <v-select :placeholder='$t("Выберите материалы")'
                  :options='warehouses'
                  label='name'
                  v-model='selectedWarehouse'
                  >
          <template #no-options >
            $t("Поиск материалов")
          </template>
          <template #option="{ name, sale_price }">
            <div class='price__option-text'>
              <span>{{ name }}</span>
              <span>{{ sale_price }}</span>
            </div>
          </template>
        </v-select>
      </div>

      <base-btn icon='plus'
                :text='$t("Добавить материал")'
                :title='!selectedWarehouse ? "Выберите материал": ""'
                :disabled='!selectedWarehouse'
                @click.native='addServiceToTotalList("warehouse")'
      ></base-btn>

      <service-material-table
          :table='totalList'
          :specCol='false'
          :dateCol='false'
          :greyThead='true'
          @delete-table-item='deleteItem($event)'
      ></service-material-table>

      <base-btn text='Сбросить'
                v-if='isPanelDataEmpty'
                @click.native='resetPanelData'
      ></base-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { clock, cross } from '@/helpers/icons.js';

import { serviceMixin } from '@/mixins/ServiceMaterialsMixin.js';

import ServicesMaterialTable from "@/components/Tables/ServiceMaterialTable.vue";
import axios from "axios";
export default {
  name: 'PricePanel',
  mixins: [serviceMixin],
  components: {
    'service-material-table': ServicesMaterialTable,
  },
  data() {
    return {
      clock,
      cross,
      theadCalcPrice: ['Название услуги или материала', `Цена за<br>ед. (&#8381;)`, 'Кол-во', `Стоимость<br>(&#8381;)`],
      printPageTemplate: '',
    };
  },

  computed: {
    ...mapState({
      isPriceOpened: (state) => state.panels.isPriceOpened,
    }),

    isPanelDataEmpty() {
      return (
          this.totalList.length ||
          this.selectedWarehouse ||
          this.selectedService ||
          this.selectedGroup
      );
    },
  },
  methods: {
    hidePanel(panel) {
      this.$store.commit('panels/closePanel', panel);
    },
    getServices(search, loading) {
      clearTimeout(this.timer);
      if (search.length) {
        loading(true);
        this.timer = setTimeout(() => {
          return priceApi
              .getServices({ query: search })
              .then((res) => {
                clearTimeout(this.timer);
                this.services = res.data;
                loading(false);
              })
              .catch(loading(false));
        }, 1500);
      }
    },

    resetPanelData() {
      this.totalList = [];
      this.selectedWarehouse = '';
      this.selectedService = '';
      this.selectedGroup = '';
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
