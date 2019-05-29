<template>
    <div>
        <h5>Heat {{heatNum}} of {{heatTotal}}</h5>
        <table>
            <thead>
            <tr>
                <th>Lane</th>
                <th>Name</th>
                <th>Year</th>
                <th>School</th>
                <th>Seed</th>
                <th>Final</th>
            </tr>
            </thead>
            <tbody >
            <tr
                v-for="lane in numLanes"
                v-bind:key="lane">
                <td>{{lane}}</td>
                <td>Name goes here</td>
                <td>YR</td>
                <td>school here</td>
                <td>seed time</td>
                <td>final time</td>
            </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
export default {
    name: "heat",
    data() {
        return {
            emptyAthlete: {'fname': '', 'lname': '', 'age': '', 'schoolYear': ''},
            lanes: new Map(),
            numLanes: 6,
            selectedEntry: 0
        }
    },
    props: ['entries', 'heatNum', 'heatTotal', 'isRelay', 'selectedHeat']
}
</script>

<style scoped>

</style>