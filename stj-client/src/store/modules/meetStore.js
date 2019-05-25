import apiSvc from '../../services/api';
import meetSvc from '../../services/meet';

const state = {
    activeEvent: false, // reference to the active event within activeMeet
    activeMeet: false,  // The selected meet & session
    loading: false,     // true when retrieving meets from DB
    loadingError: '',   // contains data retrieval error message
    meets: []           // meets retrieved from DB
};

const getters = {

};

const actions = {
    // Clear out the meets and activeMeet cache
    clearMeets({ commit }) {
        commit('clearMeetData');
    },

    // Get all the events for the active meet
    async loadEvents({ commit, state }) {
        if (!state.activeMeet) {
            commit('dataRequestError', { code: 2, message: 'Error: No meet was selected.'});
            return false;
        }

        try {
            const meetId  = state.activeMeet._id;
            const sessNum = state.activeMeet.session.number;
            const response = await apiSvc.getEvents(meetId, sessNum);
            const events = response.data;
            console.log(`apiSvd.getEvents() returned with events.length=${events.length}`);

            commit('eventDataReceived', events);
            return true;
        }
        catch(err) {
            console.log('meetStore::loadEvents caught error!');
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
    },

    // Get the meets from the DB and store in the meets cache
    async loadMeets({ commit }) {
        commit('dataRequested');
        try {
            const response = await apiSvc.getMeets();
            const meets = response.data;
            console.log(`apiSvd.getMeets() returned with meets.length=${meets.length}`);
            commit('meetDataReceived', meets);
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
    },

    // setActiveMeet - Save a reference to the active meet and session
    //                 payload => { meetId, sessionNum }
    //                 Return true if we can find meet/session and false otherwise
    setActiveMeet({ commit }, payload) {

        console.log(`setting the active meet for ID: ${payload.meetId} and sess # ${payload.sessionNum}`);
        const meet = meetSvc.findMeetByIdAndSessionNum(state.meets, payload.meetId, payload.sessionNum);
        if (meet) {
            commit('setActiveMeet', meet);
            return true;
        }
        else {
            return false;
        }
    }
};

const mutations = {
    clearMeetData(state) {
        state.meets = [];
        state.activeMeet = false;
    },
    dataRequested(state) {
        state.loading = true;
        state.loadingError = '';
    },
    dataRequestError(state,  err) {
        state.loading = false;
        state.loadingError = `${err.code}: ${err.message}`;
    },
    eventDataReceived(state, payload) {
        state.loading = false;
        state.activeMeet.events = payload;
    },
    meetDataReceived(state, payload) {
        state.loading = false;
        state.meets = payload;
    },
    setActiveMeet(state, payload) {
        state.activeMeet = payload;
    }
};

export const meetStore = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
