<template>
  <custom-modal :width='764'
                :cross='true'
                modalName='isFilterModalOpened'>
    <template>
      <div class='modal__container'>
        <div class='btns-group'>
          <base-btn v-for='btn in baseFilters'
                    :icon='btn.icon'
                    :key='btn.id'
                    :class='currentBaseFilter.sysName === btn.sysName ? "current-btn" : "btn-group"'

                    :text='$t(btn.name)'
                    @click.native='setCurrentFilter(btn)'
          >
          </base-btn>
        </div>
        <div class='modal__all-select'>
          <base-btn icon='folder'
                    @click.native.stop='openPresets("modal")'
          >
          </base-btn>

          <base-btn :text='$t(textBtn)'
                    :class='"select-all-btn"'
                    @click.native.prevent='selectAll'
          ></base-btn>


          <base-btn icon='arrow'
                    class='select-all-btn-arrow'
                    @click.native.stop='openPresets("list")'
          ></base-btn>

          <preset-modal v-if='isPresetModalOpened'
                        @close-preset='isPresetModalOpened = $event'>
          </preset-modal>

          <presets-list v-if='isPresetsListOpened'
                        @close-preset='isPresetsListOpened = $event'
                        @update-options='updateFromPreset($event)'
          ></presets-list>

        </div>

        <div class='modal__select'>
          <v-select v-model="selectedFilterOptions"
                    class='modal__filters-options'
                    :options="optionsForFilters"
                    :close-on-select="false"
                    multiple
                    label="name"
                    @remove='removeSelectedOptionsItem'
                    :placeholder='currentBaseFilter.filterName'>
          </v-select>
        </div>

        <div class='modal__checkboxes'>
          <label v-for='(checkbox, key) in modalCheckboxes'
                 :key='key'
                 class='checkbox'
          >
            <input type='checkbox'
                   class='checkbox__input'
                   :value='key'
                   v-model='selectedCheckboxes'
            >
            <span>{{ $t(checkbox) }}</span>
          </label>
        </div>

        <base-btn :text='$t("Применить")'
                  :class='"apply-btn"'
                  @click.native='execute'
                  :disabled='!selectedFilterOptions.length'
        ></base-btn>
      </div>
    </template>

  </custom-modal>
</template>

<script>
import { baseFilters, modalCheckboxes } from '@/helpers/dicts.js';
import { mapActions,  mapMutations,
  mapState,
  mapGetters, } from 'vuex';
import PresetsList  from '@/components/Presets/PresetsList.vue';
import PresetsModal  from '@/components/Presets/Presets.vue';
export default {
  name: 'FiltersModal',
  data() {
    return {
      modalCheckboxes,

      baseFilters,
      currentBaseFilter: '',

      selectedFilterForCabinet: [],
      selectedFilterForSpec: [],

      selectedCheckboxes: [],
      isAllOptionsSelected: false,
      isPresetModalOpened: false,
      isPresetsListOpened: false,
    };
  },
  components: {
    'preset-modal': PresetsModal,
    'presets-list': PresetsList,
  },
  mounted() {
    this.selectedCheckboxes = this.selectedCheckboxesVuex;
    this.currentBaseFilter = {...this.currentFilter};
    this.selectedFilterOptions = this.selectedFilterOptionsVuex;

  },
  computed: {
    ...mapState({
      cabinets: (state) => state.cabinets,
      doctors: (state) => state.specs,
      currentFilter: (state) => state.currentFilter,
      selectedFilterOptionsVuex: (state) => state.selectedFilterOptionsVuex,
      selectedCheckboxesVuex: (state) => state.selectedCheckboxes,
    }),
    ...mapGetters('appoint', ['filteredPresets']),
    doctorsOptionsForSelect: {
      get() {
        return this.doctors;
      },
      set(val) {
        return val;
      },
    },
    cabinetsOptionsForSelect: {
      get() {
        return [...this.cabinets];
      },
      set(val) {
        return val;
      },
    },
    optionsForFilters: {
      get() {
        let data = [];
        if (this.currentBaseFilter.sysName !== 'cabinet') {
          data = this.doctorsOptionsForSelect.filter(
              (el) => !this.selectedFilterOptions.includes(el)
          );
        } else {
          data = this.cabinetsOptionsForSelect.filter(
              (el) => !this.selectedFilterOptions.includes(el)
          );
        }

        return data;
      },
      set(val) {
        if (this.currentBaseFilter.sysName !== 'cabinet') {
          return (this.doctorsOptionsForSelect = val);
        } else {
          return (this.cabinetsOptionsForSelect = val);
        }
      },
    },
    selectedFilterOptions: {
      get() {
        if (this.currentBaseFilter.sysName !== 'cabinet') {
          return this.selectedFilterForSpec;
        } else {
          return this.selectedFilterForCabinet;
        }
      },
      set(val) {
        if (this.currentBaseFilter.sysName !== 'cabinet') {
          this.selectedFilterForSpec = val;
        } else {
          this.selectedFilterForCabinet = val;
        }
      },
    },
    textBtn() {
      return this.isAllOptionsSelected && !this.optionsForFilters.length
          ? 'Очистить все'
          : 'Выбрать все';
    },
  },
  watch: {
    currentFilter(val) {
      this.currentBaseFilter = this.currentFilter;
    },
    currentBaseFilter(val) {
      if (val.sysName === 'cabinet' && this.isAllOptionsSelected) {
        this.selectedFilterOptions = this.cabinets;
      }

      if (val.sysName !== 'cabinet' && this.isAllOptionsSelected) {
        this.selectedFilterOptions = this.doctors;
      }
    },
    isAllOptionsSelected(val) {
      if (val) {
        if (this.currentBaseFilter.sysName === 'cabinet') {
          this.selectedFilterOptions = this.cabinets;
        } else {
          this.selectedFilterOptions = this.doctors;
          this.doctorsOptionsForSelect = [];
        }
        this.optionsForFilters = [];
      }

      if (!val) {
        if (this.currentBaseFilter.sysName === 'cabinet') {
          if (
              this.selectedFilterOptions.length ===
              this.cabinetsOptionsForSelect.length
          ) {
            this.selectedFilterOptions = [];
          }
        } else {
          if (
              this.selectedFilterOptions.length ===
              this.doctorsOptionsForSelect.length
          ) {
            this.selectedFilterOptions = [];
          }
        }
      }
    },
    optionsForFilters: {
      handler(val) {
        if (val.length) {
          this.isAllOptionsSelected = false;
        } else {
          this.isAllOptionsSelected = true;
        }
      },
      deep: true,
    },
    selectedFilterOptions: {
      handler(payload) {
        this.$store.commit('updatePayload', {
          option: 'selectedFilterOptionsVuex',
          payload,
        });
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('appoint', ['getData']),
    ...mapMutations(['updatePayload']),
    ...mapMutations('modal', ['closeModal']),
    selectAll(e) {
      e.stopPropagation()
      this.isAllOptionsSelected = !this.isAllOptionsSelected
    },
    async execute() {
      // let grid = document.querySelector('.content');
      // grid.scrollIntoView({ top: 0, behavior: 'smooth' });

      this.$store.commit('updatePayload', {
        option: 'currentFilter',
        payload: this.currentBaseFilter,
      });

      this.$store.commit('updatePayload', {
        option: 'selectedCheckboxes',
        payload: this.selectedCheckboxes,
      });

      await this.$store.dispatch('appoint/getData');
      this.$store.commit('modal/closeModal', 'isFilterModalOpened');
    },

    setCurrentFilter(btn) {
      this.currentBaseFilter = btn;
    },
    removeSelectedOptionsItem(val) {
      this.selectedFilterForSpec = this.selectedFilterOptions.filter(
          (el) => el.id !== val.id
      );
    },
    openPresets(text) {
      if (text === 'modal') {
        this.isPresetModalOpened = true;
        this.isPresetsListOpened = false;
      }

      if (text === 'list') {
        if (this.filteredPresets.length) {
          this.isPresetsListOpened = true;
        }
        this.isPresetModalOpened = false;
      }
    },
    updateFromPreset(options) {
      let payload = [
        ...this.optionsForFilters.filter((el) => options.includes(el.id)),
      ];
      if (payload.length) {
        this.$store.commit('updatePayload', {
          option: 'selectedFilterOptionsVuex',
          payload,
        });
      }

      this.isPresetsListOpened = false;
      this.execute();
    },
    closeModal() {
      this.$store.commit('modal/closeModal', 'isFilterModalOpened');
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
