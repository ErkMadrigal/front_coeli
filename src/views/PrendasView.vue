<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-4 container">
            
            <b-row class="align-items-end">
                
                <b-col md="4" sm="12">
                    <vs-button flat block icon @click="activeModal=!activeModal">
                        <box-icon name='wind' color="#195bff"></box-icon> Agregar Prendas
                    </vs-button>
                    <vs-dialog v-model="activeModal">
                        <template #header>
                        <h4 class="not-margin">
                            Registrar <b>Prendas</b>
                        </h4>
                        </template>
            
                        <div class="con-form">
                            <vs-input class="mt-3" success type="text" v-model="nombre" label-placeholder="Nombre">
                                <template #icon>
                                    <box-icon name='wind'></box-icon>
                                </template>
                            </vs-input>
                            <vs-input class="mt-3" success type="text" v-model="descripcion" label-placeholder="Descripcion">
                                <template #icon>
                                    <box-icon name='wind'></box-icon>
                                </template>
                            </vs-input>
                            <vs-input class="mt-3" success type="text" v-model="kilos" label-placeholder="Cantidad por kilos">
                                <template #icon>
                                    <box-icon name='wind'></box-icon>
                                </template>
                            </vs-input>
                            <vs-input class="mt-3" success type="text" v-model="cantidadBolsa" label-placeholder="Cantidad de prendas por bolsa">
                                <template #icon>
                                    <box-icon name='wind'></box-icon>
                                </template>
                            </vs-input>
                            <div class="con-selects mt-4">
                                <b-skeleton type="input" v-if="clientes.length == 0"></b-skeleton>
                                <v-select
                                    v-model="cliente"
                                    :options="clientes"
                                    label="nombre"
                                    placeholder="Cliente"
                                    :reduce="option => option.id"
                                    :searchable="true"
                                    :clearable="false"
                                />
                            </div>
                            <div class="con-selects mt-5">
                                <b-skeleton type="input" v-if="tiposProceso.length == 0"></b-skeleton>
                                <v-select
                                    v-model="tipoProceso"
                                    :options="tiposProceso"
                                    label="nombre"
                                    placeholder="Tipo de proceso"
                                    :reduce="option => option.id"
                                    :searchable="true"
                                    :clearable="false"
                                />
                            </div>
                        </div>
                        <br>
                        <template #footer>
                            <div class="footer-dialog">
                                <vs-button block success
                                    flat
                                    :btnGuardar="btnGuardar == 1"
                                    @click="addPrenda()">
                                    Guardar
                                </vs-button>
                            </div>
                        </template>
                    </vs-dialog>
                </b-col>
                <b-col md="8" sm="12"></b-col>

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
                        <btnUpdatePrenda @updatePage="updatePage" :data="{row}" />
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
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import HeaderComponent from '@/components/Header.vue';
import btnUpdatePrenda from '@/components/btn_Update_Prendas.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"PrendasView",
    data: () => ({
        items: [],
        fields: [
            { key: 'estado', label: 'Estado', sortable: true, class: 'text-center' },
            { key: 'cliente', label: 'Cliente', sortable: true, sortDirection: 'desc' },
            { key: 'nombre', label: 'Nombre', sortable: true, sortDirection: 'desc' },
            { key: 'descripcion', label: 'Descripción', sortable: true, sortDirection: 'desc' },
            { key: 'cantidadKilos', label: 'Cantidad Por Kilo', sortable: true, sortDirection: 'desc' },
            { key: 'cantidadBolsa', label: 'Cantidad pieza/par', sortable: true, sortDirection: 'desc' },
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

        prendas: [],
        tiposProceso: [],
        clientes: [],
        sinData: false,
        activeModal: false,
        nombre: '',
        descripcion: '',
        kilos: '',
        cantidadBolsa: '',
        tipoProceso: '',
        cliente: '',
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        hidden: true,

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        btnUpdatePrenda,
        loginComponent,
        vSelect
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostraActivos()
        this.mostraProceso()
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
        async mostraProceso(){
            fetchApi(this.url+'proceso/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tiposProceso = data.datos
                }else{
                    this.tiposProceso = [{"id": 0, "nombre": 'Sin Procesos'}]

                }
            })
        },
        async mostraClientes(){
            fetchApi(this.url+'cliente/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.clientes = data.datos
                }else{
                    this.clientes = [{"id": 0, "nombre": 'Sin Clientes'}]

                }
            })
        },
        async mostraActivos(){
            this.items = []
            fetchApi(this.url+'prenda/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                this.prendas = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( val => {
                        this.items.push(val)
                    })
                    this.totalRows = this.items.length
                }else{
                    this.sinData = true
                }
            })
        },
        
        async addPrenda(){
            let token = this.$session.get('token')

            let json = {
                "nombre": this.nombre,
                "descripcion": this.descripcion,
                "idProceso": this.tipoProceso,
                "idCliente": this.cliente,
                "cantidadBolsa": this.cantidadBolsa,
                "kilos": this.kilos,
            };
            let res = await fetch(this.url+"prenda/register",{
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
                //se actualiza token
                this.tipoProceso = ''
                this.cliente = ''
                this.cantidadBolsa = ''
                this.nombre = ''
                this.activeModal = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostraActivos()
            }else{
                console.warn(data)
                this.openNotification(`Error: Inesperado`, `Si el problema persiste comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async updatePage(status){
            if(status == 200){
                this.mostraActivos()
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
.vs-select .vs-select--state-null{
    max-width: 100% !important;
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
.v-select.vs--single.vs--searchable {
    margin-top:-4px;
}
input[type="search"] {
    padding: 10px;
    border: 1px solid #f6f6f6;
    border-radius: 4px;
    outline: none;
}

input[type="search"]:focus {
    border-color: #f6f6f6;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); 
}
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