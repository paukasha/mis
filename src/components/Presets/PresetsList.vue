<template>
  <div class='presets'
       v-click-outside.self='closePresets'
  >
    <div >
      <ul class='presets__list'>
        <li v-for='item in filteredPresets'
            :key='item.id'
            class='presets__item'
        >
                        <span @click="setPreset(item)"
                              style='cursor: pointer'>{{ item.name }}</span>
          <span v-html='cross'
                class='cross'
                @click='deletePreset(item.id)'
          ></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { cross } from "@/helpers/icons.js";
import {
  mapGetters,
  mapMutations,
  mapState,
} from "vuex";
export default {
  name: 'PresetsList',
  data() {
    return {
      cross,
    };
  },
  watch: {
    filteredPresets: {
      handler(val) {
        if (!val.length) {
          this.$emit("close-preset", false);
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters('appoint',["filteredPresets"]),
    ...mapState({
      currentFilter: (state) => state.currentFilter,
    }),
  },
  methods: {
    ...mapMutations(["updatePayload"]),
    deletePreset(id) {
        this.$store.commit("appoint/filterPreset", id);
    },
    closePresets(e) {
      if (!e.target.classList.contains("presets")) {
        this.$emit("close-preset", false);
      }
    },
    setPreset(preset) {
      let items = preset.items.map((el) => +el);
      this.$emit("update-options", items);
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
