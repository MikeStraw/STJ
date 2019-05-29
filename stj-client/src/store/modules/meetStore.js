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
    clearEvents({ commit }) {
        commit('clearEventData');
    },

    // Clear out the meets and activeMeet cache
    clearMeets({ commit }) {
        commit('clearMeetData');
    },

    // loadEntries - Get all the entries for a specific event identified by the event ID
    //               payload => eventId
    async loadEntries({ commit, state }, payload) {
        if (!state.activeEvent) {
            commit('dataRequestError', { code: 3, message: 'Error: No event was selected.'});
            return false;
        }

        try {
            const eventId  = payload.eventId;
            const response = await apiSvc.getEntries(eventId);
            const entries = response.data;
            console.log(`apiSvd.getEntries() returned with entries.length=${entries.length}`);

            commit('entryDataReceived', entries);
            return entries;
        }
        catch(err) {
            console.log('meetStore::loadEntries caught error!');
            console.log(err);
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

    // setActiveEvent - Save a reference to the active event identified by the event ID.
    //                  payload => {event}
    setActiveEvent({ commit }, payload) {
        const eventId = payload._id;
        const event = meetSvc.findEventById(state.activeMeet, eventId);
        console.log(`meetStore.setActiveEvent for eventId=${eventId} returns meet %o`, event);
        if (event) {
            commit('setActiveEvent', event);
            return true;
        }
        else {
            console.log('meetStore.setActiveEvent failed, no event found.');
            return false
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
            console.log('meetStore.setActiveMeet failed, no meet found.');
            return false;
        }
    }
};

const mutations = {
    clearEventData(state) {
        state.activeEvent = false;
    },
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
    entryDataReceived(state, payload) {
        state.loading = false;
        // THIS DOES NOT SEEM TO BE REACTIVE, AND NEITHER WAS USING Vue.set()
        // Vue.set(state.activeEvent, 'heats', payload);
        state.activeEvent.heats = payload;
    },
    eventDataReceived(state, payload) {
        state.loading = false;
        state.activeMeet.events = payload;
    },
    meetDataReceived(state, payload) {
        state.loading = false;
        state.meets = payload;
    },
    setActiveEvent(state, payload) {
        state.activeEvent = payload;
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
