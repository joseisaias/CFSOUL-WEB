<template>
<div id="home">
    Bienvenido: {{ user.username }}
</div>
</template>
<script>
/* eslint-disable */

const $ = require('jquery');
const jQuery = require('jquery');

export default {
  name: 'Home',
  components: {
  },
  computed: {
    currentUser () {
      const user = this.$store.state.auth.user
      return user
    }
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {

  }
};

</script>

<style scoped>
</style>
