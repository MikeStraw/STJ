<template>
    <v-toolbar app dark class="indigo">
        <v-toolbar-title>
            <span class="display-1 font-weight-bold font-italic">Stroke & Turn Judge &nbsp;</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items v-if="loggedIn">
            <span class="subheading pt-3">Welcome {{user.first}}
                <v-btn small flat class="white--text" @click="logout">Log Out</v-btn>
            </span>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "toolbarHeader",
    data: () => ({
    }),
    computed: {
        ...mapGetters({
            loggedIn: 'auth/loggedIn',
            user: 'user/user'
        })
    },
    methods: {
        // TODO:  Publish/emit the logout so other components could take action.
        logout() {
            this.$store.dispatch('auth/logout');
        }
    }
}
</script>
