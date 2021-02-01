<template>
  <v-app>
    <v-app-bar class="header" dense dark>
      <v-toolbar-title>
        <router-link to="/">Food Delivery App</router-link></v-toolbar-title
      >

      <v-spacer></v-spacer>

      <v-badge
        color="red"
        :content="cartItemsCount"
        offset-x="20"
        offset-y="20"
        v-if="cartItemsCount"
      >
        <router-link to="/cart"
          ><v-btn icon>
            <v-icon>mdi-basket</v-icon>
          </v-btn></router-link
        >
      </v-badge>
      <router-link v-else to="/cart"
        ><v-btn icon>
          <v-icon>mdi-basket</v-icon>
        </v-btn>
      </router-link>

      <!-- <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-app-bar>
    <v-sheet>
      <router-view></router-view>
    </v-sheet>
  </v-app>
</template>
<script>
export default {
  name: "App",
  computed: {
    cartItemsCount() {
      return this.$store.state.Cart.itemsCount;
    },
  },
};
</script>
<style scoped>
.header {
  max-height: 48px;
}
.header a {
  color: white;
  text-decoration: none;
}
</style>