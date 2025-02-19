<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5 container">
    
            <b-container v-if="mostrarUsuario">
                <vs-alert style="width: 20rem;">
                    <template #title>
                        Credenciales del nuevo usuario
                    </template>
                    <p>
                        <!-- Nombre completo: <b>{{nombreUsr}}</b> -->
                        <br>
                        Usuario: <b>{{usr}}</b>
                        <br>
                        Nip: <b>{{passUsr}} </b>
                    </p>
                    <template #footer>
                        <vs-button @click="mostrarUsuario=!mostrarUsuario">
                            Acceptar
                        </vs-button>
                    </template>
                </vs-alert>
            </b-container>

            <b-row class="align-items-end">
                <b-col md="4" sm="12">
                    <vs-button class="my-0 mb-3" flat icon block @click="activeModal=!activeModal">
                        <box-icon name='user-plus' color="#195bff"></box-icon> Agregar Usuario
                    </vs-button>
                    <b-modal size="xl" centered v-model="activeModal">
                        <template #modal-header="{ close }">
                            <h5>Agregar <b>Usuario</b></h5>
                            <vs-button circle icon floating danger @click="close()">
                                <box-icon name='x' color="#fff"></box-icon>
                            </vs-button>
                        </template>
                        <template #header>
                            <h4 class="not-margin">
                                Registrar <b>Usuario</b>
                            </h4>
                        </template>
            
                        <div class="con-form">
                            <b-row>
                                <b-col class="mt-2" lg="12" md="12" sm="12">
                                    <vs-input success class="mt-2" type="text" v-model="nombre" label-placeholder="Nombre Completo">
                                        <template #icon>
                                            <box-icon name='user' type='solid' ></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="6" md="12" sm="12">
                                    <vs-input success class="mt-3" type="text" v-model="paterno" label-placeholder="Apellido Paterno">
                                        <template #icon>
                                            <box-icon name='user' type='solid' ></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="6" md="12" sm="12">
                                    <vs-input success class="mt-3" type="text" v-model="materno" label-placeholder="Apellido Materno">
                                        <template #icon>
                                            <box-icon name='user' type='solid' ></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                            </b-row>
                            
                            <div class="con-switch">
                                <b-card title="Vistas">
                                    <b-row>
                                        <b-col class="mt-3" cols="2" v-for="(rol, i) in allRoles.slice(0, 16)" :key="i">
                                            <vs-switch  :val="''+rol.id" v-model="optionsRoles">
                                            {{ rol.nombre }}
                                            </vs-switch>
                                        </b-col>
                                    </b-row>
                                </b-card>
                                <b-card class="mt-5" title="Permisos de lavados">
                                    <b-row>
                                        <b-col class="mt-3" cols="2" v-for="(rol, i) in allRoles.slice(17)" :key="i">
                                            <vs-switch  :val="''+rol.id" v-model="optionsRoles">
                                            {{ rol.nombre }}
                                            </vs-switch>
                                        </b-col>
                                    </b-row>
                                </b-card>
                            </div>
                        </div>
                        <br>
                        <template #modal-footer="{ ok }">
                            <vs-button :btnGuardar="btnGuardar == 1" primary @click="addUser()">
                                <box-icon name='save' color="#fff"></box-icon> Guardar
                            </vs-button>
                            <vs-button danger @click="ok()">
                                <box-icon name='exit' color="#fff"></box-icon> Salir
                            </vs-button>
                        </template>
                    </b-modal>
                </b-col>
                <b-col md="8" sm="12">
                </b-col>
                <b-col md="6" sm="6">
                    <b-form-group
                        label="registros"
                        label-for="per-page-select"
                        label-cols-sm="6"
                        label-cols-md="4"
                        label-cols-lg="3"
                        label-align-sm="right"
                        label-size="sm"
                        class="mb-0"
                        >
                        <b-form-select label="registros"
                            class="custom-select"
                            id="per-page-select"
                            v-model="perPage"
                            :options="pageOptions"
                            size="sm"
                        ></b-form-select>
                    </b-form-group>
                </b-col>

                <b-col md="6" sm="6">
                    <b-form-group
                    label="Buscar"
                    label-for="filter-input"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    class="mb-0"
                    >
                        <b-input-group size="sm">
                            <b-form-input
                            id="filter-input"
                            v-model="filter"
                            type="search"
                            placeholder="Buscar"
                            ></b-form-input>

                            <b-input-group-append>
                            <b-button :disabled="!filter" @click="filter = ''" variant="danger">X</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                
            </b-row>

            <!-- Main table element -->
            <b-table
                class="table table-bordered table-hover"
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                label-sort-asc=""
                label-sort-desc=""
                label-sort-clear=""
                stacked="md"
                show-empty
                empty-text="No hay datos disponibles"
                small
                @filtered="onFiltered"
            >
                <template #cell(actions)="row">
                    <div class="d-flex justify-content-center">
                        <btnUsrComponent @updatePage="updatePage" :dataUser="{row}" />
                    </div>
                </template>

                <template #row-details="row">
                    <b-card>
                    <ul>
                        <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                    </ul>
                    </b-card>
                </template>
            </b-table>
            <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"
                class="my-0 mb-3"
            ></b-pagination>
        </b-container>
         <br>
         <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
    </div>
  </template>
  
  <script>
    import HeaderComponent from '@/components/Header.vue';
    import btnUsrComponent from '@/components/btn_Update_Usr.vue'
    import { fetchApi, refreshSession } from "@/service/service.js"
    import loginComponent from '@/components/cardLogin.vue';

  
  
  export default {
    name:"UsuariosView",
    data: () => ({

        items: [],
        fields: [
            { key: 'username', label: 'Nombre usuario', sortable: true, class: 'text-center' },
            { key: 'nombre', label: 'Nombre', sortable: true, sortDirection: 'desc' },
            { key: 'paterno', label: 'apellido Paterno', sortable: true, sortDirection: 'desc' },
            { key: 'materno', label: 'apellido Materno', sortable: true, sortDirection: 'desc' },
            { key: 'actions', label: 'Acciones' }
        ],
        
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15, { value: 100, text: "mostrar Todo" }],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        },

        usuarios: [],
        allRoles: [],
        page: 1,
        cantidad: 100,
  
        activeModal: false,
        nombre: '',
        paterno: '',
        materno: '',
        clave: '',
        optionsRoles: [],
  
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        hidden: true,

        mostrarUsuario: false,
        nombreUsr: '',
        passUsr: '',
        usr: '',

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        btnUsrComponent,
        loginComponent

    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    async mounted(){    
        this.mostrarUsuarios()
        this.mostraRoles()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        
        async mostrarUsuarios(){
            this.items = []
          fetchApi(this.url+`usuario/findAll/${this.page}/100`, 'GET', this.$session.get('token'))
          .then(data => {
              if(data.status == 401){  this.activarReboot = true }
              if(data.status == 200){
                    data.datos.datos.forEach( val => {
                        this.items.push({ username: val.username, nombre: val.nombre, paterno: val.paterno, materno: val.materno, id: val.id, roles: val.roles })
                    })
                    this.totalRows = data.datos.totalElementos 
              }
          })
        },
        async mostraRoles(){
              fetchApi(this.url+'rol/findAll', 'GET', this.$session.get('token'))
              .then(data => {
                  if(data.status == 200){
                      if(!this.$session.get('roles').some(role => ['SISTEMAS'].includes(role))){
                          this.allRoles = data.datos.filter(function (rol) {
                              return rol.id !== 1;
                          });
                        }else{
                            this.allRoles = data.datos
                        }
                  }
              })
          },
        async addUser(){
            let token = this.$session.get('token')
  
            let json = {
                "nombre": this.nombre,
                "paterno": this.paterno,
                "materno": this.materno,
                "roles": this.optionsRoles,
            };
            let res = await fetch(this.url+"usuario/registro",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            let data = await res.json()
            if(data.status == 401){  this.activarReboot = true }
            if(data.status == 200){
                //se actualiza token
                this.activeModal = false
                this.mostrarUsuario = true
                this.nombreUsr = `${data.datos.nombre} ${data.datos.materno} ${data.datos.materno}`
                this.passUsr = data.datos.password
                this.usr = data.datos.username
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostrarUsuarios()
                this.refresh()
                this.optionsRoles = ''
                this.materno = ''
                this.paterno = ''
                this.nombre = ''
            }else{
                this.openNotification(`Error: inesperado al agregar un nuevo usuario`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        
        async updatePage(status){
            if(status == 200){
                this.mostrarUsuarios()
                this.refresh()
            }
        },
        openNotification( title, text, color, position = null, icon) {
          this.$vs.notification({
            progress: 'auto',
            icon,
            color,
            position,
            title: title,
            text: text
          })
        }
    }
  }
  </script>
  <style>
  body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    background: #f1f1f1 !important;
  }
  input {
    width: 100%;
  }
  .ml-5 .b-card{
    margin-left: auto!important
  }
  #per-page-select{
    background: #fff;
    border-radius: 0.5rem;
    padding: 4px;
  }
  thead{
    background: #f4f7f8;
  }
  </style>
  <style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
  .con-form
    width 100%
    .flex
      display flex
      align-items center
      justify-content space-between
      a
        font-size .8rem
        opacity .7
        &:hover
          opacity 1
    .vs-checkbox-label
      font-size .8rem
    .vs-input-content
      margin 10px 0px
      width calc(100%)
      .vs-input
        width 100%
  .footer-dialog
    display flex
    align-items center
    justify-content center
    flex-direction column
    width calc(100%)
    .new
      margin 0px
      margin-top 20px
      padding: 0px
      font-size .7rem
      a
        color getColor('primary') !important
        margin-left 6px
        &:hover
          text-decoration underline
    .vs-button
      margin 0px
  </style>
  
  <style>
  
  .centerAll{
    display: grid;
    place-items: center;
  }
  
  .card{
    border-radius: 1rem;
}
.vs-input{
    width: 100%;
}

  
  </style>
  