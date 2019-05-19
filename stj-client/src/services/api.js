import axios from 'axios';
import tokenSvc from '../services/token';

const ApiService = {
    init(baseURL) {
        axios.defaults.baseURL = baseURL;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
    },

    addAuthHeader(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    removeAuthHeader() {
        delete axios.defaults.headers.common['Authorization'];
    },

    getHeats(eventId) {
        return axios.get(`/event/${eventId}/heats`);
    },

    getEvents(meetId, sessionNumber) {
        return axios.get(`/meet/${meetId}/session/${sessionNumber}/events`);
    },

    getMeets() {
        return axios.get('/meets');
    },

    // login does not prefix the URL with /api
    login(user) {
        const nonApiUrl = axios.defaults.baseURL.replace(/\/api/, '');
        return axios.post(`${nonApiUrl}/login`, user);
    }
};

export default ApiService;
