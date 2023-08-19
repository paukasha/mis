import { BlockBox } from '../BlockBox.js';
import { BaseBtn } from '../UI/BaseBtn.js';
import { ServicesAndMaterials } from '../ServicesAndMaterials.js';
import { ActualDirections } from '../ActualDirections.js';
import { directions } from '../../helpers/dicts.js';
import { Materials } from '../Materials.js';

export const MaterialsBlock = {
  delimiters: ['#{', '}'],
  components: {
    'block-box': BlockBox,
    'base-btn': BaseBtn,
    'services-and-materials': ServicesAndMaterials,
    'actual-directions': ActualDirections,
    materials: Materials,
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
            <span class='text-h6'>Материалы</span>
          </div>
        </template>

      <template #box-body>
        <materials></materials>
      </template>
    </block-box>
  `,
};
