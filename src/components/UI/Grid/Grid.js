//  компнент грид переиспользуемый
// взодные параметры - стили для грида - задается в rem!

export const Grid = {
  props: {
    columns: {
      type: Number,
      default: 1,
    },
    rows: {
      type: Number,
      default: 0,
    },
    spacing: {
      type: [String, Number],
      default: 0,
    },
    rowSpacing: {
      type: Number,
      default: 0,
    },
    colSpacing: {
      type: [String, Number],
      default: 0,
    },
    colWidth: {
      type: String,
      default: '1fr',
    },
    maxWidth: {
      type: [String, Number],
    },
    rowStart: {
      type: Number,
      default: 0,
    },
    border: {
      type: Boolean,
      default: false,
    },

    container: {
      type: Boolean,
      default: false,
    },
    alignItems: {
      type: String,
      default: '',
    },
  },
  computed: {
    gridStyles() {
      let gridStyles = {
        gridTemplateColumns: `repeat(${this.columns}, ${this.colWidth})`,
        gridTemplateRows: `repeat(${this.rows}, 1fr)`,
        width: this.maxWidth ? this.maxWidth + 'px' : '100%',
        gridRowStart: this.rowStart,
      };

      // if (this.border) {
      //   gridStyles.outline = this.border && '1px solid var(--color-mercury)';
      // }

      if (this.alignItems) {
        gridStyles.alignItems = this.alignItems;
      }

      // TODO потестировать spacing
      gridStyles.gap = this.spacing !== 0 ? `${this.spacing}rem` : '0';

      if (this.spacing == 0 && this.rowSpacing) {
        gridStyles.rowGap = `${this.rowSpacing}rem`;
      }
      if (!this.spacing && this.colSpacing) {
        gridStyles.columnGap =
          typeof this.colSpacing == 'number'
            ? `${this.colSpacing}rem`
            : this.colSpacing;
      }

      return {
        ...gridStyles,
      };
    },
  },
  template: `<div class='new-grid'
                :class='container && "grid"'
                :style='gridStyles'
  >
              <slot></slot>
  </div>`,
};
