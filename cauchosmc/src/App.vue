<template>
  <router-view/>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  methods:{
    ...mapActions(['leerToken'])
  },
  created() {
    this.leerToken()
  },
}
</script>
<style lang="scss">
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;*/
}
</style>
