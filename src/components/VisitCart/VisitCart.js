import { arrowInSquare } from '../../helpers/icons.js';
import { MedDocs } from '../MedDocs/MedDocs.js';
import { mapMutations } from '../../libs/vuex.esm.browser.js';
import { BlockBox } from '../BlockBox.js';
import { ServicesAndMaterials } from '../ServicesAndMaterials.js';

export const Visit = {
  props: ['properties'],
  delimiters: ['#{', '}'],
  components: {
    'med-docs': MedDocs,
    'block-box': BlockBox,
    'services-and-materials': ServicesAndMaterials,
  },
  data() {
    return {
      arrowInSquare,
      tabs: ['Медицинские документы', 'Услуги и материалы'],
    };
  },
  computed: {
    selectedTabComponent() {
      return this.tabs.find((el) => el.name === this.selectedTab).component;
    },
  },
  methods: {
    ...mapMutations('modal', ['openModal', 'closeModal']),
    openVisitModal() {
      this.$store.commit('modal/closeModal', 'isAppointModalTabsOpened');
      this.$store.commit('modal/openModal', 'isVisitModalOpened');
    },
  },
  template: `<div class='modal__content-bottom'>
    <block-box >
      <template #box-header>
        <div class='appoint-modal-visit'>
          <h3 >Прием</h3>
          <base-btn text='Добавить'
                    icon='plus'
                    @click.native='openVisitModal'
          ></base-btn>


          <div class='visit-top-btns'
                >
            <base-btn icon='arrowInSquare'
                      style='justify-self: end;'
            ></base-btn>
            <base-btn icon='account'
                      style='justify-self: end; '
                      class='green-btn'
                      text='Колесникова И. И.'
            ></base-btn>
          </div>
        </div>
      </template>
      <template #box-body >
        <div >
          <tabs :tabList="tabs" 
                 class='grid'
                 style='row-gap: var(--spacing-xxm)'
                  >
              <template v-slot:tabPanel-1> 
                <med-docs></med-docs>
              </template>

              <template v-slot:tabPanel-2  >  
                <!-- <service-material-table 
                            :table='totalList'
                    ></service-material-table> -->
                <services-and-materials>
                </services-and-materials>
              </template>
            </tabs>
        </div>
  

 
      </template>
    </block-box>
</div>          
               

            


              
 `,
};
