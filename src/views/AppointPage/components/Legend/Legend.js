import { mapState } from '../../../../libs/vuex.esm.browser.js';

export const Legend = {
  delimiters: ['#{', '}'],
  computed: {
    ...mapState({
      legends: (state) => state.appoint.legends,
    }),
  },
  template: `<div class='legend'>
      <div class='legend__item' 
            v-for='legend in legends'
            :key='legend.id'
            :title='legend.name'
            :style=' {backgroundColor: legend.color ?? "var(--graph-background)"}'>
      <span class='legend__text'>
        #{legend.shortName}
      </span>
      </div>
    </div>
  `,
};
