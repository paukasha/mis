import { ServiceMaterialTable } from './Tables/ServiceMaterialTable.vue';
import { serviceMixin } from '../mixins/ServiceMaterialsMixin.js';
import { uniqueArray } from '../helpers/handleAppointFilter.js';

export const ServicesAndMaterials = {
  delimiters: ['#{', '}'],
  props: ['table'],
  mixins: [serviceMixin],
  mounted() {
    if (this.table && this.table?.length) {
      this.totalList = uniqueArray([...this.table, ...this.totalList], 'id');
    }
  },
  watch: {
    table: {
      handler(val) {
        this.totalList = uniqueArray([...this.totalList, ...val], 'id');
      },
      deep: true,
    },
  },
  components: {
    'service-material-table': ServiceMaterialTable,
  },
  template: `<div class='services-block-form' v-else>
    <span class='form__item-name'>Группа</span>
      <div class='form__item-input'>
        <v-select :options='serviceGroups'
                  placeholder='Введите название группы'
                  class='text-overflow-select'
                  label='name'
                  v-model='selectedGroup'
                  ></v-select>
      </div>

      <span class='form__item-name' style='grid-column-start: 1'>Название</span>
      <div class='form__item-input'>
        <v-select placeholder='Выберите название'
                  class='text-overflow-select'
                  :options='services'
                  :filterable='false'
                  label='name'
                  v-model='selectedService'
                  @search='getServices'
                  @change="selectedService = ''">
                <template #no-options="{ search, searching, loading }">
                  <span>Поиск услуги</span>
                </template>
                <template #option="{ name, price }">
                    <div class='price__option-text'>
                      <span>#{name}</span>
                        <span>#{price}</span>
                    </div>
                  </template>
              </v-select>
        </div>
        <base-btn text='Добавить услугу' 
                  icon='plus'
                  :title='!selectedService ? "Выберите услугу": ""'
                  :disabled='!selectedService'
                  @click.native='addServiceToTotalList("service")'
                ></base-btn>

        <service-material-table 
                style='grid-column: 1/4'
                :table='totalList'
                @delete-table-item='deleteItem($event)'
        ></service-material-table>
  </div>`,
};
