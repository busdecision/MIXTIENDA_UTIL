import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/pages/authentication/Login.vue'
import Register from './components/pages/authentication/Register.vue'
import Dashboard from './components/pages/dashboard/Dashboard.vue'
import School from './components/pages/school/School.vue'
import GrupoProducto from './components/pages/grupoProducto/GrupoProducto.vue'
import ListaUtiles from './components/pages/utiles/Utiles.vue'
import utilForm from './components/pages/utiles/UtilForm.vue'
import User from './components/pages/user/User.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes :[
        {
            path :"/login",
            component: Login,
            meta: {
                forVisitors : true
            }
        },
        {
            path: "/register",
            component : Register,
            meta: {
                forVisitors : true
            }
        },
        {
            path : "/dashboard",
            component: Dashboard,
            meta:{
                forAuth: true
            }
        },
        {
            path : "/colegio",
            component: School,
            meta:{
                forAuth: true
            }
        },        
        {
            path : "/grupo-producto",
            component: GrupoProducto,
            meta:{
                forAuth: true
            }
        },        
        {
            path : "/utiles",
            component: ListaUtiles,
            meta:{
                forAuth: true
            }
        },        
        {
            path : "/utiles/crear",
            component: utilForm,
            meta:{
                type : "new",
                forAuth: true
            }
        },                
        {
            path : "/utiles/:id/editar",
            component: utilForm,
            meta:{
                type : "edit",
                forAuth: true
            }
        },
        {
            path : "/utiles/:id",
            component: utilForm,
            meta:{
                type : "view",
                forAuth: true
            }
        },
        {
            path : "/usuario/crear",
            component: User,
            meta:{
                forAuth: true
            }
        }    
    ],
    linkActiveClass: 'active',
    mode : 'history'
})
export default router