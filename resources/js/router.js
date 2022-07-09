import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/index'


Vue.use(VueRouter)
/* HOMEPAGE COMPONENTS */
import homepage from './components/homepage/home/Home.vue'
import HomepageLayout from './components/homepage/layouts/HomepageLayout.vue'


import Authentication from './components/homepage/login/Authentication.vue'
import PasswordReset from './components/homepage/login/ResetPassword.vue'


/* CLIENT COMPONENTS */
import clientdashboardlayout from './components/homepage/client/layouts/DashboardLayout'
import clientprofile from './components/homepage/client/dashboard/Dashboard.vue'
import clientrequests from './components/homepage/client/clientrequests/ClientRequest.vue'
import clientsearch from './components/homepage/client/clientsearch/ClientSearch.vue'

import viewrequest from './components/homepage/client/clientrequests/ViewRequest.vue'

/* import clientdashboardlayout from './components/homepage/client/layouts/DashboardLayout'
import clientdashboard from './components/system/client/clientdashboard/ClientDashboard.vue'
import clientrequests from './components/system/client/clientrequests/ClientRequests.vue'
import clientsearch from './components/system/client/clientsearch/ClientSearch.vue' */

/* ERROR 404 PAGE NOT FOUND COMPONENT */
import NotFound from './components/404.vue'


/* ADMIN COMPONENTS */
import DashboardLayout from './components/system/layouts/DashboardLayout.vue'
import dashboard from './components/system/dashboard/Dashboard'
import requests from './components/system/requests/Requests.vue'
import files from './components/system/files/Files.vue'
import users from './components/system/users/Users.vue'
import clients from './components/system/clients/Clients.vue'
import reports from './components/system/reports/Reports.vue'
import archive from './components/system/archive/Archive.vue'




const routes = [

    {
        path: '*',
        component: NotFound,
    },
    {
        path: '/404',
        component: NotFound,
        name: "404"
    },
    {
        path: '/authentication/:action',
        component: Authentication,
        children: [
            {
                path: '/authentication/:action',
                component: homepage,
                name: 'authentication',
                meta: {
                    guest: true,
                    title: "login"
                },
            },
            {
                path: '/authentication/:action/:token/:email',
                component: PasswordReset,
                name: 'passwordreset',
                meta: {
                    guest: true,
                    title: "passwordreset"
                },
            },


        ]

    },
    {
        path: '/',
        component: HomepageLayout,
        children: [
            {
                path: '/',
                component: homepage,
                name: 'homepage',
            },

        ]

    },
    {
        path: '/client/clientprofile',
        component: clientdashboardlayout,
        meta: {
            middleware: true,
            title: "system",
        },
        children: [
            {
                path: '/client/clientprofile',
                component: clientprofile,
                name: 'clientprofile',
                meta: {
                    middleware: true,
                    isAdmin: false,
                    title: "Client Profile"
                },
            },
            {
                path: '/client/viewrequest/:file_id',
                component: viewrequest,
                props: true,
                name: 'clientviewrequest',
                meta: {
                    middleware: true,
                    isAdmin: false,
                    title: "Client View Request"
                },

            },
            {
                path: '/client/requests',
                component: clientrequests,
                name: 'clientrequests',
                meta: {
                    middleware: true,
                    isAdmin: false,
                    title: "Client Request"
                },
            },
            {
                path: '/client/clientsearch',
                component: clientsearch,
                name: 'clientsearch',
                meta: {
                    middleware: true,
                    isAdmin: false,
                    title: "Client Search File"
                },

            },

        ]
    },
    {
        path: '/system/',
        component: DashboardLayout,
        meta: {
            middleware: true,
            title: "system",
        },
        children: [
            {
                path: '/system/dashboard',
                component: dashboard,
                name: 'systemdashboard',
                meta: {
                    isAdmin: true,
                    middleware: true,
                    isStaff: false,
                    title: "System Dashboard"
                },
                /* beforeEnter:(to,from,next) => {
                    store.dispatch("getUserList")
                    next()
                }, */


            },
            {
                path: '/system/files',
                component: files,
                name: 'systemfiles',
                meta: {
                    isAdmin: true,
                    middleware: true,
                    title: "System Files"
                },
            },
            {
                path: '/system/reports',
                component: reports,
                name: 'systemreports',
                meta: {
                    isAdmin: true,
                    middleware: true,
                    isChief: true,
                    title: "System Reports"
                },
            },
            {
                path: '/system/archive',
                component: archive,
                name: 'systemarchive',
                meta: {
                    isAdmin: true,
                    middleware: true,
                    title: "System Archive"
                },
            },

            {
                path: '/system/requests',
                component: requests,
                name: 'systemrequests',
                meta: {
                    isAdmin: true,
                    isStaff: true,
                    middleware: true,
                    title: "System Client Requests"
                },


            },
            {
                path: '/system/user',
                component: users,
                name: 'systemusers',
                meta: {
                    isAdmin: true,
                    middleware: true,
                    isChief: true,
                    title: "System Users"
                },
                beforeEnter: (to, from, next) => {
                    if (store.state.auth.user.user_type === 'Staff') {
                        next({
                            name: '404'
                        })
                    } else {
                        next()
                    }
                }
            },
            {
                path: '/system/clients',
                component: clients,
                name: 'systemclients',
                meta: {
                    isAdmin: true,
                    isChief: true,
                    middleware: true,
                    title: "System Clients"
                },
                beforeEnter: (to, from, next) => {
                    if (store.state.auth.user.user_type === 'Staff') {
                        next({
                            name: '404'
                        })
                    } else {
                        next()
                    }
                }
            }

        ]
    },
]
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
    routes,
    mode: 'history',
    linkActiveClass: 'active',
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})

function loggedIn() {
    return localStorage.getItem('token');
}
router.beforeEach((to, from, next) => {
    let user_type = localStorage.getItem("user_type")
    if (to.matched.some(record => record.meta.middleware)) {
        if (!loggedIn() && !store.state.auth.authenticated) {
            next({
                path: '/',
                query: { redirect: to.fullPath }
            })
        } else {
            if (to.matched.some(record => record.meta.isAdmin)) {

                if (user_type === 'Client') {
                    next({
                        name: 'clientprofile',
                        query: { redirect: to.fullPath }
                    })
                } else {
                    if (user_type === 'Chief') {
                        if (to.matched.some(record => record.meta.isStaff)) {
                            next({
                                name: 'systemdashboard',
                                query: { redirect: to.fullPath }
                            })
                        } else {
                            next()
                        }
                    } else {
                        if (to.matched.some(record => record.meta.isChief)) {
                            next({
                                name: 'systemdashboard',
                                query: { redirect: to.fullPath }
                            })
                        } else {
                            next()
                        }
                    }
                }

            }
            else {
                if (user_type === 'Client') {
                    next()
                } else {
                    next({
                        name: 'systemdashboard',
                        query: { redirect: to.fullPath }
                    })
                }


            }
            next()

        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (loggedIn()) {
            if (user_type === 'Client') {
                next({
                    path: '/client/clientprofile',
                })
            } else if (user_type === 'Staff') {
                next({
                    path: '/system/dashboard',

                })
            } else {
                next({
                    path: '/system/dashboard',

                })
            }

        } else {
            next()
        }
    }
    else {
        next() // make sure to always call next()!
    }
})

export default router

