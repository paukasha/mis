import { menuIcons } from "../helpers/icons.js";
import { mapMutations } from "../libs/vuex.esm.browser.js";

export const Menu = {
  props: ["list", "className", "styles"],
  delimiters: ["#{", "}"],
  data() {
    return {
      menuIcons,
    };
  },
  methods: {
    ...mapMutations("modal", ["openModal"]),
    ...mapMutations("panels", ["closePanel", "openPanel"]),
    emitMenuEvent(sysName) {
      this.$emit("close-menu", false);

      if (sysName === "templates") {
        this.$store.commit("modal/openModal", "isMcTemplateModalOpened");
      }

      if (sysName === "forward") {
        this.$store.commit("panels/closePanel", "isCurrentDialogOpened");
        this.$store.commit("panels/openPanel", "isMcOpened");
      }
    },
    fileHandler(e) {
      //TODO доделать логику по отправке файлов
      if (!e.target.files.length) {
        return;
      }

      const files = Array.from(e.target.files);

      let asd = [];

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          let { name, size } = file;
          asd.push({ name, size, type: "file" });
          // this.$store.commit("messageCenter/updateQuot", {
          //   name,
          //   size: (size * 0.001).toFixed(1),
          //   type: "file",
          // });
          // this.$store.commit("messageCenter/toggleReplyBlock", true);
        };
        reader.readAsDataURL(file);
      });
    },
    logout() {
      let auth = localStorage.getItem('auth')
      if (auth) {
        localStorage.setItem('auth', 'false')
        auth = localStorage.getItem('auth')
        this.$store.commit('updatePayload', {option: 'auth', payload: false})
        this.$router.push({name: 'auth'}).catch(e => console.log(e))
      }
    }
  },
  template: `<ul class='menu-list'
                  :class="className"
                  :style='styles'
  >
                <li class='menu-item'
                    :class='{"menu-item-forward": item.sysName == "forward"}'
                    
                    v-for='item in list'
                    :key='item.sysName'
                    @click='emitMenuEvent(item.sysName)'
                >
                <input type='file'
                      multiple 
                       v-if='item.sysName === "file"'
                       @change='fileHandler($event)'
                       >
                <span v-if='item.icon'
                      v-html='menuIcons[item.icon]'></span>
                      <span style="color: var(--color-azure-radiance)" v-if='item.sysName == "user_data"'>#{item.text}</span>
                      
                      <span v-else-if='item.sysName == "exit"' 
                            style="color: var(--color-alizarin-crimson)" 
                            @click="logout"
                            >#{item.text}</span>
                     
                 <span class='text-md-500' 
                        v-else
                       >#{item.text}</span>
              </li>
            </ul>`,
};
