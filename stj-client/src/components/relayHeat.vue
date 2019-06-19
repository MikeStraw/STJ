<template>
    <v-container fluid>
        <v-layout row>
            <v-flex row>
                <h4>Relay Heat {{heatNum}} of {{heatTotal}}</h4>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex>
                <v-data-table
                        :headers="headers"
                        :items="heatEntries"
                        hide-actions
                >
                    <!--props.item is a heat entry -->
                    <template v-slot:items="props">
                        <tr @click="selectEntry(props.item)">
                            <td>{{props.item.lane}}</td>
                            <td>
                                {{props.item.team}} {{relayTeamName(props.item.relay)}}<br>
                                <small>
                                    <span class="pr-3">{{relayNames(props.item.relay, 1)}}</span>
                                    <span class="pr-3">{{relayNames(props.item.relay, 2)}}</span>
                                    <span class="pr-3">{{relayNames(props.item.relay, 3)}}</span>
                                    <span >{{relayNames(props.item.relay, 4)}}</span>
                                </small>
                            </td>
                            <td>{{props.item.seed}}</td>
                            <td>{{props.item.final}}</td>
                        </tr>

                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: "relayHeat",
    data() {
        return {
            emptyAthlete: {'fname': '', 'lname': '', 'age': '', 'schoolYear': ''},
            heatEntries : [],
            selectedEntry: 0,

            headers: [
                {text: 'Lane', value: 'lane', sortable: false},
                {text: 'Team - Relay', value: 'team', sortable: false},
                {text: 'Seed', value: 'seed', sortable: false},
                {text: 'Final', value: 'final', sortable: false}
            ]
        }
    },
    props: ['entries', 'heatNum', 'heatTotal', 'numLanes', 'selectedHeat'],

    methods: {
        createEmptyEntry(lane) {
            return {'lane': lane, 'team': '', 'seed': '', 'final': '', 'relay': {'name': '', 'athletes': []}};
        },

        getEntryByLane(lane) {
            const laneEntry = this.entries.find(entry => entry.lane === lane);

            if (laneEntry) { return laneEntry; }
            else           { return this.createEmptyEntry(lane); }
        },

        getName(athlete) {
            if (athlete.lname) {
                return athlete.lname + ', ' + athlete.fname;
            }
            else {
                return '';
            }
        },

        relayNames(relay, relayMember) {
            console.log(relay);
            console.log(relayMember);
            const idx = relayMember - 1;

            if (relay && relay.athletes && relay.athletes.length > idx) {
                const name = relay.athletes[idx].fname + ' '  + relay.athletes[idx].lname;
                return `${relayMember}) ${name}`;
            }
            else {
                return '';
            }

        },

        relayTeamName(relay) {
            if (relay && relay.name) {
                return `' - ${relay.name}'`;
            }
            else {
                return '';
            }

        },

        selectEntry: function(entry) {
            console.log('selected entry ... lane=' + entry.lane);
            this.selectedEntry = entry.lane;
        }
    },

    created() {
        console.log(`heat.created, heat: ${this.heatNum}, entry.size=${this.entries.length}, numLanes=${this.numLanes}`);
        for (let i = 1; i <= this.numLanes; i++) {
            const entry = this.getEntryByLane(i);
            this.heatEntries.push(entry);
        }
        console.log(`heatEntries create with length=${this.heatEntries.length}`);
    }

}
</script>

<style scoped>

</style>