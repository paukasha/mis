export const TextBtnMixin = {
  delimiters: ['#{', '}'],
  computed: {
    submitBtnText() {
      return this.localData.isAppointEdit ? 'Изменить' : 'Добавить'
    }
  },
}