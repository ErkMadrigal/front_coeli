<template>
     <b-card v-if="render">
        <b-skeleton animation width="85%"></b-skeleton>
        <b-skeleton animation width="55%"></b-skeleton>
        <b-skeleton animation width="100%"></b-skeleton>
        <b-skeleton type="input" block class="mt-2"></b-skeleton>
        <b-skeleton type="input" block class="mt-1"></b-skeleton>
    </b-card>
    
    <b-card v-else
        :title="nomCliente"
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
    >
    <small class="mt-3 mb-3" for="nombre">{{detail.nombre}}</small>
        
        <b-card-text class="mt-2">
            <p>
                Fecha de entrega
                <strong>{{ fecha(data.fechaEntrega) }}</strong>    
            </p>
            <p>
                Cantidad
                <strong>{{ detail.cantidad }}</strong>
            </p>
        
        </b-card-text>
        <vs-button success block @click="modalShowDetail = !modalShowDetail">
            Ver Detalles
        </vs-button>
        
        <vs-button v-if="data.totalOrdenes > 1 && $session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" danger block @click="cancelar(idOrdenPrenda)">
            Cancelar
        </vs-button>
        <b-modal size="lg" centered v-model="modalShowDetail">
            <template #modal-header="{ close }">
                <h5>Detalles <b>{{ nomCliente }}</b></h5>
                <vs-button circle icon floating danger @click="close()">
                    <box-icon name='x' color="#fff"></box-icon>
                </vs-button>
            </template>
            <template >
                
                <div v-if="detail.length != 0">
                    <b-card>
                        <div class="d-flex flex-row bd-highlight mb-3">
                            <div class="p-2 bd-highlight">
                                <h4 class="mt-2">{{ detail.cliente }}</h4>
                                <strong>{{ detail.nombre }}</strong>
                            </div>
                        </div>
                        cantidad: <b>{{ detail.cantidad }}</b> <br>
                        tipo de lavado:<b> {{detail.proceso.nombre}} ({{ detail.proceso.codigo}})</b> 
                        <br>
                        <hr>
                        <v-timeline dense clipped >
                            <v-timeline-item>
                                <template v-slot:icon>
                                    <span><box-icon name='shower'></box-icon></span>
                                </template>
                                <h3>Pasos:</h3>
                            </v-timeline-item>
                            <br>
                            <v-timeline-item dot-color="grey" class="mb-4" size="small"  v-for="(paso, i) in detail.proceso.pasos" :key="i">
                                <template v-slot:icon>
                                    <small class="pt-1 headline font-weight-bold">{{prefijos(paso.nombre)}}</small>
                                </template>
                                <vs-card>
                                    <template #title>
                                        <h3>{{paso.nombre}}</h3>
                                    </template>
                                    <template #text>
                                        <p>
                                            {{paso.descripcion}}
                                        </p>
                                    </template>
                                </vs-card>
                            </v-timeline-item>
                        </v-timeline>
                    </b-card>
                </div>
            </template>

            <template #modal-footer="{ ok }">
                <vs-button danger @click="ok()">
                        Salir
                </vs-button>
            </template>
            
        </b-modal>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
    </b-card>
</template>
  

<script>
import moment from 'moment'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from './cardLogin.vue';

export default {
    name:"cardLlegada",
    props: {
        data: Object,
    },
    data: () => ({
        modalShowDetail: false,
        nomCliente: '',
        render: true,
        prendas: [],
        detail: [],
        cantidadPrendas: '',
        idOrdenPrenda: '',
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    
    components: {
        loginComponent
    },
    mounted(){   

        this.dataCliente()
        setTimeout(() => {
            this.render = false
            // this.data.prendas.forEach( value => {
            //     this.mostrarDetailPrendas(value.idPrenda, value.cantidad)
            //     this.cantidadPrendas =  value.cantidad
            //     this.idOrdenPrenda =  value.idOrdenPrena
            // })
            this.mostrarDetailPrendas(this.data.prenda.idPrenda, this.data.prenda.cantidad)
            this.cantidadPrendas =  this.data.prenda.cantidad
            this.idOrdenPrenda =  this.data.prenda.idOrdenPrena

        },500)
    },
    methods: {
        fecha(fechaLarga){
            let fecha = fechaLarga.split("T")
            moment.locale('es')
            return moment(fecha[0]).format("LL")
        },
        prefijos(cadena){
            let terminacion = cadena.split(' ').slice(-1)[0]
            let palabras = cadena.split(" ");
            terminacion = terminacion.length > 2 ? '' : terminacion;
            
            let letras = palabras.map(palabra => {
                let quitarEN = palabra.replace('EN', '');
                let quitarTerminacion = quitarEN.replace(terminacion, '');
                 return quitarTerminacion.charAt(0);
            });
            return letras.join("")+terminacion
        },
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        async dataCliente(){
            fetchApi(this.url+`cliente/findById/${this.data.idCiente}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.nomCliente = data.datos.nombre
                }else{
                    console.warn(data)
                }
            })
        },
        async cancelar(idOrdenPrenda){
           
           let token = this.$session.get('token')
           const res = await fetch(this.url+`orden/delete/ordenprenda/${idOrdenPrenda}`,{
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
               this.$emit('updatePage', '200')

           }else{
               console.warn(data)
               this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
           }
       },
        async mostrarDetailPrendas(id, cantidad){
            this.detail = []
            if(id){
                fetchApi(this.url+`prenda/findById/${id}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        // console.log(data.datos)
                        this.detail = data.datos
                        this.detail.cantidad = cantidad
                    }
                })
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
.card{
    border-radius: 1rem;
}
.modal-xl{
    margin-top: 2rem;
}

.vs-input{
    width: 95%;
}
.vs-select--state-null{
    width: 100%;
    margin-bottom: 1rem;
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