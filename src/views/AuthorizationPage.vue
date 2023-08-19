<template>
  <div class="authorization-block">
    <div class="pa-4 d-flex justify-end" style="gap: var(--spacing-xxm)">
      <locale-btn></locale-btn>
      <theme-btn></theme-btn>
    </div>
    <v-form
        ref="form"
        lazy-validation
        class="auth__form"
    >
      <v-text-field
          v-model="name"
          :label="$t('Имя')"
          :rules="nameRules"
          required
      ></v-text-field>

      <v-text-field
          v-model="password"
          label="Password"
          :rules="passwordRules"
          required
      ></v-text-field>


      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
        <v-btn
            :rules="nameRules"
            color="success"
            @click="login"
            v-bind="attrs"
            v-on="on"
        >
          {{ $t('Войти') }}
        </v-btn>
        </template>

        <span> {{titleBtn}}</span>
      </v-tooltip>
    </v-form>
  </div>
</template>

<script>
import ThemeBtn from "@/components/ThemeBtn.vue";
import LocaleBtn from "@/components/LocaleBtn.vue";
import {mapState} from "vuex";

export default {
  components: {
    ThemeBtn,
    LocaleBtn
  },
  data: () => ({
    name: '',
    password: '',
    nameRules: [
      v => !!v || 'Name is required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
    ],
  }),
  mounted() {
      if (this.auth) {
        this.$router.push({name: 'main'})
      }
  },
  computed: {
    ...mapState({
      auth: ({auth}) => auth
    }),
    disabledBtn() {
      return !this.name || !this.password
    },
    titleBtn() {
      return this.disabledBtn ? 'Введите любые символы' : 'Отлично! Жми кнопку!'
    }
  },
  methods: {
    login() {
      this.$refs.form.validate()

      if (this.name && this.password) {
        localStorage.setItem('auth', 'true')
        this.$store.commit('updatePayload', {option: 'auth', payload: true})
        this.$router.push({name: 'main'})
      }
    },
  },
}
</script>

<style >
div.v-messages__message,
 .error--text {
  color: #b71c1c !important
}
</style>