const userModule = {
  namespaced: true,
  state: {
    user: { name: 'Guest' },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
  },

  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
  },
};
export default userModule;
