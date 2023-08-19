import { BlockBox } from '../BlockBox.js';
import { BaseBtn } from '../UI/BaseBtn.js';
import { ServicesAndMaterials } from '../ServicesAndMaterials.js';
import { ActualDirections } from '../ActualDirections.js';
import { directions } from '../../helpers/dicts.js';

export const ServicesBlock = {
  delimiters: ['#{', '}'],
  components: {
    'block-box': BlockBox,
    'base-btn': BaseBtn,
    'services-and-materials': ServicesAndMaterials,
    'actual-directions': ActualDirections,
  },
  data() {
    return {
      directions,
      isActualDirectionsOpened: false,
      selectedDirections: [],
    };
  },
  methods: {
    toggle() {
      this.isActualDirectionsOpened = !this.isActualDirectionsOpened;
    },
  },
  computed: {
    icon() {
      return this.isActualDirectionsOpened
        ? 'mdi-chevron-up'
        : 'mdi-chevron-down';
    },
  },
  template: `
      <block-box>
        <template #box-header>
          <div class='service-block-header'>
            <span class='text-h6'>Услуги</span>
            <base-btn text='Актуальные направления'
                      class='btn-small black-icon'
                      style='justify-self: end'
                      @click.native='toggle'
            >
            <v-icon small color='black'>
             #{icon}
            </v-icon>
          </base-btn>
          
          </div>
           <actual-directions 
              v-if='isActualDirectionsOpened'
              :directions='directions'
              @add-to-table='selectedDirections = $event'
          ></actual-directions>
        </template>

      <template #box-body  :class="'grid-base'" class=''>

       

        <services-and-materials :table='selectedDirections'>
      </services-and-materials>

      </template>
    </block-box>
  `,
};
