<template>
    <v-container fluid>
        <v-layout row>
            <v-flex mt-3>
                <h3>Meet List</h3>
                <p v-if="loadingError" class="red--text text--darken-3 subheading">Error: {{loadingError}}</p>
                <p v-else-if="loading" class="blue-text">Loading meets from server ...</p>
                <p v-else-if="meets.length > 0">Click on a session to begin.</p>
                <p v-else class="font-italic"> No meets available.</p>
            </v-flex>
        </v-layout>
        <v-layout row v-for="meet in meets" :key="meet._id">
            <v-flex>
                <v-card flat class="ma-2">
                    <v-card-title class="ml-1 subheading font-weight-medium">
                        <v-layout>
                            <v-flex xs9>{{meet.name}}</v-flex>
                            <v-flex xs3 text-xs-right>{{meet.date | stripTime}}</v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-card-text class="ml-2">
                        <v-data-table :headers="headers"
                                      :items="meet.sessions"
                                      hide-actions>
                            <template v-slot:items="props">
                                <tr @click="selectMeet(meet, props.item)">
                                    <td>{{props.item.number}}</td>
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.day}}</td>
                                    <td>{{props.item.time}}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import eventBus from '../services/eventBus';
import { mapState } from 'vuex';

export default {
    name: 'meets',
    data: () => ({
        headers: [
            {text: '#', value: 'number', sortable: false},
            {text: 'Session Name', value: 'name', sortable: false},
            {text: 'Day', value: 'day', sortable: false},
            {text: 'Time', value: 'time', sortable: false}
        ]
    }),
    computed: {
        ...mapState({
            loading: state => state.meet.loading,
            loadingError: state => state.meet.loadingError,
            meets: state => state.meet.meets
        })
    },
    filters: {
        // strip the time and timezone info from timestamp string
        stripTime(value) {
            if (value.length > 10) return value.substring(0, 10);
            else                   return value;
        }
    },
    methods: {
        async loadMeets() {
            const rc = await this.$store.dispatch('meet/loadMeets');
            console.log(`dispatch(meet/loadMeets) returns ${rc}.`);
        },
        logout() {
            console.log('meets.vue: logout called.');
            this.$store.dispatch('meet/clearMeets');
        },
        selectMeet(meet, session){
            const meetId = meet._id;
            const sessNum = session.number;
            console.log(`calling dispatch(meet/setActiveMeet, { ${meetId}, ${sessNum} })` );
            if (this.$store.dispatch('meet/setActiveMeet', { meetId: meetId, sessionNum: sessNum })) {
                this.$router.push('/events');
            }
        }
    },
    created() {
        this.loadMeets();
        eventBus.$on('LOGOUT', this.logout);
    },
    watch: {
        '$route': 'loadMeets'
    },
};
</script>
