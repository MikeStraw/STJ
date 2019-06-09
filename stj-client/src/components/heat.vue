<template>
    <v-container v-if="isCurrentHeat" fluid>
        <v-layout row>
            <v-flex row>
                <h4>Heat {{heatNum}} of {{heatTotal}}</h4>
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
                            <td>{{getName(props.item.athlete)}}</td>
                            <td>{{getAthleteValue(props.item.athlete, 'schoolYear')}}</td>
                            <td>{{props.item.team}}</td>
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
    name: "heat",
    data() {
        return {
            emptyAthlete: {'fname': '', 'lname': '', 'age': '', 'schoolYear': ''},
            heatEntries: [],
            numLanes: 6,   // TODO:  should be prop
            selectedEntry: 0,

            headers: [
                {text: 'Lane', value: 'lane', sortable: false},
                {text: 'Name', value: 'fullName', sortable: false},
                {text: 'Year', value: 'schoolYear', sortable: false},
                {text: 'School', value: 'team', sortable: false},
                {text: 'Seed', value: 'seed', sortable: false},
                {text: 'Final', value: 'final', sortable: false},
            ]
        }
    },
    props: ['entries', 'heatNum', 'heatTotal', 'selectedHeat'],
    computed: {
        isCurrentHeat() {return this.selectedHeat === this.heatNum }
    },
    methods: {
        createEmptyEntry(lane) {
            return {'lane': lane, 'team': '', 'seed': '', 'final': '', 'athlete': this.emptyAthlete};
        },

        getEntryByLane(lane) {
            const laneEntry = this.entries.find(entry => entry.lane === lane);

            if (laneEntry) { return laneEntry; }
            else           { return this.createEmptyEntry(lane); }
        },

        getAthleteValue(athlete, val) {
            if (athlete &&  athlete[val]) {return athlete[val];}
            else                          { return ''; }
        },

        getName(athlete) {
            if (athlete.lname) {return athlete.lname + ', ' + athlete.fname;}
            else               {return '';}
        },

        selectEntry: function(entry) {
            console.log('selected entry ... lane=' + entry.lane);
            this.selectedEntry = entry.lane;
        }
    },

    created() {
        console.log(`heat.created, heat: ${this.heatNum}, entry.size=${this.entries.length}, numLanes=${this.numLanes}`);
        for (let i=1; i<=this.numLanes; i++) {
            const entry = this.getEntryByLane(i);
            this.heatEntries.push(entry);
        }
        console.log(`heatEntries created with length=${this.heatEntries.length}`);
    }
}
</script>

<style scoped>

</style>
