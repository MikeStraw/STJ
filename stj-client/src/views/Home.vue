<template>
    <v-container fluid>
        <v-layout row>
            <v-flex xs12>
                <h3 v-if="loggedIn">
                    Welcome back, view the list of available meets
                    <v-btn flat right to="meets" class="ml-0 text-lowercase blue--text text--lighten-2">
                        here.
                    </v-btn>
                </h3>
                <h3 v-else>
                    To get started:
                    <v-btn flat right to="login" class="ml-0 text-lowercase blue--text text--lighten-2">
                        sign in.
                    </v-btn>
                </h3>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import eventBus from '../services/eventBus';
import { mapGetters } from 'vuex';

export default {
    name: 'home',
    data: () => ({
    }),
    computed: {
        ...mapGetters({
            loggedIn: 'auth/loggedIn'
        })
    },
    methods: {
        logout() {
            console.log('home.logout called.');
            this.$store.dispatch('auth/logout');
        }
    },
    created() {
        eventBus.$on('LOGOUT', this.logout);
    }
};
</script>
