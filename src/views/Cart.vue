<template>
  <v-container>
    <v-dialog v-model="isOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ product.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  :items="quantities"
                  label="Quantity"
                  required
                  v-model="quantity"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="removeFromCart(product)">
            {{ isProductInCart ? "Remove" : "Cancel" }}
          </v-btn>
          <v-btn color="blue darken-1" text @click="addToCart()"> Add </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h1 class="text-h3">Order Items</h1>
    <v-alert v-if="cartItems.length === 0" dense outlined type="error"
      >Cart is empty</v-alert
    >

    <v-simple-table v-else>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Quantity</th>
            <th class="text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in cartItems"
            :key="item.name"
            @click="showModal(item)"
          >
            <td>{{ item.name }}</td>
            <td>
              {{ item.quantity }}
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
            <td>${{ item.price }}</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <div class="text-h5">Subtotal: ${{ itemsPrice }}</div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td>
              <v-btn
                :disabled="itemsPrice == 0"
                @click="proceed"
                depressed
                color="primary"
              >
                Choose your location
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    quantity: "1",
    quantities: [...Array(10).keys()].map((x) => `${x + 1}`),
    product: {},
    products: [],
    isOpen: false,
    snackbar: false,
  }),
  computed: {
    isProductInCart() {
      return this.$store.state.Cart.cartItems.find(
        (x) => x.name === this.product.name
      );
    },
    cartItems() {
      return this.$store.state.Cart.cartItems;
    },
    itemsPrice() {
      return this.$store.state.Cart.itemsPrice;
    },
  },
  methods: {
    async fetch() {
      const { data } = await axios.get(`/api/products`);
      this.products = data;
    },
    showModal(product) {
      this.product = product;
      this.isOpen = true;
    },
    addToCart() {
      this.$store.dispatch("Cart/add", {
        ...this.product,
        quantity: Number(this.quantity),
      });
      this.isOpen = false;
      this.snackbar = true;
    },
    removeFromCart() {
      this.$store.dispatch("Cart/remove", this.product);
      this.isOpen = false;
    },
    proceed() {
      this.$router.push("/location");
    },
  },
  mounted() {
    this.fetch();
  },
};
</script> 