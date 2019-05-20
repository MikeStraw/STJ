<template>
    <v-app class="indigo lighten-5">
        <v-content>
            <transition name="fade" mode="out-in" >
                <router-view />
            </transition>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            //
        };
    }
};
</script>
<style>
    .fade-enter {
        opacity: 0;
    }

    .fade-enter-active {
        transition: opacity 250ms ease;
    }

    .fade-leave {}

    .fade-leave-active {
        transition: opacity 250ms ease;
        opacity: 0;
    }
</style>
