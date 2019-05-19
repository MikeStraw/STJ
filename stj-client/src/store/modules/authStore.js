import { UserService, AuthenticationError } from '../../services/user';
import tokenSvc from '../../services/token';
import router from '../../router';

const state = {
    authenticating: false,
    accessToken: tokenSvc.getToken(),
    authenticationErrorCode: 0,
    authenticationError: ''
};

const getters = {
    loggedIn: state => {
        return state.accessToken ? true : false;
    },

    authenticationErrorCode: state => {
        return state.authenticationErrorCode;
    },

    authenticationError: state => {
        return state.authenticationError;
    },

    authenticating: state => {
        return state.authenticating;
    }
};

const actions = {
    clearError({ commit }) {
        commit('clearError');
    },
    async login({ commit }, { first, last, pin }) {
        console.log('authStore.js: action - login');
        commit('loginRequest');

        try {
            const token = await UserService.login(first, last, pin);
            commit('loginSuccess', token);

            return true;
        } catch (e) {
            console.log(' ... caught error: ');
            console.log(e);
            if (e instanceof AuthenticationError) {
                commit('loginError', { errorCode: e.errorCode, errorMessage: e.message });
            }
            else if (!e.response) {
                commit('loginError'), { errorCode: 1, errorMessage: 'Error: connecting to the server.'};
            }
            else {
                commit('loginError', { errorCode: e.response.status, errorMessage: e.response.statusText });
            }

            return false;
        }
    },

    logout({ commit }) {
        UserService.logout();
        commit('logoutSuccess');
        router.push('/');
    }
};

const mutations = {
    clearError(state) {
        state.authenticating = false;
        state.authenticationError = '';
        state.authenticationErrorCode = 0;
    },

    loginRequest(state) {
        state.authenticating = true;
        state.authenticationError = '';
        state.authenticationErrorCode = 0;
    },

    loginSuccess(state, accessToken) {
        state.accessToken = accessToken;
        state.authenticating = false;
    },

    loginError(state, { errorCode, errorMessage }) {
        state.authenticating = false;
        state.authenticationErrorCode = errorCode;
        state.authenticationError = errorMessage;
    },

    logoutSuccess(state) {
        state.accessToken = '';
    }
};

export const authStore = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
