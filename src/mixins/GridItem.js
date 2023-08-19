import { calcItemCoordsStyle } from '@/helpers/calcItemCoordsStyle.js';
import { mapState } from 'vuex';
import moment from "moment";
export const gridItemMix = {
  delimiters: ['#{', '}'],
  data() {
    return {
      date: '',
      itemCoordsStyle: {},
    };
  },
  mounted() {
    this.date = moment(this.gridItem.d_t_s).format('DD-MM-YYYY');
    this.updateItemCoords();
  },
  computed: {
    ...mapState({
      workDateTimeContinue: (state) => state.workDateTimeContinue,
    }),
  },
  methods: {
    updateItemCoords() {
      this.itemCoordsStyle = calcItemCoordsStyle(
        this.gridItem.d_t_s,
        this.gridItem.dur,
        this.workDateTimeContinue
      );
    },
  },
};
