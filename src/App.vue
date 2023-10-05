<template>
  <div>
    <v-app data-app>
      <router-view name="default" />
      <vue-confirm-dialog></vue-confirm-dialog>
      <v-dialog v-model="cargando" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Cargando...
            <!--({{refCount}})-->
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import { mapState } from 'vuex'
/* eslint-disable */
export default {
  data() {
    return {
          dialogCargando: false,
          Unauthorized:true,
    }
  },
  computed: {
    ...mapState(['isLoading', 'refCount']),
    cargando() {
      return this.$store.state.loading.isLoading;
    },
    refCount() {
      return this.$store.state.loading.refCount;
    },
  },
  created() {
    this.axios.interceptors.request.use((config) => {
      this.$store.commit('loading', true);
      return config;
    }, (error) => {
      if (error != undefined) {
        if (error.response != undefined) {
          if (error.response.data != undefined) {
            if (this.Unauthorized && error.response.data.error != undefined && error.response.status != undefined && error.response.data.error == "Unauthorized" && error.response.status == 401) {
              this.$store.commit('loading', false);
              this.logOut();
              this.$toasts.clear();
              if (this.Unauthorized) {
                this.Unauthorized = false;
                this.$toasts.push({ type: 'error', message: 'La sesión caduco.' });
              }
            }
          }
        }
      }
      this.$store.commit('loading', false);
      return Promise.reject(error);
    });

    this.axios.interceptors.response.use((response) => {
      this.$store.commit('loading', false);
      return response;
    }, (error) => {
      if (error != undefined) {
        if (error.response != undefined) {
          if (error.response.data != undefined) {
            if (this.Unauthorized && error.response.data.error != undefined && error.response.status != undefined && error.response.data.error == "Unauthorized" && error.response.status == 401) {
              this.$store.commit('loading', false);
              this.logOut();
              this.$toasts.clear();
              if (this.Unauthorized) {
                this.Unauthorized = false;
                this.$toasts.push({ type: 'error', message: 'La sesión caduco.' });
              }
            }
          }
        }
      }
      this.$store.commit('loading', false);
      return Promise.reject(error);
    });
  },
  methods: {

  },
};
</script>
<style>
.v-data-table-header {
  background: rgb(26, 58, 103);
}

th,
.v-data-table-header__icon {
  color: white !important;
  ;
}
.spacer.line {
    height: 1px;
    border-bottom: 1px solid;
    border-bottom-color: rgb(26 58 103 / 15%);
    margin-top: 40px;
    margin-bottom: 40px;
}
.spacer.lineTabla {
  height: 1px;
    border-bottom: 1px solid;
    border-bottom-color: rgb(26 58 103 / 15%);
}
</style>
