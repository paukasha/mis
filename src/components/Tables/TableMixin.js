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
      let isMobile = window.screen.width < 500
      let colsWidths = this.theads
        .map((el) => el.width)
        .filter((el) => el)
        .join(' ');
      return {
        gridTemplateColumns: !isMobile ? `1fr ${colsWidths}` : '100px 1fr 72px 72px',
      };
    },
    theadColor() {
      return {
        backgroundColor: this.greyThead ? 'var(--color-alabaster)' : '',
      };
    },
  },
};
