<template>
<div class="menu">
    <v-navigation-drawer v-model="drawer" permanent color="rgb(26 58 103)" dark :style="'min-height: 100 hv;'+'max-height: ' + (maxHeight-100) + 'px'">
        <v-list-item class="px-2">
            <v-list-item-avatar>
                <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
            </v-list-item-avatar>

            <v-list-item-title>{{ currentUser.persona.nombre }}</v-list-item-title>
        </v-list-item>
        <v-list-item  style="margin-top: -30px; margin-left: 50px;">
                <v-list-item-content>
                    <v-list-item-title><a @click.prevent="cerrarSesion()">Cerrar Sesión</a></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item class="itemList" v-bind:class="[itemActive == 'home' ? 'itemSelect':'']" @click.prevent="selectMenu('home')">
                <v-list-item-icon>
                    <v-icon>mdi mdi-home-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Inicio</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item class="itemList" v-bind:class="[itemActive == 'solicitudCredito' ? 'itemSelect':'']" @click.prevent="selectMenu('solicitudCredito')">
                <v-list-item-icon>
                    <v-icon>mdi mdi-currency-usd</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Solicitud credito</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item class="itemList" v-bind:class="[itemActive == 'cliente' ? 'itemSelect':'']" @click.prevent="selectMenu('cliente')">
                <v-list-item-icon>
                    <v-icon>mdi mdi-account-tie</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Clientes</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item class="itemList" v-bind:class="[itemActive == 'usuario' ? 'itemSelect':'']" @click.prevent="selectMenu('usuario')">
                <v-list-item-icon>
                    <v-icon>mdi mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Usuarios</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item class="itemList" v-bind:class="[itemActive == 'conciliacion' ? 'itemSelect':'']" @click.prevent="selectMenu('conciliacion')">
                <v-list-item-icon>
                    <v-icon>mdi mdi-handshake</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Conciliación</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item class="itemList" v-bind:class="[itemActive == 'seguimiento' ? 'itemSelect':'']" @click.prevent="selectMenu('seguimiento')">
                <v-list-item-icon>
                    <v-icon>mdi mdi-cached</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Seguimiento</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item class="itemList" v-bind:class="[itemActive == 'admin' ? 'itemSelect':'']" @click.prevent="selectMenu('admin')">
                <v-list-item-icon>
                    <v-icon>mdi mdi-account-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Admin</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</div>
</template>
<script>
/* eslint-disable */
const $ = require('jquery');
const jQuery = require('jquery');

export default {
  name:'menuUsuario',
  props: {
    maxHeight:Number
  },
    computed: {
        currentUser() {
            const user = this.$store.state.auth.user
            return user
        }
    },
    data() {
        return {
            drawer: true,
            mini: false,
            itemActive: 'home'
        }
    },
    mounted() {
        if (!this.currentUser) {
            this.$router.push("/login");
        }
    },
    methods: {
        selectMenu(selectMenu) {
          this.itemActive = selectMenu;
          this.$emit("selectMenu", selectMenu)
        },
        cerrarSesion() {
            this.$store.dispatch("auth/logout");
            this.$router.push("/login");
        }
    }
};
</script>

<style scoped>
.itemList.v-list-item:hover {
    background: #005ca5;
}

.itemList.v-list-item.itemSelect
 {
    background: #005ca5;
}

.v-list-item {
    margin-bottom: 10px;
}

.itemList.v-list-item{
  cursor: pointer;
}

.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
    margin-right: 14px !important;
}

.v-list-item__title {
    font-size: 14px !important;
    line-height: 24px !important;
}

.menu {
    min-width: 60px;
    max-width: 200px;
    float: left;
    background: rgb(26,58,103);
}

.v-divider {
    border-color: hsl(0deg 0% 100%);
    border-width: 1px;
}
</style>
