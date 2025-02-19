<template>
    <div>
        <vs-button circle icon floating primary  @click="dataModal">
            <box-icon name='edit' color="#fff"></box-icon>
        </vs-button>
        <vs-dialog blur v-model="active">
            <template #header>
                <h4 class="not-margin">
                    Editar <b>Prenda</b>
                </h4>
            </template>


            <div class="con-form">
                <template>

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
                    <b-skeleton class="mt-4" type="input" v-if="clienteSelect.length == 0"></b-skeleton>
                    <div class="con-selects mt-4" v-else>
                        <v-select
                            v-model="selectCliente"
                            :options="clienteSelect"
                            label="nombre"
                            placeholder="Cliente"
                            :reduce="option => option.id"
                            :searchable="true"
                            :clearable="false"
                        />
                    </div>
                    <b-skeleton class="mt-5" type="input" v-if="procesoSelect.length == 0"></b-skeleton>

                    <div class="con-selects mt-5" v-else>
                        <v-select
                            v-model="selectProceso"
                            :options="procesoSelect"
                            label="nombre"
                            placeholder="Tipo de proceso"
                            :reduce="option => option.id"
                            :searchable="true"
                            :clearable="false"
                        />
                    </div>
                    
                </template>
            </div>

            <template #footer>
                <div class="con-footer mt-4">
                    <vs-button class="m-1" success
                        flat
                        :btnActualizar="btnActualizar == 1"
                        @click="update(data.id)">
                        Actualizar
                    </vs-button>
                    <div v-if="(data.estado == 1)" class="">
                        <vs-button class="m-1" danger
                            flat
                            :btnActualizar="btnElimina == 1"
                            @click="active2=!active2">
                            Desactivar
                        </vs-button>
                    </div>
                </div>
            </template>
        </vs-dialog>
        
        <vs-dialog v-model="active2">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Desactivarlo?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="deletePrenda"/>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
    
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ConfirmComponent from '@/components/confirm.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from './cardLogin.vue';

export default {
    name: 'CardLavadoraComponent',
    props: {
        data: Object,
    },
    data:() => ({
        selectProceso: '',
        selectCliente: '',
        estado: '',
        tiposLavado: [],
        cliente: '',
        proceso: '',
        procesoSelect: [],
        clienteSelect: [],
        active: false,
        active2: false,
        tipoLavado: '',
        nombre: '',
        descripcion: '',
        cantidadBolsa: '',
        kilos: '',
        btnElimina: 0,
        btnActualizar: 0,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        ConfirmComponent,
        loginComponent,
        vSelect

    },
    mounted(){
        setTimeout(() => {
            this.mostraCliente()
            this.mostraProceso()
            this.mostraTipoProceso()
            this.mostraTipoClientes()
        }, 1500)
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        dataModal(){
            this.active = true
            this.selectProceso = this.data.row.item.proceso.id
            this.selectCliente = this.data.row.item.idCliente
            this.nombre = this.data.row.item.nombre
            this.descripcion = this.data.row.item.descripcion
            this.cantidadBolsa = this.data.row.item.cantidadBolsa
            this.kilos = this.data.row.item.cantidadKilos
            this.estado = this.data.row.item.estado == 1 ? true : false
        },
    
        async mostraCliente(){

            fetchApi(this.url+`cliente/findById/${this.data.row.item.idCliente}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.cliente = data.datos
                }
            })

        },
        async mostraProceso(){

            fetchApi(this.url+`proceso/findById/${this.data.row.item.proceso.id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.proceso = data.datos
                }
            })

        },
        async mostraTipoProceso(){
            fetchApi(this.url+'proceso/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.procesoSelect = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.procesoSelect = data.datos
                }
            })
        },
        async mostraTipoClientes(){
            fetchApi(this.url+'cliente/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                this.clienteSelect = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.clienteSelect = data.datos
                }
            })
        },
        async deletePrenda(status){
            if(status == 200){
                let token = this.$session.get('token')
                const res = await fetch(this.url+`prenda/delete/${this.data.row.item.id}`,{
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
                    this.active2 = false
                    this.active = false
                    this.$emit('updatePage', '200')
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

                }else{
                    console.warn(data)
                    this.openNotification(`Error: Inesperado`, `Si el problema persiste comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }
        },
        async activar(){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`lavadora/activate/${this.data.row.item.id}`,{
                method: "PUT",
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
                this.active = false
                this.$emit('updatePage', '200')
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
                console.warn(data)
                this.openNotification(`Error: Inesperado`, `Si el problema persiste comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)            }
        },
        async update(){
            let token = this.$session.get('token')

            let json = {
                "idCliente": this.selectCliente,
                "nombre": this.nombre,
                "descripcion": this.descripcion,
                "idPrenda": this.data.row.item.id,
                "idProceso": this.selectProceso,
                "cantidadBolsa": this.cantidadBolsa,
                "kilos": this.kilos,

            };
            let res = await fetch(this.url+"prenda/update",{
                method: "PUT",
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
                this.active = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.$emit('updatePage', '200')
            }else{
                console.warn(data)
                this.openNotification(`Error: Inesperado`, `Si el problema persiste comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
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
        },
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
.card{
    border-radius: 1rem;
}
.ml-5 .vs-card{
    margin-left: auto!important
} 

.centerAll{
    display: grid;
    place-items: center;
}

.vs-card{
    padding: 0.5rem;
}
.vs-input{
    width: 95%;
}

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
</style>
<style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .con-footer
    display flex
    align-items center
    justify-content flex-end
    .vs-button
      margin 0px
      .vs-button__content
        padding 10px 30px
      ~ .vs-button
        margin-left 10px
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
    padding-bottom 0px
  .con-content
    width 100%
    p
      font-size .8rem
      padding 0px 10px
    .vs-checkbox-label
      font-size .8rem
    .vs-input-parent
      width 100%
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