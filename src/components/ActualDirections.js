export const ActualDirections = {
  delimiters: ['#{', '}'],
  props: ['directions'],
  data() {
    return {
      selectedDirections: [],
      isAllDirectionsSelected: false,
    };
  },
  computed: {
    selectedDirectionsLength() {
      return this.selectedDirections.length;
    },

    selectedDirectionsSum() {
      if (this.selectedDirections.length) {
        return this.selectedDirections.reduce((a, b) => {
          return a + +b.price;
        }, 0);
      }

      return 0;
    },
    topCheckboxIcon() {
      if (this.selectedDirections.length === this.directions.length) {
        return 'plus';
      } else if (this.selectedDirections.length) {
        this.isAllDirectionsSelected = true;
        return 'minus';
      }

      return '';
    },
  },
  methods: {
    checkAll(val) {
      if (val) {
        this.selectedDirections = this.directions;
      }

      if (!val) {
        this.selectedDirections = [];
      }
    },
    addToTable() {
      this.$emit('add-to-table', this.selectedDirections);
    },
  },
  template: `<div class='grid actual-directions'>
      <div class='checkbox-helper-grid'>
        <checkbox :icon='topCheckboxIcon' 
                  @change='checkAll($event)'
                  v-model='isAllDirectionsSelected'
                >
          <template>
            <div class='grid actual-directions-grid'>
              <div>
                <span class='h5'>Направления</span>
              </div>

              <div style='justify-self: end;'>
                <span class='h5'>Стоимость, &#8381; </span>
              </div>

              <div>
                <span class='h5'>Актуально до</span>
              </div>
            </div>
          </template>
        </checkbox>
      </div>

      <div style='max-height: 575px;     overflow-y: scroll;'>
        <div v-for='direction in directions' 
            :key='direction.id' class='checkbox-helper-grid'>
           
          <checkbox v-model='selectedDirections' :value='direction'>
            <template>
              <div class='grid actual-directions-grid'>
                  <div>
                  <span>#{direction.code} #{direction.name}</span>
                </div>

                <div style='justify-self: end;'>
                  <span>#{direction.price}</span>
                </div>

                <div>
                  <span>10.05.2023</span>
                </div>
              </div>
            </template>
          </checkbox>
        </div>
      </div>

      <div class='grid actual-directions__bottom'>
        <base-btn icon='arrowDown' 
                  style='justify-self:start'
                  text='Добавить выбранные направления в наряд' 
                  class='btn-small'
                  @click.native='addToTable'
                  ></base-btn>

        <div class='actual-directions__quantity'>
          <span> Выбрано направлений #{selectedDirectionsLength} на сумму #{selectedDirectionsSum} &#8381; </span>
        </div>
      </div>
  </div>`,
};
