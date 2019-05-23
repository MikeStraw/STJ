import apiSvc from '../../services/api';

const state = {
    activeMeet: false,  // reference to the selected meet & session
    loading: false,     // true when retrieving meets from DB
    loadingError: '',   // contains data retrieval error message
    meets: []           // meets retrieved from DB
};

const getters = {

};

const actions = {
    // Get the meets from the DB and store in the meets cache
    async loadMeets({commit}) {
        commit('dataRequested');
        try {
            const response = await apiSvc.getMeets();
            const meets = response.data;
            console.log(`apiSvd.getMeets() returned with meets.length=${meets.length}`);
            commit('dataReceived', meets);
            return true;
        }
        catch(err) {
            console.log('meetStore::loadMeets caught error!');
            //console.log(err);
            if (!err.response) {
                commit('dataRequestError', { code: 1, message: 'Error: connecting to the server.'});
            }
            else {
                //err.reponse.status, err.response.data.message, err.response.statusText
                commit('dataRequestError', { code: err.response.status, message: err.response.data.message });
            }
            return false;
        }
    }
};

const mutations = {
    dataReceived(state, payload) {
        state.loading = false;
        state.meets = payload;
    },
    dataRequested(state) {
        state.loading = true;
        state.loadingError = '';
    },
    dataRequestError(state,  err) {
        state.loading = false;
        state.loadingError = `${err.code}: ${err.message}`;
    }
};

export const meetStore = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
