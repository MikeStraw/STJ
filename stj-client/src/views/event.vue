<template>
    <v-container fluid>
        <v-layout row>
            <v-flex mt-3>

                <h5>{{meet.name}} - {{meet.session.name}}</h5>
                <h4 class="mt-2">Event {{event.number}} - {{event.desc}}</h4>

                <p v-if="loadingError" class="red--text text--darken-3 subheading mt-2">{{loadingError}}</p>
                <p v-else-if="loading" class="blue-text">Loading entries from server ...</p>

                <p v-if="numberOfHeats === 0">No entry information available.</p>
                <relayHeat v-else-if="isRelayEvent"
                      v-for="i in numberOfHeats"
                      v-bind:key="heats[i-1]._id"
                      v-bind:entries="heats[i-1].entries"
                      v-bind:heat-num="i"
                      v-bind:selected-heat="currentHeat"
                      v-bind:heat-total="numberOfHeats">
                </relayHeat>
                <heat v-else
                      v-for="i in numberOfHeats"
                      v-bind:key="heats[i-1]._id"
                      v-bind:entries="heats[i-1].entries"
                      v-bind:heat-num="i"
                      v-bind:selected-heat="currentHeat"
                      v-bind:heat-total="numberOfHeats">
                </heat>

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import heat from '../components/heat';
import relayHeat from '../components/relayHeat';
import { mapState } from 'vuex';

export default {
    name: "event",
    components: {heat, relayHeat},
    data() {
        return {
            currentHeat: 0,
            heats: [],
            selectedEntry: 0
        }
    },
    computed: {
        ...mapState({

            event: state => state.meet.activeEvent,
            //heats: state => state.meet.activeEvent.heats,  // THIS WAS NOT REACTIVE FOR SOME REASON.
            loading: state => state.meet.loading,
            loadingError: state => state.meet.loadingError,
            meet: state => state.meet.activeMeet
        }),
        isRelayEvent() {
            if (this.event.desc.indexOf('Relay') !== -1)
                return (true);
            else
                return (false);
        },
        numberOfHeats() {
            return this.heats.length;
        }

    },
    methods: {
        async loadEntries() {
            const eventId = this.$route.params.eventId;
            console.log(`Event::loadEntries eventId: ${eventId}`);

            const heats = await this.$store.dispatch('meet/loadEntries', { eventId: eventId });
            if (heats) {
                this.currentHeat = 1;
                this.heats = heats;
                console.log(`local heats.length as ${this.heats.length}`);
            }
        }
    },
    created() {
        this.loadEntries();
    },
    watch: {
        '$route': 'loadEntries'
    }
};
</script>

<style scoped>

</style>