const cartModule = {
  namespaced: true,
  state: {
    cartItems: [],
    itemsCount: 0,
    itemsPrice: 0,
    taxPrice: 0,
  },
  mutations: {
    ADD(state, item) {
      const existItem = state.cartItems.find((x) => x.name === item.name);
      state.cartItems = existItem
        ? state.cartItems.map((x) => (x.name === existItem.name ? item : x))
        : [...state.cartItems, item];

      state.itemsCount = state.cartItems.reduce((a, c) => a + c.quantity, 0);
      state.itemsPrice = state.cartItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      state.taxPrice = Math.round(0.15 * state.itemsPrice * 100) / 100;
    },
    REMOVE(state, item) {
      state.cartItems = state.cartItems.filter((x) => x.name !== item.name);
      state.itemsCount = state.cartItems.reduce((a, c) => a + c.quantity, 0);
      state.itemsPrice = state.cartItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      state.taxPrice = Math.round(0.15 * state.itemsPrice * 100) / 100;
    },
  },

  actions: {
    add({ commit }, item) {
      commit('ADD', item);
    },
    remove({ commit }, item) {
      commit('REMOVE', item);
    },
  },
};
export default cartModule;
