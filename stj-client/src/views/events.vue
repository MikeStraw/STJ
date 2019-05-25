<template>
    <v-container fluid>
        <v-layout row>
            <v-flex mt-3>
                <h3>Event List</h3>
                <p v-if="loadingError" class="red--text text--darken-3 subheading">Error: {{loadingError}}</p>
                <p v-else-if="loading" class="green-text">Loading meets from server ...</p>
                <p v-else-if="events.length > 0">Click on an event to see the entries.</p>
                <p v-else class="font-italic"> No meets available.</p>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex>
                <v-data-table :headers="headers"
                              :items="events"
                              hide-actions>
                    <template v-slot:items="props">
                        <tr @click="selectEvent(props.item)">
                            <td>{{props.item.number}}</td>
                            <td>{{props.item.desc}}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "events",
    data: () => ({
        headers: [
            {text: 'Evt. #', value: 'number', sortable: false},
            {text: 'Event Description', value: 'desc', sortable: false}
        ],
        selectedEvent: ''
    }),
    computed: {
        ...mapState({
            loading: state => state.meet.loading,
            loadingError: state => state.meet.loadingError,
            events: state => state.meet.activeMeet.events
        })
    },
    methods: {
        async loadEvents() {
            console.log('events.vue::loadEvents called.');
            const rc = await this.$store.dispatch('meet/loadEvents');
            console.log(`dispatch(meet/loadEvents) returns ${rc}.`);
        },
        logout() {
            console.log('events.vue::logout called.');
            //this.$store.dispatch('meet/clearMeets');
        },
        selectEvent(event){
            this.selectEvented = event._id;
            console.log(`selected event ... num=${event.number}, id=${event._id}`);
        }
    },
    created() {
        this.loadEvents();
    },
    watch: {
        '$route': 'loadEvents'
    },
}
</script>
