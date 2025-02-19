<template>
    <div>
        <b-container class="bv-example-row">
            <b-card  v-if="render">
                <b-skeleton animation="throb" width="85%"></b-skeleton>
                <b-skeleton animation="throb" width="100%"></b-skeleton>
                <b-skeleton animation="throb" width="70%"></b-skeleton>
                <b-skeleton type="button" width="100%" class="mb-2"></b-skeleton>
                <b-skeleton type="button" width="100%"></b-skeleton>
            </b-card>        
            <b-card v-else :title="nomCli" :style="{ 'border-left': `solid 5px #0d6efd !important` }">
                <div class="badge bg-success text-wrap float-end" >
                    {{ data.dt.nombreEstado }}
                </div>
                <p class="fw-light text-muted">Clave Cliente {{ claveCli }}</p>
                <p class="fw-light text-muted">Folio {{ data.dt.numEnvio }}</p>
                <p class="fw-light text-muted">Id Orden {{ data.dt.idOrden }}</p>
                <p class="fw-light text-muted">Entrega <b>{{ fecha(data.dt.fechaEntrega) }}</b></p>
                <p class="fw-light text-muted">Llegada <b>{{ fecha(data.dt.fechaRecepcion) }}</b></p>
                <p class="fw-light text-muted">Tiempo Proceso {{ difFecha(data.dt.prendas[0].fechaAlta, data.dt.prendas[0].ultimoEstado) }}</p>
                <vs-button block primary @click="entregar(data.dt.idOrden)"> Entregar </vs-button>
                <vs-button block success @click="mostraCliDetail"> Ver Detalles </vs-button>
                <b-modal size="lg" centered v-model="modalShowDetail">
                    <template #modal-header="{ close }">
                        <h5>Detalles {{ nomCli }} <p class="fw-light">clave cliente {{ claveCli }}.</p></h5>
                        <vs-button circle icon floating danger @click="close()">
                            <box-icon name='x' color="#fff"></box-icon>
                        </vs-button>
                    </template>
                    <template >
                        <b-card v-if="prendas.length == 0">
                            <div class="d-flex flex-row bd-highlight mb-3">
                                <div class="p-2 bd-highlight">
                                    <b-skeleton animation="wave" width="85%"></b-skeleton>
                                </div>
                            </div>
        
                            <b-skeleton type="input"></b-skeleton>
                            <br>
                            <b-skeleton type="input"></b-skeleton>
                            <br>
        
                            <b-row cols-sm="12" cols-md="6" cols-lg="4" class="mt-4">
                                <b-col>
                                    <b-card>
                                        <b-skeleton animation width="85%"></b-skeleton>
                                        <b-skeleton animation width="55%"></b-skeleton>
                                        <b-skeleton animation width="70%"></b-skeleton>
                                    </b-card>
                                </b-col>
                                <b-col>
                                    <b-card>
                                        <b-skeleton animation width="85%"></b-skeleton>
                                        <b-skeleton animation width="55%"></b-skeleton>
                                        <b-skeleton animation width="70%"></b-skeleton>
                                    </b-card>
                                </b-col>
                                <b-col>
                                    <b-card>
                                        <b-skeleton animation width="85%"></b-skeleton>
                                        <b-skeleton animation width="55%"></b-skeleton>
                                        <b-skeleton animation width="70%"></b-skeleton>
                                    </b-card>
                                </b-col>
                                
                                <b-col>
                                    <b-card>
                                        <b-skeleton animation width="85%"></b-skeleton>
                                        <b-skeleton animation width="55%"></b-skeleton>
                                        <b-skeleton animation width="70%"></b-skeleton>
                                    </b-card>
                                </b-col>
                            </b-row>
        
                        </b-card>
                    <div v-else>
                        <div v-for="(prenda, i) in prendas" :key="i">
                            <hr v-if="i>0">
                            <b-card>
                                <div class="d-flex flex-row bd-highlight mb-3">
                                    <div class="p-2 flex-grow-1 bd-highligh">
                                        <h4 class="mt-2">{{ prenda.prenda }}</h4>
                                    </div>
                                    <div class="p-2 bd-highlight">
                                        <vs-button circle icon floating primary @click="imprimirTicket(prenda.idOrdenPrena)">
                                            <box-icon name='printer' color="#fff"></box-icon>
                                        </vs-button>
                                    </div>
                                </div>
                                cantidad: <b>{{ prenda.cantidad }} 
                                <div v-if="prenda.nombreEstado" class="badge bg-success text-wrap float-end" >
                                    {{ prenda.nombreEstado }}
                                </div></b> <br>
                                tipo de lavado:<b> {{prenda.detalle.nombre}} ({{ prenda.detalle.codigo }})</b> 
                                
                                <br>
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
                                    <v-timeline-item dot-color="grey" class="mb-4" size="small"  v-for="(paso, i) in prenda.detalle.pasos" :key="i">
                                        <template v-slot:icon>
                                            <h6 class="pt-1 headline font-weight-bold">{{prefijos(paso.nombre)}}</h6>
                                        </template>
                                        <vs-card>
                                            <template #text>
                                                <h5>{{paso.nombre}}</h5>
                                                <p>
                                                    {{paso.descripcion}}
                                                </p>
                                            </template>
                                        </vs-card>
                                    </v-timeline-item>
                                </v-timeline>
                            </b-card>
                        </div>
                     
                    </div>
                    
                    </template>
        
                    <template #modal-footer="{ ok }">
                        <vs-button danger @click="ok()">
                                Salir
                        </vs-button>
                    </template>
                    
                </b-modal>
            </b-card>
            <div v-if="activarReboot">
                <loginComponent :login="activarReboot"></loginComponent>
            </div>
        </b-container>
    </div>
</template>

<script>
// import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import moment from 'moment';

export default {
    name:"CardEntregasComponent",
    props: {
        data: Object,
    },
    data: () => ({
        opciones: false,
        modalShowDetail: false,
        modalPrint: false,
        prendas: [],
        nomCli: '',
        claveCli: '',
        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        // ConfirmComponent,
        loginComponent
    },
    mounted(){
        this.mostraCli()
        setTimeout(() => {
            this.render = false
        }, 100)   
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        fecha(fechaLarga){
            let fecha = fechaLarga.split("T")
            moment.locale('es')
            return moment(fecha[0]).format("LL")
        },
        difFecha(inicio, final){
            let fechaCortaI = inicio.split("T")
            let fechaCortaF = final.split("T")
            let fecha1 = moment(`${fechaCortaI[0]} ${fechaCortaI[1].split(".")[0]}`, "YYYY-MM-DD HH:mm:ss")
            let fecha2 = moment(`${fechaCortaF[0]} ${fechaCortaF[1].split(".")[0]}`, "YYYY-MM-DD HH:mm:ss")
            console.log(fecha2.diff(fecha1, 'h'))
            let res = ''
            let diff = fecha2.diff(fecha1, 'd')

            if(diff == 0){
                diff = fecha2.diff(fecha1, 'h');
                res = diff+" hora(s)"
            }else{
                res = diff+" día(s)"
            }
            return res
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
        async mostraCli(){
            fetchApi(this.url+`cliente/findById/${this.data.dt.idCliente}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.nomCli = data.datos.nombre
                    this.claveCli = data.datos.clave
                }
            })
        },
        async imprimirTicket(idOrdenPrena){
            let objbuilder = ``
            fetchApi(this.url+`orden/reportes/prenda/${idOrdenPrena}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    objbuilder = `<embed type='application/pdf' width='100%' height='600px' style='margin-top: 35px; border: 1px solid #ccc;' src='data:application/pdf;base64,${data.datos.base64}'>`
                    let win = window.open("about:blank", "Entrega", "width=900px,height=600px");
                    let title = "Entrega";
                    win.document.write('<html><title>'+ title +'</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
                    win.document.write(objbuilder);
                    win.document.write('</body></html>');
                }else{
                    this.openNotification('Ocurrio un error', `Al obtener los datosde imprecion`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraCliDetail(){
            this.modalShowDetail = true
            // this.prendas = []
            this.data.dt.prendas.forEach( prenda => {
                fetchApi(this.url+`prenda/findById/${prenda.idPrenda}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        let t = this
                        fetchApi(this.url+`proceso/findById/${data.datos.proceso.id}`, 'GET', this.$session.get('token'))
                        .then(dt => {
                            if(dt.status == 200){
                                t.prendas.push({"prenda": data.datos.nombre, "detalle": dt.datos, "cantidad": prenda.cantidad, "nombreEstado": prenda.nombreEstado, "idOrdenPrena": prenda.idOrdenPrena})
                            }
                        })
                    }
                })
            })
        },
        entregar(id){
            let token = this.$session.get('token')
            fetch(this.url+`orden/entrega/${id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            .then(res => res.json())
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.modalShowDetail = false
                    this.openNotification(`Exito: ${data.mensaje}`, `La prenda se ha entregado`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: Inesperado al realizar la entrega`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

                }
            })

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

.card{
    border-radius: 1rem;
    min-height: 9rem; 
    min-width: 12rem;
}
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}

.vs-card{
    padding: 0.5rem;
}

</style>
<style lang="stylus">
getColor(colorx, alpha = 1)
    unquote("rgba(var(--vs-"+colorx+"), "+alpha+")")
getVar(var)
    unquote("var(--vs-"+var+")")

.content-tooltip
  .body
    display flex
    align-items flex-start
    justify-content center
    .vs-avatar-content
      margin-top -30px
      border 3px solid getVar('theme-layout')
      box-shadow 0px 4px 15px 0px rgba(0,0,0,.1)
    .text
      display flex
      align-items center
      justify-content center
      flex-direction column
      font-size .55rem
      padding 10px
      font-weight normal
      span
        font-weight bold
        font-size .7rem
  footer
    display flex
    align-items center
    justify-content center
  h4
    padding 8px
    margin 0px
    text-align left
  p
    text-align left
    padding 0px
    margin 0px
    line-height 1rem
    padding-bottom 5px
    padding-left 8px
</style>