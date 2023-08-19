<template>
  <div class='grid-row__content'
       :style='[rowStyles.gridColumn, rowStyles.gridRows]'>

    <div class='content__row'
         :style='rowStyles.gridColumn'
         v-for='item in times'>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Row',
  props: ['columnsLength', 'rowLength', 'times'],
  computed: {
    rowStyles() {
      return {
        gridTemplateColumns: {
          // пока не понятно для чего этот стиль, нормально работал в html, после того как перенесла в компонент стала тупить сетка и я:)
          gridTemplateColumns: `repeat(${this.columnsLength + 1},  148px)`
        },
        gridColumn: {
          gridColumn: `1/${this.columnsLength + 1}`
        },
        gridRows: {
          gridTemplateRows: `repeat(${+this.rowLength + 1}, 60px)`
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
