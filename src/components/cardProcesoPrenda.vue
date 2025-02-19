<template>
    <div>
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2" v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))"></b-skeleton>
        </b-card>        
        <b-card :style="{ 'border-left': `solid 5px #0d6efd !important` }" v-else :title="data.nomCliente" :sub-title="data.nombrePrenda">
            <div class='badge bg-primary text-wrap float-end mb-2' >
                Paso {{ data.npaso }}
            </div>
            <strong>{{ data.descripcionEstado }}</strong>
            <br>
           
            <p v-if="this.data.fechaInicio">{{ date }}</p>
            <br v-else>
            Numero Orden {{ data.idOrdenLavado }}
            <br>
            <p class="mt-3" v-if="this.data.folio != null">Folio: {{ this.data.folio }}</p>
            <strong v-if="this.data.fhAlta">Fecha Registro {{ obtenerFechaBonita(this.data.fhAlta) }}</strong> <br>
            <strong v-if="this.data.fechaEntrega">Fecha Entrega {{ obtenerFechaBonita(this.data.fechaEntrega) }}</strong>
            <br>
            <br>
            <br>
            <div class="badge bg-primary text-wrap float-end" >
                {{ data.nombrePaso }}
            </div>
           
            <strong class="fw-light">Cantidad: {{ data.cantidadPrendas }}</strong>
            <vs-button block flat primary @click="modalIniciar =! modalIniciar" > Iniciar </vs-button>
            <vs-button v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" block flat danger @click="cancel()"> Cancelar Prenda </vs-button>

            <vs-dialog blur  v-model="modalIniciar">
                <template #header>
                    <h4 class="not-margin">
                        Iniciar <b>Proceso</b>
                    </h4>
                </template>

                <div class="con-form">
                    <strong class="fw-light">Cantidad total de prendas: {{ data.cantidadPrendas }}</strong>
                    

                    <vs-input
                        class="mt-2"
                        v-model="cantidad"
                        label-placeholder="cantidad a ingresar"
                    />
                    <div class="con-selects" v-if="data.idTipoLavado">
                        <vs-select style="max-width:100%!important;" class="mt-3" success label-placeholder="Lavadora" color="success"  v-model="tipoLavadora">
                            <vs-option  v-for="(lavadora, i) in data.infoLavadoras" :key="i" :label="lavadora.lavadora" :value="lavadora.id">
                                {{lavadora.lavadora}}  Max.: {{ lavadora.cantidadMaxima }}  Min.: {{ lavadora.cantidadMinima }}
                            </vs-option>
                        </vs-select>
                    </div>
                    
                </div>
                <template #footer>
                    <div class="footer-dialog">
                        <vs-button block @click="iniciar()" :disabled="iniciarProceso">
                            <box-icon v-if="iniciarProceso" name='loader' flip='vertical' animation='spin' color='#ffffff' ></box-icon>
                            Iniciar 
                        </vs-button>
                    </div>
                </template>
            </vs-dialog>
            <vs-button block flat success @click="modalShowDetail=!modalShowDetail"> Detalles </vs-button>
            <b-modal size="lg" centered v-model="modalShowDetail">
                <template #modal-header="{ close }">
                    <h5>Detalles </h5>
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
                            cantidad: <b>{{ detail.cantidadBolsa }}</b> <br>
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
            <vs-dialog blur v-model="cancelPredas">
                <template #header>
                    <h4 class="not-margin">
                        Eliminar <b>{{data.nombrePrenda}}</b>
                    </h4>
                </template>
                <div class="con-form">
                    <template>
                        <p>Cantidad <b>{{ data.cantidadPrendas }}</b></p>
                        <div class="center content-inputs">
                            <vs-input danger type="text" v-model="motivoElim" label-placeholder="Describe el motivo">
                                <template #icon>
                                    <box-icon name='rename'></box-icon>
                                </template>
                            </vs-input>
                        </div>
                        <div class="center content-inputs">
                            <vs-input danger type="number" v-model="cantidadElim" label-placeholder="Digita una cantidad">
                                <template #icon>
                                    <box-icon name='dialpad-alt' ></box-icon>
                                </template>
                            </vs-input>
                        </div>
                    </template>
                </div>

                <template #footer>
                    <div class="con-footer mt-4">
                        <vs-button danger
                            block
                            flat
                            @click="comfirm=!comfirm">
                            Eliminar
                        </vs-button>
                    </div>
                </template>
            </vs-dialog>
            <vs-dialog v-model="comfirm">
                <template #header>
                    <h4 class="not-margin">
                        Estas seguro que deseas <b>Eliminar las prendas?</b>
                    </h4>
                </template>
                <ConfirmComponent @confirm="cancelPrednas"/>
            </vs-dialog>
            
        </b-card>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import loginComponent from './cardLogin.vue';
import ConfirmComponent from '@/components/confirm.vue'
import { refreshSession, fetchApi } from "@/service/service.js"

export default {
    name:"CardProcesoPrendaComponent",
    props: {
        data: Object,
    },
    data: () => ({
        date: '',
        cantidad: '',
        motivoElim: '',
        cantidadElim: '',
        tipoLavadora: '',
        lavadorasAll: [],
        opciones: false,
        modalIniciar: false,
        cancelPredas: false,
        borderColor: '',
        mensaje: '',
        detail: [],
        pasos: [],
        idPasos: [],  
        modalShowDetail: false,
        render: true,
        iniciarProceso: false, 

        comfirm: false,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        loginComponent,
        ConfirmComponent,

    },
    mounted(){
        let fecha=new Date(this.data.fechaInicio);
        this.date = this.calcularTiempoTranscurrido(fecha);
        
        setTimeout(() => {
            this.render = false
            this.mostrarDetailPrendas(this.data.idPrenda)
        }, 100)  

    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        cancel(){
            this.modalShowDetail = false
            this.cancelPredas = false
            this.cancelPredas = true
        },
        async cancelPrednas(status){
            if(status == 200){
                let token = this.$session.get('token')

                let prenEliminadas = parseInt(this.data.cantidadPrendas)-parseInt(this.cantidadElim)

                if(prenEliminadas < 0){
                    this.openNotification( `No puedes Eliminar mas prendas de la cantidad asignada `, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

                }else{
                    let json = {
                        "mensaje": this.motivoElim,
                        "cantidadCancela": this.cantidadElim,
                        "idOrdenPrenda": this.data.idOrdenPrenda,
                        "idHist": this.data.idHist

                    };
                    
    
                    let res = await fetch(this.url+"orden/cancela",{
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
                        this.comfirm = false
                        this.cancelPredas = false
                        this.openNotification(`Exito: ${data.mensaje}`, `Se han Eliminado Exitosamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                        this.$emit('updatePage', '200')
                    }else{
                        this.openNotification(`Error: inesperado al intentar cancelar`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                    }
                }
            }
        },
        obtenerFechaBonita(fechaParametro) {
            const fecha = new Date(fechaParametro);

            const opciones = {
                day: '2-digit',  
                month: '2-digit',
                year: 'numeric',
            };

            const formatoFecha = new Intl.DateTimeFormat('es-ES', opciones);

            return formatoFecha.format(fecha);
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
       
        calcularTiempoTranscurrido(fechaInicial){
            const fechaActual = new Date();
            const diferencia = fechaActual - fechaInicial;

            if (diferencia < 0) {
                return "La fecha proporcionada es en el futuro.";
            }

            const segundos = Math.floor(diferencia / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);
            const dias = Math.floor(horas / 24);
            const meses = Math.floor(dias / 30.44); // Promedio de días en un mes
            const años = Math.floor(meses / 12);

            if (años > 0) {
                return `${años} año${años > 1 ? 's' : ''}, ${meses % 12} m${meses % 12 > 1 ? 'es' : ''}, ${dias % 30} d${dias % 30 > 1 ? 's' : ''}, ${horas % 24} h${horas % 24 > 1 ? 's' : ''}, ${minutos % 60} min${minutos % 60 > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else if (meses > 0) {
                return `${meses} m${meses > 1 ? 'es' : ''}, ${dias % 30} d${dias % 30 > 1 ? 's' : ''}, ${horas % 24} h${horas % 24 > 1 ? 's' : ''}, ${minutos % 60} min${minutos % 60 > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else if (dias > 0) {
                return `${dias} d${dias > 1 ? 's' : ''}, ${horas % 24} h${horas % 24 > 1 ? 's' : ''}, ${minutos % 60} min${minutos % 60 > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else if (horas > 0) {
                return `${horas} h${horas > 1 ? 's' : ''}, ${minutos % 60} min${minutos % 60 > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else if (minutos > 0) {
                return `${minutos} min${minutos > 1 ? 's' : ''}, ${segundos % 60} seg${segundos % 60 > 1 ? 's' : ''}`;
            } else {
                return `${segundos} seg${segundos > 1 ? 's' : ''}`;
            }
        },
      
        
        async iniciar(){
                this.iniciarProceso = true;

                let token = this.$session.get('token')

                let json = {
                    "idOrdenPrenda": this.data.idOrdenPrenda,
                    "cantidad": this.cantidad,
                    "idPasoProceso": this.data.idPaso,
                    "idLavadora": this.tipoLavadora
                };
                let res = await fetch(this.url+"orden/proceso",{
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
                    this.iniciarProceso = false;

                    this.refresh()
                    this.modalIniciar = false
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha iniciado el proceso correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.mostrarDetailPrendas(this.data.idPrenda)
                    this.$emit('updatePage', '200')

                }else{
                    this.iniciarProceso = false;
                    this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

                }
                
        },
        async mostrarDetailPrendas(id){
            this.detail = []
            if(id){
                fetchApi(this.url+`prenda/findById/${id}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        this.detail = data.datos
                    }
                })
            }
        },
        
        async updatePage(status){
            if(status == 200){
                this.mostrarDetailPrendas(this.data.idPrenda)
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
    width: 90%;
}
.vs-select .vs-select--state-null{
    max-width: 100% !important;
}


</style>
<style lang="stylus">

getColor(colorx, alpha = 1)
    unquote("rgba(var(--vs-"+colorx+"), "+alpha+")")
getVar(var)
    unquote("var(--vs-"+var+")")

.alert-example
    .vs-button--active
        transform translate(0, -5px)
        border-radius 0px 0px 12px 12px

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