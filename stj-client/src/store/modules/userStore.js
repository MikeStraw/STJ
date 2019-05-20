const USER_KEY = 'official';

const state = {
    user: {}
};

const getters = {
    user: state => {
        return state.user;
    }
};

const actions = {
    remove({ commit }) {
        localStorage.removeItem(USER_KEY);
        commit('remove');
    },

    save({ commit }, user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        commit('save', user);
    }
};

const mutations = {
    remove(state) {
        state.user = {};
    },

    save(state, user) {
        state.user = user;
    }
};

export const userStore = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
