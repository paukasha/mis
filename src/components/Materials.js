import { MaterialTable } from './Tables/MaterialTable.vue';
import { serviceMixin } from '../mixins/ServiceMaterialsMixin.js';
export const Materials = {
  delimiters: ['#{', '}'],
  mixins: [serviceMixin],
  components: {
    'materials-table': MaterialTable,
  },
  template: `<div class='services-block-form' >
      <span class='form__item-name' >Название</span>
      <div class='form__item-input'>
       <v-select placeholder='Выберите материалы'
                              :options='warehouses'
                              label='name'
                              v-model='selectedWarehouse'
                              :filterable='false'
                              @search='getWarehouse'>
                        <template #no-options >
                          Поиск материалов
                        </template>
                        <template #option="{ name, sale_price }">
                            <div class='price__option-text'>
                              <span>#{name}</span>
                                <span>#{sale_price}</span>
                            </div>
                          </template>             
                        </v-select>
        </div>
       <base-btn icon='plus'
                  text='Добавить материал'
                  :title='!selectedWarehouse ? "Выберите материал": ""'
                  :disabled='!selectedWarehouse'
                  @click.native='addServiceToTotalList("warehouse")'
        ></base-btn>


        <materials-table   
          style='grid-column: 1/4'
          :table='totalList'
          :date-col='false'
          @delete-table-item='deleteItem($event)'></materials-table>

  </div>`,
};
