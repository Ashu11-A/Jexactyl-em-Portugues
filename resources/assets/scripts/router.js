import VueRouter from 'vue-router';
import store from './store/index';

const route = require('./../../../vendor/tightenco/ziggy/src/js/route').default;

// Base Vuejs Templates
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Account from './components/dashboard/Account';
import ResetPassword from './components/auth/ResetPassword';
import User from './models/user';

const routes = [
    {name: 'login', path: '/auth/login', component: Login},
    {name: 'forgot-password', path: '/auth/password', component: Login},
    {name: 'checkpoint', path: '/auth/checkpoint', component: Login},
    {
        name: 'reset-password',
        path: '/auth/password/reset/:token',
        component: ResetPassword,
        props: function (route) {
            return {token: route.params.token, email: route.query.email || ''};
        }
    },

    {name: 'dashboard', path: '/', component: Dashboard},
    {name: 'account', path: '/account', component: Account},
    {name: 'account.api', path: '/account/api', component: Account},
    {name: 'account.security', path: '/account/security', component: Account},

    {
        name: 'server',
        path: '/server/:id',
        // component: Server,
        // children: [
        //     { path: 'files', component: ServerFileManager }
        // ],
    }
];

const router = new VueRouter({
    mode: 'history', routes
});

// Redirect the user to the login page if they try to access a protected route and
// have no JWT or the JWT is expired and wouldn't be accepted by the Panel.
router.beforeEach((to, from, next) => {
    if (to.path === route('auth.logout')) {
        console.log('logging out');
        return window.location = route('auth.logout');
    }

    const user = store.getters['auth/getUser'];

    // Check that if we're accessing a non-auth route that a user exists on the page.
    if (!to.path.startsWith('/auth') && !(user instanceof User)) {
        console.log('logging out 2');
        store.commit('auth/logout');
        return window.location = route('auth.logout');
    }

    // Continue on through the pipeline.
    console.log('continuing');
    return next();
});

export default router;
