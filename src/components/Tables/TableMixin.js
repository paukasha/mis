export const TableMixin = {
  props: {
    table: {
      type: Array,
    },
    specCol: {
      type: Boolean,
      default: true,
    },
    dateCol: {
      type: Boolean,
      default: true,
    },
    greyThead: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    calcTextAlign(type) {
      if (type === 'number' || typeof type === 'number') {
        return { textAlign: 'right' };
      }
    },
  },
  computed: {
    totalCost() {
      return this.contents.reduce((prevVal, currentVal) => {
        return prevVal + currentVal.quantity * currentVal.price;
      }, 0);
    },
    calcTableCols() {
      let colsWidths = this.theads
        .map((el) => el.width)
        .filter((el) => el)
        .join(' ');
      return {
        gridTemplateColumns: `1fr ${colsWidths}`,
      };
    },
    theadColor() {
      return {
        backgroundColor: this.greyThead ? 'var(--color-alabaster)' : '',
      };
    },
  },
};
