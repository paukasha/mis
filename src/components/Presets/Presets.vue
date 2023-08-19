<template>
  <div class='presets'
       v-click-outside.self='closePresets'
  >
    <div class='add-preset'>
      <input type='text'
             ref='presetRef'
             v-model='name'
      >
      <span class='backError preset-error'
            v-if="notSelectedOptions"
      >Выберите опции</span>
      <base-btn text='Сохранить набор'
                class='apply-btn'
                @click.native='createPreset'
      ></base-btn>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: 'Preset',
  data() {
    return {
      name: '',
      notSelectedOptions: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.presetRef.focus()
    })

  },
  computed: {
    ...mapState({
      selectedFilterOptionsVuex: state => state.selectedFilterOptionsVuex,
      currentFilter: state => state.currentFilter
    })
  },
  watch: {
    selectedFilterOptionsVuex: {
      handler(val) {
        if (val.length) {
          this.notSelectedOptions = false
        }
      },deep: true
    }
  },
  methods: {
    ...mapMutations(['addPreset']),
    closePresets(e) {
      if (!e.target.classList.contains('presets')) {
        this.$emit('close-preset', false)
      }
    },
    async createPreset() {
      if (!this.selectedFilterOptionsVuex.length) {
        this.notSelectedOptions = true
        return
      }
      const view_name = this.currentFilter.sysName === "cabinet" ? 'byCabinets'
          : this.currentFilter.sysName === 'spec' ? "byResource" : 'byDates'


      let data = {
        name: this.name,
        items: this.selectedFilterOptionsVuex.map(el => el.id),
        view_name
      }


            this.$store.commit('appoint/addPreset', data)

      this.$emit('close-preset', false)
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
