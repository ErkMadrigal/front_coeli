<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5 container">
    
            <b-row class="align-items-end">
                
                <b-col md="4" sm="12">
                    <vs-button class="my-0 mb-3" flat block icon @click="activeModal=!activeModal">
                        <box-icon name='user-plus' color="#195bff"></box-icon> Agregar Cliente
                    </vs-button>
                    <vs-dialog v-model="activeModal">
                        <template #header>
                        <h4 class="not-margin">
                            Registrar <b>Clientes</b>
                        </h4>
                        </template>
            
                        <div class="con-form">
                            <vs-input success type="text" v-model="nombreCli" placeholder="Nombre del Cliente">
                                <template #icon>
                                    <box-icon name='user' type='solid' ></box-icon>
                                </template>
                            </vs-input>
                            <vs-input success type="text" v-model="claveCli" placeholder="Clave del Cliente">
                                <template #icon>
                                    <box-icon name='dialpad-alt' ></box-icon>
                                </template>
                            </vs-input>
                        </div>
                        <br>
                        <template #footer>
                            <div class="footer-dialog">
                                <vs-button block success
                                    flat
                                    :btnGuardar="btnGuardar == 1"
                                    @click="addCliente()">
                                    Guardar
                                </vs-button>
                            </div>
                        </template>
                    </vs-dialog>
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
                <template #cell(estado)="row">
                    <div class="d-flex justify-content-center">
                        <box-icon name='radio-circle-marked' :color="row.item.estado == 1 ? '#32ff00' : '#ff0023'" ></box-icon>
                    </div>
                </template>
                <template #cell(actions)="row">
                    <div class="d-flex justify-content-center">
                        <btnClienteComponent @updatePage="updatePage" :dataCli="{row}" />
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
import btnClienteComponent from '@/components/btn_Update_Cliente.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"ClientesView",
    data: () => ({

        itemPrueba: [],
        items: [],
        fields: [
            { key: 'estado', label: 'Estado', sortable: true, class: 'text-center' },
            { key: 'nombre', label: 'Nombre', sortable: true, sortDirection: 'desc' },
            { key: 'clave', label: 'Clave', sortable: true, sortDirection: 'desc' },
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

        clientes: [],
        sinData: false,
        activeModal: false,
        nombreCli: '',
        claveCli: '',
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        hidden: true,
        notData: true,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        btnClienteComponent,
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.mostraClientes()
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
        async mostraClientes(){
            this.items = []
            fetchApi(this.url+'cliente/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( val => {
                        this.items.push({ clave: val.clave, nombre: val.nombre, estado: val.estado, id: val.id})
                    })
                    this.totalRows = this.items.length 
                }
            })
        },
        async addCliente(){
            let token = this.$session.get('token')

            let json = {
                "nombre": this.nombreCli,
                "clave": this.claveCli,
            };
            let res = await fetch(this.url+"cliente/register",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            let data = await res.json()

            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.activeModal = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostraClientes()
                this.claveCli = ''
                this.nombreCli = ''
                
            }else{
                this.openNotification(`Error: inesperado al registrar`, `verifica tus campos, Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
       
        async updatePage(status){
            if(status == 200){
                this.mostraClientes()
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
.ml-5 .vs-card{
    margin-left: auto!important
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