import Vue from 'vue';
import Router from 'vue-router';
import EventPage from './views/event';
import EventsPage from './views/events';
import HomePage from './views/Home';
import LoginPage from './views/login';
import MeetsPage from './views/meets';
import TokenService from './services/token';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta: { public: true }
        },
        {
            path: '/event',
            name: 'event',
            component: EventPage
        },
        {
            path: '/events',
            name: 'events',
            component: EventsPage
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: {
                public: true,
                onlyWhenLoggedOut: true
            }
        },
        {
            path: '/meets',
            name: 'meets',
            component: MeetsPage
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isPublic = to.matched.some(record => record.meta.public);
    const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut);
    const loggedIn = !!TokenService.getToken();
    console.log(`beforeEach: isPublic: ${isPublic}, loggedIn: ${loggedIn}, only: ${onlyWhenLoggedOut}`);
    console.log(to);

    if (!isPublic && !loggedIn) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath } // Store the full path to redirect the user to after login
        });
    }

    if (loggedIn && onlyWhenLoggedOut) {
        return next('/');
    }

    next();
});

export default router;
