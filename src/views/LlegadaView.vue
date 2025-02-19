<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Nueva Orden" v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'LLEGADA'].includes(role))" active>
                        <template>
                            <div>
                                <b-row>
                                    <b-col lg="6" md="8" sm="12">
                                        <b-card title="Registra la Hoja Ruta">
                                            <b-list-group flush>
                                                <b-list-group-item>
                                                    <b-row  class="center mt-2">
                                                        
                                                        <b-col lg="12" sm="12" class="mt-4">
                                                            <vs-input v-model="folio" primary label-placeholder="Folio">
                                                                <template #icon>
                                                                    <box-icon name='dialpad-alt'></box-icon>
                                                                </template>
                                                            </vs-input>
                                                        </b-col>
                                                        <b-col lg="12" class="mt-4">
                                                            <label for="floatingSelect">Selecciona un cliente</label>
                                                            <div class="con-selects mt-3">
                                                                <v-select
                                                                    
                                                                    v-model="SelectCliente"
                                                                    :options="getClientes"
                                                                    label="nombre"
                                                                    placeholder="Selecciona una opcion"
                                                                    :reduce="option => option.id"
                                                                    :searchable="true"
                                                                    :clearable="false"
                                                                    @search:no-results="onNoResults"
                                                                    @input="clienteSeleccionado"

                                                                />
                                                            </div>
                                                        </b-col>
                                                        <b-col lg="6" sm="6" class="mt-5">
                                                            <vs-input type="date" size="large" v-model="fechaEntrega" primary label-placeholder="Fecha de entrega" :min="minDate">
                                                                <template #icon>
                                                                    <box-icon name='calendar' ></box-icon>
                                                                </template>
                                                            </vs-input>
                                                        </b-col>
                                                        <b-col lg="6" sm="6">
                                                        </b-col>
                                                    </b-row>
                                                </b-list-group-item>
                                                <b-list-group-item>
                                                    <b-row>
                                                        <b-col lg="12" class="mt-4">
                                                            <label for="floatingSelect">Selecciona una prenda</label>
                                                            <div class="con-selects mt-3">
                                                                <v-select
                                                                    
                                                                    v-model="SelectPrenda"
                                                                    :options="getPrendas"
                                                                    label="nombre"
                                                                    placeholder="Selecciona una opcion"
                                                                    :reduce="option => option.id"
                                                                    :searchable="true"
                                                                    :clearable="false"
                                                                    @search:no-results="onNoResults"
                                                                    @input="prendaSeleccionada"

                                                                        
                                                                />
                                                            </div>
                                                        </b-col>
                                                        <b-col lg="6" sm="8" class="mt-4">
                                                            <vs-input v-model="cantidad" type="number" primary label-placeholder="Cantidad en Piezas">
                                                                <template #icon>
                                                                    <box-icon name='dialpad-alt'></box-icon>
                                                                </template>
                                                            </vs-input>
                                                        </b-col>
                                                        <b-col lg="6" sm="4" class="mt-4">
                                                            <vs-button circle icon floating  @click="addPrenda()">
                                                                <box-icon name='plus' color='#fbfbfb' ></box-icon>
                                                            </vs-button>
                                                        </b-col>
                                                    </b-row>
                                                </b-list-group-item>
                                                            
                                            </b-list-group>
                                        </b-card>
                                    </b-col>
                                    <b-col lg="6" md="4" sm="12">
                                       <b-card title="Prendas Asignadas">
                                            <div v-if="prendas.length > 0">
                                                <b-list-group flush>
                                                    <b-list-group-item  v-for="(prenda, i) in prendas" :key="i">
                                                        <b-row>
                                                            <b-col cols="8">
                                                                Tipo de Prenda: <b>{{ prenda.nombre }}</b> 
                                                                <br> 
                                                                Cantidad: <b>{{ prenda.cantidad }}</b>
                                                            </b-col>
                                                            <b-col cols="4">
                                                                <vs-button
                                                                    danger
                                                                    size="small"
                                                                    :active="active == prenda.id"
                                                                    @click="eliminarPrenda(prenda.id)"
                                                                >
                                                                    <box-icon name='trash' color="#FFF"></box-icon> Eliminar
                                                                </vs-button>
                
                                                            </b-col>
                                                            
                                                        </b-row>
                                                    </b-list-group-item>
                                                </b-list-group>
                                            </div>
                                            <div v-else>
                                                <vs-alert shadow >
                                                    <template #title>
                                                        No hay Prendas Asignadas
                                                    </template>
                                                </vs-alert>
                                            </div>
                                            <div class="center" v-if="prendas.length > 0">
                                                <vs-button block @click="add()" :disabled="iniciarProceso">
                                                    <box-icon name='save' color='#fbfbfb' ></box-icon> <box-icon v-if="iniciarProceso" name='loader' flip='vertical' animation='spin' color='#ffffff' ></box-icon>Guardar
                                                </vs-button>
                                            </div>
                                        </b-card>
                                    </b-col>
                                </b-row>
                            </div>
                        </template>
                    </b-tab>
                    <b-tab title="Ordenes" v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CONFIRMA ORDEN'].includes(role))" active>
                        <b-container class="bv-example-row">
                            <b-card class="mt-4" v-for="(orden, i) in ordenesEspera" :key="i">
                                <b-row >
                                    <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(prenda, i) in orden.prendas" :key="i">
                                        <cardLlegada @updatePage="updatePage" :data="{idCiente:orden.idCliente, prenda: prenda, fechaEntrega: orden.fechaEntrega, idOrden: orden.idOrden, totalOrdenes: orden.prendas.length}"></cardLlegada>
                                    </b-col>
                                </b-row>  
                                <vs-button v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CONFIRMA ORDEN'].includes(role))" primary block @click="enviarDatos(orden.idOrden, orden.prendas)" :disabled="iniciarProceso">
                                    <box-icon v-if="iniciarProceso" name='loader' flip='vertical' animation='spin' color='#ffffff' ></box-icon>
                                    Confirmar
                                </vs-button>
                                <vs-button danger v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" primary block @click="cancelar(orden.idOrden)">
                                    Cancelar
                                </vs-button>
                            </b-card>
                            <vs-alert v-if="sinData" class="mt-5" shadow danger>
                                <template #title>
                                    No se han encontrado datos
                                </template>
                            </vs-alert>
                        </b-container>
                    </b-tab>
                </b-tabs>
            </b-card>
        
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import HeaderComponent from '@/components/Header.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';
import cardLlegada from '@/components/cardLlegada.vue';


export default {
    name:"LlegadaView",
    
    data: () => ({
        modal: false,
        active: 0,
        getPrendas: [],
        getClientes: [],
        array_prendas: [],
        sinData: false,
        ordenesEspera: [],
        SelectCliente: '',
        nombrePrenda: '',
        fechaEntrega: '',
        SelectPrenda: '',
        cantidad: '',
        folio: '',
        contador: 0,
        error: [],
        prendas: [],
        iniciarProceso: false,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    computed: {
    minDate() {
        const today = new Date(); // Obtiene la fecha actual
        today.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00
        return today.toISOString().split('T')[0]; // Devuelve la fecha actual en formato YYYY-MM-DD
        },
    },
    components: {
        HeaderComponent,
        loginComponent,
        cardLlegada,
        vSelect
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.getPrendas = []
        this.mostraClientesActivos()
        this.mostrarOrdenes()
    },
    
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        onNoResults(searchText) {
            // Lógica para manejar el caso en que no se encuentran resultados
            console.log(`No se encontraron resultados para: ${searchText}`);
        },
        clienteSeleccionado() {
            this.mostraPrendasActivas()
        },
        prendaSeleccionada(){
            if (this.SelectPrenda) {
                this.nombrePrenda = this.array_prendas.find(prenda => prenda.id === this.SelectPrenda)
            }
        },
        async cancelar(id){
           
            let token = this.$session.get('token')
            const res = await fetch(this.url+`orden/delete/${id}`,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            const data = await res.json();
            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.openNotification(`Exito: Orden procesada`, `Se ha Cancelado Correctamente la Orden`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                // ordenPrendas = []
                this.mostrarOrdenes()
            }else{
                console.warn(data)
                this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async enviarDatos(idOrden, prendas){
            this.iniciarProceso = true;

            let ordenPrendas = []
            prendas.forEach( pr => {
                ordenPrendas.push({"idOrdenPrenda": pr.idOrdenPrena, "cantidad": pr.cantidad})
            })
            
            
            let json = {
                "idOrdenLavado": idOrden,
                "ordenPrendas": ordenPrendas,
            };
            let token = this.$session.get('token')
            const res = await fetch(this.url+`orden/confirmaOrden`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            const data = await res.json();
            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.openNotification(`Exito: Orden procesada`, `Se ha Enviado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                // ordenPrendas = []
                this.mostrarOrdenes()
                this.iniciarProceso = false;

            }else{
                console.warn(data)
                this.iniciarProceso = false;
                this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async mostrarOrdenes(){
            this.ordenesEspera = []
            fetchApi(this.url+'orden/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {

                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.ordenesEspera = data.datos
                    if(this.ordenesEspera.length == 0){
                        this.sinData = true
                    }
                }else{
                    this.sinData = true
                }
            })
        },
        async mostraClientesActivos(){
            this.getClientes = []

            fetchApi(this.url+'cliente/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.getClientes = data.datos
                }else{
                    this.getClientes = []
                }
            })
        },
        async mostraPrendasActivas(){
            fetchApi(this.url+`prenda/findByCliente/${this.SelectCliente}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    if(data.datos.length != 0){
                        this.getPrendas = data.datos
                        data.datos.forEach( value => {
                            this.array_prendas.push({id: value.id, nombre: value.nombre})
                        })
                    }else{
                        this.getPrendas = []
                    }
                }else{
                    this.getPrendas = []
                }
            })
            .catch(err => console.log(err))
        },
        async addPrenda(){

            let prenda = {
                "id": this.contador,
                "idPrenda": this.SelectPrenda,
                "nombre": this.nombrePrenda.nombre,
                "cantidad": this.cantidad,

            }
            this.error = []
            this.SelectCliente == '' ? this.error.push("<br>el campo es Cliente Requerido") : ''
            this.fechaEntrega == '' ? this.error.push("<br>el campo es Fecha Entrega Requerido") : ''
            this.SelectPrenda == '' ? this.error.push("<br>el campo es Prenda Requerido") : ''
            this.cantidad == '' ? this.error.push("<br>el campo es Cantidad Requerido") : ''

            if(this.error.length == 0){
                this.prendas.push(prenda)
                this.contador++
                this.cantidad = ''
                this.SelectPrenda = ''

            }else{
                this.openNotification(`Error: En los campos`, `${this.error}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        eliminarPrenda(id){
            this.prendas = this.prendas.filter(pren => pren.id != id)
        },
        async add(){
            this.iniciarProceso = true;

            this.sinData = false

            this.contador = 0
            let token = this.$session.get('token')

            let json = {
                "idCliente": this.SelectCliente,
                "fechaEntrega": this.fechaEntrega,
                "ordenPrendas": this.prendas,
                "numEnvio": this.folio

            };

            if(this.folio == ''){
                this.openNotification(`Error: inesperado`, `El folio es un valor Requerido`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                return 0;
            }

            let res = await fetch(this.url+"orden/register",{
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
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.updatePage(200)
                this.iniciarProceso = false;
            }else{
                this.iniciarProceso = false;
                this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
            
        },
        async updatePage(status){
            if(status == 200){
                this.prendas = []
                this.mostrarOrdenes()
                this.cantidad = ''
                this.SelectPrenda = ''
                this.fechaEntrega = ''
                this.SelectCliente = ''
                this.folio = ''
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
    },
}
</script>

<style>
body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    background: #f1f1f1 !important;
}
#modal-xl{
    margin-top: 5rem;
}
.card{
    border-radius: 1rem;
}
.vs-input{
    width: 90vh;
}
.vs-select{
    width: 90vh;
}
select{
    width: 100%;
}
input {
    width: 100%;
}
.form-select{
    width: 95%;
    border-radius: 1rem;
    height: 1rem;
}
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