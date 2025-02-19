import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/LoginView.vue'

Vue.use(VueRouter)

const ROLES = {
  SISTEMAS: 'SISTEMAS',
  ADMIN: 'ADMIN',
  USUARIOS: 'USUARIOS',
  CLIENTES: 'CLIENTES',
  DASHPROD: 'DASHPROD',
  LAVADORA: 'LAVADORA',
  // LAVADORA: 'LAVADORA',
  PRENDA: 'PRENDA',
  PROCESOLAVADO: 'PROCESO LAVADO',
  HISTORIALLAVADO: 'HISTORIAL LAVADO',
  ALMACENENTRADA: 'ENTRADAS',
  CONFIRMAORDEN: 'CONFIRMA ORDEN',
  PROCESOORDEN: 'PROCESO ORDEN',
  ALMACENENTREGA: 'ENTREGAS',
  REPORTES: 'REPORTES',
  CANCELACION: 'CANCELACION',
  ROLES: 'ROLES',
  DEFAULT: 'DEFAULT',
  HOME: 'HOME'
}

const routes = [
  
  {
    path: '/',
    name: '',
    component: login,
    meta: {requireAuth: false, roles:[ROLES.DEFAULT]}

  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {requireAuth: false, roles:[ROLES.DEFAULT]}

  },
  {
    path: '/log',
    name: 'log',
    component: () => import('../views/LogView.vue'),

    meta: {requireAuth: false, roles:[ROLES.SISTEMAS]}

  },
  
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),

    meta: {requireAuth: false, roles:[ROLES.HOME]}

  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {requireAuth: true, roles:[ROLES.SISTEMAS, ROLES.ADMIN, ROLES.DASHPROD]}
  },
  
  {
    path: '/dashboardAdmin',
    name: 'dashboardAdmin',
    component: () => import('../views/DashboardAdmin.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN]}
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('../views/UsuariosView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, ROLES.USUARIOS]}
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: () => import('../views/ClientesView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, ROLES.CLIENTES]}
  },
  {
    path: '/lavadoras',
    name: 'lavadoras',
    component: () => import('../views/LavadorasView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, ROLES.LAVADORA]}
  },
  {
    path: '/tipoLavados',
    name: 'tipoLavados',
    component: () => import('../views/TipoLavadosView.vue'),
  LAVADORA: 'LAVADORA',
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, ROLES.LAVADORA]}
  },
  {
    path: '/prendas',
    name: 'prendas',
    component: () => import('../views/PrendasView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, ROLES.PRENDA]}
  },
  {
    path: '/registroLavado',
    name: 'registroLavado',
    component: () => import('../views/registroLavadoView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, "PROCESO LAVADO"]}
  },

  {
    path: '/procesoLavado',
    name: 'procesoLavado',
    component: () => import('../views/procesoLavadoView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, "PROCESO LAVADO"]}
  },
  {
    path: '/entregas',
    name: 'entregas',
    component: () => import('../views/EntregaView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, "ENTREGAS"]}
  },
  {
    path: '/procesoPrendas',
    name: 'procesoPrendas',
    component: () => import('../views/procesoPrendas.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, "PROCESO PRENDAS"]}
  },
  {
    path: '/llegada',
    name: 'llegada',
    component: () => import('../views/LlegadaView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, "LLEGADA", "CONFIRMA ORDEN"]}
  },
  {
    path: '/ordenes',
    name: 'ordenes',
    component: () => import('../views/OrdenesView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN]}
  },
  
  {
    path: '/canceladas',
    name: 'canceladas',
    component: () => import('../views/CanceladasView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, ROLES.CANCELACION]}
  },
  
  {
    path: '/roles',
    name: 'roles',
    component: () => import('../views/rolesView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN]}
  },
  
  {
    path: '/historico',
    name: 'historico',
    component: () => import('../views/historicoOrdenesView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, "HISTORIAL LAVADO"]}
  },

  {
    path: '/rastreo',
    name: 'rastreo',
    component: () => import('../views/rastreoOrdenesView.vue'),
    meta: {requireAuth: true, roles: [ROLES.SISTEMAS, ROLES.ADMIN, ROLES.RASTREO]}
  },
  
  {
    path: '/busqueda',
    name: 'busqueda',
    component: () => import('../views/busquedaQR.vue'),
    meta: {requireAuth: true, roles:[ROLES.DEFAULT]}
  },

  
  {
    path: '/reportes',
    name: 'reportes',
    component: () => import('../views/reportes.vue'),
    meta: {requireAuth: true, roles:[ROLES.SISTEMAS, ROLES.ADMIN, ROLES.REPORTES]}
  },
  
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('../views/accessDeniedView.vue'),
    meta: {requireAuth: true, roles:[ROLES.DEFAULT]}
  },
  {
    path: '/ejemplo',
    name: 'ejemplo',
    component: () => import('../views/ejemploView.vue'),
    meta: {requireAuth: true, roles:[ROLES.DEFAULT]}
  },
  {
    path: '/comentLog',
    name: 'comentLog',
    component: () => import('../views/comentLogView.vue'),

    meta: {requireAuth: false, roles:[ROLES.DEFAULT]}

  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  
  if(to.name != 'login' && to.meta.requireAuth){
    if(router.app.$session.get('token')){
      next()
    }else{
      next({
        path: 'login',
        replace: true
      })
    }
  } else {
    next();
  }
   
  
  const rolesUsr = router.app.$session.get('roles')

  if(rolesUsr.some(role =>  to.meta.roles.includes(role))){
    next()
  }else{
    next({
      path: 'access-denied',
      replace: true
    })
  }


})

export default router
