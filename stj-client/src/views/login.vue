<template>
    <v-form ref="form" v-model="valid">
        <v-container>
            <v-layout row>
                <v-flex>
                    <p>To log in, fill in all fields and click the submit button.</p>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex sm3>
                    <v-text-field v-model="first"
                                  :rules="requiredRules"
                                  label="First Name"
                                  required>

                    </v-text-field>
                </v-flex>
                <v-flex sm3>
                    <v-text-field v-model="last"
                                  :rules="requiredRules"
                                  label="Last Name"
                                  required>

                    </v-text-field>
                </v-flex>
                <v-flex sm2>
                    <v-text-field v-model="pin"
                                  :rules="requiredRules"
                                  label="PIN"
                                  required>

                    </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-btn :disabled="!valid"
                       color="success"
                       @click="submitForm">
                    Submit
                </v-btn>
            </v-layout>
            <v-layout row v-if="authenticating">
                <v-flex>
                    <h1 color="info" >Authenticating ...</h1>
                </v-flex>
            </v-layout>
            <v-layout row v-if="authenticationErrorCode">
                <v-flex>
                    <h1 color="error" >{{authenticationErrorCode}} - {{authenticationError}}</h1>
                    <v-btn small color="error" @click="clearErrorMessage">
                        Clear Error Message
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-form>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'login',
    data: () => ({
        valid: false,
        first: '',
        last: '',
        pin: '',
        requiredRules: [v => !!v || 'This is a required field']
    }),
    computed: {
        ...mapState({
            authenticating: state => state.auth.authenticating,
            authenticationErrorCode: state => state.auth.authenticationErrorCode,
            authenticationError: state => state.auth.authenticationError
        })
    },
    methods: {
        clearErrorMessage() {
            this.$store.dispatch('auth/clearError');
        },

        async submitForm() {
            const rc = await this.$store.dispatch('auth/login', {first: this.first, last: this.last, pin: this.pin});

            // if 200 - OK, move on to /meets
            if (rc) {
                this.$refs.form.reset();
                this.$router.push(this.$router.history.current.query.redirect || '/meets');
            }
        }
    }
};
</script>
