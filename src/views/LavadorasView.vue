<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5 container">
                <b-row  class="align-items-end">
                    
                    <b-col md="4" sm="12">
                        <b-row>
                            <b-col class="p-1">
                                <vs-button flat block icon @click="activeModal=!activeModal">
                                    <box-icon name='wind' color="#195bff" ></box-icon> Agregar Lavadora
                                </vs-button>
                                <vs-dialog v-model="activeModal">
                                    <template #header>
                                    <h4 class="not-margin">
                                        Agregar <b>Lavadora</b>
                                    </h4>
                                    </template>
                        
                                    <div class="con-form">
                                        <vs-input success type="text" v-model="nombreLav" class="mt-4" label-placeholder="Lavadora">
                                            <template #icon>
                                                <box-icon name='wind'></box-icon>
                                            </template>
                                        </vs-input>
                                        <div class="con-selects mt-4">
                                            <v-select
                                                v-model="tipoLavado"
                                                :options="tiposLavado"
                                                label="nombre"
                                                placeholder="Tipo de Lavado"
                                                :reduce="option => option.id"
                                                :searchable="true"
                                                :clearable="false"
                                                no-results-text="No se encontraron resultados"
                                            />
                                        </div>
                                        <vs-input success type="text" v-model="capKg" class="mt-4" label-placeholder="Capacidad en kilos">
                                            <template #icon>
                                                <box-icon name='wind'></box-icon>
                                            </template>
                                        </vs-input>
                                        <vs-input success type="text" v-model="capMinima" class="mt-4" label-placeholder="Capacidad Minima">
                                            <template #icon>
                                                <box-icon name='wind'></box-icon>
                                            </template>
                                        </vs-input>
                                        <vs-input success type="text" v-model="capMaxima" class="mt-4" label-placeholder="Capacidad Maxima">
                                            <template #icon>
                                                <box-icon name='wind'></box-icon>
                                            </template>
                                        </vs-input>
                                    </div>
                                    <br>
                                    <template #footer>
                                        <div class="footer-dialog">
                                            <vs-button primary block @click="addWasher()">
                                                <box-icon name='save' color="#fff"></box-icon> Guardar
                                            </vs-button>
                                        </div>
                                    </template>
                                </vs-dialog>

                                
                            </b-col>
                            
                        </b-row>
                    </b-col>
                    
                    <b-col md="4" sm="12">
                    </b-col>
                    
                    <b-col md="4" sm="12">
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
        </b-container>
        <br>
        <b-container class="bv-example-row">
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
                        <btnUpdateLavadora @updatePage="updatePage" :dataWasher="{row}" />
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
                class="my-0"
            ></b-pagination>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
         
    </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import HeaderComponent from '@/components/Header.vue';
import btnUpdateLavadora from '@/components/btn_Update_Lavadora.vue'    
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"lavadorasView",
    data: () => ({
        items: [],
        fields: [
            { key: 'estado', label: 'Estado', sortable: true, class: 'text-center' },
            { key: 'nombre', label: 'Nombre', sortable: true, sortDirection: 'desc' },
            { key: 'min', label: 'Campacidad Minima %', sortable: true, sortDirection: 'desc' },
            { key: 'max', label: 'Capacidad Maxima %', sortable: true, sortDirection: 'desc' },
            { key: 'kilos', label: 'Capacidad en kilos', sortable: true, sortDirection: 'desc' },
            { key: 'actions', label: 'Acciones' }
        ],
        
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
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

        capacidades: [],
       
        programasLavado: [],
        contador: 0,
        tiposLavado: [],
        sinData: false,
        activeModal: false,
        activeModalAddLavado: false,
        nombreLav: '',
        tipoLavado: '',
        progLavado: '',
        nomLavado: '',
        desLavado: '',
        capKg: '',
        capMaxima: '',
        capMinima: '',
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        hidden: true,

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        btnUpdateLavadora,
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
        this.mostrarTodos()
        this.mostraTipoLavado()
    
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
        async mostraTipoLavado(){
            this.tiposLavado = []
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tiposLavado = data.datos
                }
            })
        },
        async mostrarTodos(){
            this.items = []
            fetchApi(this.url+'lavadora/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( val => {
                        this.items.push({nombre: val.lavadora, estado: val.idEstado, id: val.idLavadora, tipoLavado: val.tipoLavado, max: val.max, min:val.min, kilos:val.kilos })
                    })
                    this.totalRows = this.items.length 
                }
            })
        },
        
        async addWasher(){
            let token = this.$session.get('token')
            // let pogramLav = []
            // this.programasLavado.forEach( pl => {
            //     pogramLav.push(pl.idPrograma)
            // })
            let json = {
                "lavadora": this.nombreLav,
                "idTipoLavado": this.tipoLavado,
                "maximo": this.capMaxima,
                "minimo": this.capMinima,
                "kilos": this.capKg,
            };
            let res = await fetch(this.url+"lavadora/register",{
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
                this.programasLavado = []
                //se actualiza token
                this.nombreLav = ''
                this.tipoLavado = ''
                this.progLavado = ''
                this.activeModal = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostrarTodos()
                this.updatePage(200)
            }else{
                this.openNotification(`Error: inesperado al registrar la lavadora`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
     
        async updatePage(status){
            if(status == 200){
                this.mostrarTodos()
                this.mostraTipoLavado()
            }
        },
        openNotification( title, text, color, position = null, icon) {
          this.$vs.notification({
            duration: 4000, 
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
.card{
    border-radius: 1rem;
    min-height: 7rem; 
    min-width: 12rem;
}
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}
#per-page-select{
    background: #fff;
    border-radius: 0.5rem;
    padding: 4px;
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
.vs--searchable .vs__dropdown-toggle{
    border-radius: 0.7rem;
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
    min-height: 6rem; 
    min-width: 12rem;
}
.vs-input{
    width: 100%;
}

</style>