import { Spinner } from "./UI/Spinner/Spinner.js";
import { search as searchIcon } from "../helpers/icons.js";

export const Search = {
  props: ["placeholder", "search", "loading"],
  data() {
    return {
      searchIcon,
      searchStr: this.search,
    };
  },
  components: {
    spinner: Spinner,
  },
  mounted() {
    if (this.$refs.search) {
      this.$refs.search.focus();
    }
  },
  methods: {},
  watch: {
    searchStr(val) {
      this.$emit("update-search", val);
    },
  },
  template: `<div class='search-component'>
                 <div class='custom-search'>
                      <input type='text' 
                              ref='search'
                              class='form-input' 
                              :placeholder='placeholder'
                              v-model='searchStr'
                              @focus='$emit("focus-handler", $event)'
                        >
                        <div class='custom-search__status'>
                            <spinner v-if='loading'></spinner>
                            <div v-else 
                                 class="mt-1"
                                 v-html='searchIcon'></div>
                        </div>
                  </div>
                  
            </div>
  `,
};
