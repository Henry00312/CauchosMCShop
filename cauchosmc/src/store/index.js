import { createStore } from 'vuex'

export default createStore({
  state: {
    token: null,
    tokenExp: null
  },
  mutations: {
    setToken(state, { tokn, exp }) {
      state.token = tokn
      state.tokenExp = exp
    },
    clearToken(state) {
      state.token = null
      state.tokenExp = null
    }
  },
  actions: {
    async login({ commit }, usuario) {
      try {
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario)
        }
        const res = await fetch(`${process.env.VUE_APP_API_URL}/api/login`, options);
        const result = await res.json();

        if (!res.ok || !result.token || !result.expiration) {
          throw new Error('Login fallido o respuesta inválida');
        }

        const auxToken = result.token;
        const auxExp = result.expiration;
        localStorage.setItem('token', auxToken)
        localStorage.setItem('tokenExp', auxExp)
        const obj = { tokn: auxToken, exp: auxExp }
        commit('setToken', obj)
      } catch (error) {
        console.log(error)
      }
    },
    leerToken({ commit }) {

      const token = localStorage.getItem('token');
      const tokenExp = localStorage.getItem('tokenExp');

      if (!token || !tokenExp || Date.now() > parseInt(tokenExp)) {
        commit('clearToken');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExp');
        return;
      }

      commit('setToken', { tokn: token, exp: tokenExp });

    },
    logOut({ commit }) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExp')
      commit('clearToken')
    }
  },
  getters: {

  },
  modules: {

  }
})
