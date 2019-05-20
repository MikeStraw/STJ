<template>
    <v-container fluid>
        <v-layout row text-xs-center wrap indigo>
            <v-flex xs12>
                <h1 class="display-3 font-weight-bold font-italic white--text">
                    Stroke & Turn Judge
                </h1>
            </v-flex>
        </v-layout>
        <v-layout row class="mt-5">
            <v-flex>
                <p>
                    <span class="headline">Meets Page - <v-btn @click="logout">Log Out</v-btn></span>
                </p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'meets',
    data: () => ({
    }),
    methods: {
        logout() {
            this.$store.dispatch('auth/logout');
        }
    }
};
</script>
