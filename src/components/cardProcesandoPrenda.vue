<template>
    <div>
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input"></b-skeleton>
            <b-skeleton type="input" v-if="data.idEstado == 10 && $session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))"></b-skeleton>
            <b-skeleton type="input" v-if="data.idEstado != 10 "></b-skeleton>
            <b-skeleton type="input" v-if="$session.get('roles') == 'SISTEMAS' || $session.get('roles') == 'ADMIN' "></b-skeleton>
        </b-card> 
        <b-card v-if="data.detalleMaquinada.length > 1" :style="{ 'border-left': `solid 5px #d9534f !important` }" :title="'Lavadora ' +data.lavadora" :sub-title="'carga utilizada '+limitDecimal(data.kilosMaquinada)+' kg'">
           
            <!-- From Uiverse.io by naveenkumarr-onyx --> 
            <div class="card1"  v-for="(prenda, i) in data.detalleMaquinada" :key="i">
                <b-card :title="prenda.nombreCliente + i" :sub-title="prenda.nombrePrenda" :class="'item item--1 '+ (i > 0 ? 'mt-card':'') ">
                    <div class='badge bg-primary text-wrap float-end mb-2' >
                        Paso {{ prenda.pasoProceso.orden }}
                    </div>
                    <p class="mt-3" >Folio: {{ prenda.folio }}</p>
                    <strong class="text text--1" v-if="prenda.fhAlta">Fecha Registro {{ obtenerFechaBonita(prenda.fhAlta) }}</strong><br>
                    <strong class="text text--1" v-if="prenda.fechaEntrega">Fecha Entrega {{ obtenerFechaBonita(prenda.fechaEntrega) }}</strong>
                </b-card>
            </div>
            <!-- end -->
            <!-- <vs-button class="d-none" block flat primary @click="modalShowDetail=!modalShowDetail"> Detalles </vs-button> -->
            <vs-button v-if=" data.autorizacion == null && data.requiereAuth && $session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))"  block flat primary  @click="viewMotivo =! viewMotivo"> Autorizar </vs-button>
            <vs-button v-if="data.requiereAuth && data.autorizacion != null" block flat danger @click="terminar(data.id)"> Terminar </vs-button>
            <vs-button v-if="!data.requiereAuth && data.autorizacion == null" block flat danger @click="terminar(data.id)"> Terminar </vs-button>
            <vs-button v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" block flat danger @click="cancel()"> Cancelar Prenda </vs-button>
            <vs-button v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" block flat warn @click="modalReiniciar =! modalReiniciar" > Reiniciar </vs-button>
           
        </b-card>    
        <b-card v-if="data.detalleMaquinada.length == 1" :style="{ 'border-left': `solid 5px #007bff !important` }" :title="'Lavadora '+ data.lavadora" :sub-title="'Cliente '+data.detalleMaquinada[0].nombreCliente">
            <small>Prenda {{ data.detalleMaquinada[0].nombrePrenda }}</small> <br>
            <strong>
                Cantidad de Prendas {{ data.detalleMaquinada[0].cantidad }}
            </strong>
            <div class='badge bg-primary text-wrap float-end mb-2' >
                Paso {{ data.detalleMaquinada[0].pasoProceso.orden }}
            </div>
            <vs-button v-if="data.detalleMaquinada[0].npaso == 1 || $session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))"  circle icon floating primary @click="imprimirTicket(data.id)">
                <box-icon name='printer' color="#fff"></box-icon>
            </vs-button>
            <p>{{ calcularTiempoTranscurrido(new Date(this.data.detalleMaquinada[0].fechaInicio)) }}</p>
            Numero Orden {{ data.detalleMaquinada[0].idOrdenLavado }}
            <br>
            <p class="mt-3" v-if="this.data.detalleMaquinada[0].folio != null">Folio: {{ this.data.detalleMaquinada[0].folio }}</p>
            <strong v-if="this.data.detalleMaquinada[0].fhAlta">Fecha Registro {{ obtenerFechaBonita(this.data.detalleMaquinada[0].fhAlta) }}</strong><br>
            <strong v-if="this.data.detalleMaquinada[0].fechaEntrega">Fecha Entrega {{ obtenerFechaBonita(this.data.detalleMaquinada[0].fechaEntrega) }}</strong>
            <br>
            <!-- <p v-if="data.detalleMaquinada[0].infoLavadora != null">
                Lavadora {{ data.detalleMaquinada[0].infoLavadora.lavadora }}
            </p> -->
            <!-- <br> -->
            <div class='badge bg-primary text-wrap float-end mb-2' >
                {{ data.detalleMaquinada[0].pasoProceso.nombre }}
            </div>
            <div v-if="data.detalleMaquinada[0].idEstado == 10" class="badge bg-danger text-wrap float-end mb-3" >
                Se Requiere Autorización
            </div>
            <p class="fw-light" v-if="data.detalleMaquinada[0].lavadora">Lavadora {{ data.detalleMaquinada[0].lavadora }}</p>
            <vs-button class="d-none" block flat primary @click="modalShowDetail=!modalShowDetail"> Detalles </vs-button>
            <vs-button v-if=" data.autorizacion == null && data.requiereAuth && $session.get('roles').some(role => ['SISTEMAS', 'ADMIN'].includes(role))"  block flat primary  @click="autorizar(data.id)"> Autorizar </vs-button>
            <vs-button v-if="data.requiereAuth && data.autorizacion != null" block flat danger @click="terminar(data.id)"> Terminar </vs-button>
            <vs-button v-if="!data.requiereAuth && data.autorizacion == null" block flat danger @click="terminar(data.id)"> Terminar </vs-button>
            <vs-button v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" block flat danger @click="cancel()"> Cancelar Prenda </vs-button>
            <vs-dialog blur v-model="cancelPredas">
                <template #header>
                    <h4 class="not-margin">
                        Eliminar <b>{{data.detalleMaquinada[0].nombrePrenda}}</b>
                    </h4>
                </template>
                <div class="con-form">
                    <template>
                        <p>Cantidad <b>{{ data.detalleMaquinada[0].cantidad }}</b></p>
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
            <b-modal size="lg" centered v-model="modalShowDetail">
                <template #modal-header="{ close }">
                    <h5>Detalles {{ data.detalleMaquinada[0].nombrePrenda }}</h5>
                    
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <template >
                    
                    Nombre del programa lavado <b>{{ data.detalleMaquinada[0].nombreProgramaLavado ? data.detalleMaquinada[0].nombreProgramaLavado : 'no Aplica' }}</b> <br>
                    Tipo de lavado <b>{{ data.detalleMaquinada[0].tipoLavado ? data.detalleMaquinada[0].tipoLavado : 'no Aplica'}}</b> <br>
                    Nombre del sigiente paso: <b>{{ data.detalleMaquinada[0].nombreSigPaso }}</b> <br>
                    Cantidad minima de la lavadora: <b>{{data.detalleMaquinada[0].cantidadMinima}}</b> <br>
                    Cantidad maxima de la lavadora: <b>{{data.detalleMaquinada[0].cantidadMaxima}}</b>
                </template>
    
                <template #modal-footer="{ ok }">
                    <vs-button v-if="$session.get('roles') == 'SISTEMAS' || $session.get('roles') == 'ADMIN' " danger @click="aprt()">
                            Aperturar Lavadora Asignada
                    </vs-button>
                    <vs-button danger @click="ok()">
                            Salir
                    </vs-button>
                </template>
                
            </b-modal>
            <vs-button v-if="$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" block flat warn @click="modalReiniciar =! modalReiniciar" > Reiniciar </vs-button>
        </b-card>
        <vs-dialog blur  v-model="modalReiniciar">
            <template #header>
                <h4 class="not-margin">
                    Seguro que deseas Reiniciar el <b>Proceso</b>
                </h4>
            </template>
            <template #footer>
                <div class="footer-dialog">
                    <vs-button block @click="reiniciar(data.id)">
                        Reiniciar
                    </vs-button>
                </div>
            </template>
        </vs-dialog>
        <vs-dialog v-model="comfirmApertura">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Aperturar la lavadora asignada?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="aperturarLavadora"/>
        </vs-dialog>
        <vs-dialog v-model="comfirm">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Eliminar las prendas?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="cancelPrednas"/>
        </vs-dialog>

        <vs-dialog v-model="viewMotivo">
            <template #header>
                <h3 class="not-margin">
                    Motivo de la Autorizacion
                </h3>
            </template>
            <div class="con-content">
                <h4>
                    <b>{{ data.motivo }}</b>
                </h4>
            </div>
            
             <template #footer>
                <div class="footer-dialog">
                    <vs-button block @click="autorizar(data.id)">
                        Autorizar
                    </vs-button>
                </div>
            </template>
        </vs-dialog>

        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"


export default {
    name:"CardProcesandoPrendaComponent",
    props: {
        data: Object,
    },
    data: () => ({
        date: '',
        comfirm: false,
        comfirmApertura: false,
        modalReiniciar: false,
        viewMotivo: false,
        cancelPredas: false,
        motivoElim: '',
        cantidadElim: '',
        opciones: false,
        detail: [],
        pasos: [],
        idPasos: [],  
        modalShowDetail: false,
        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        ConfirmComponent,
        loginComponent
    },
    mounted(){
        setTimeout(() => {
            this.render = false
        }, 100)  
        // console.log(this.data)

    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
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
        async imprimirTicket(id){
            let objbuilder = ``
            // this.modalPrint = true
            // console.log(idOrdenPrena)
            fetchApi(this.url+`orden/reportes/prenda/card/${id}`, 'GET', this.$session.get('token'))
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
        aprt(){
            this.modalShowDetail = false
            this.cancelPredas = false
            this.comfirmApertura = true
        },
        cancel(){
            this.modalShowDetail = false
            // this.cancelPredas = false
            this.cancelPredas = true
        },
        autorizar(id){
            let token = this.$session.get('token')
            fetch(this.url+`orden/proceso/autoriza/${id}`,{
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
                    this.openNotification(`Exito: ${data.mensaje}`, `Se a Autorizado el proceso Exitosamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async activarLavadora(id, msg = false){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`lavadora/activate/${id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            const data = await res.json();
            if(msg){
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Reactivado la Lavadora`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
    
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }
        },
        async reiniciar(id){
            let token = this.$session.get('token')
            let json = {
                "idHist": id,
                "idOrdenPrenda": "-1",
                "cantidadCancela": "-1"
            };
            let res = await fetch(this.url+`orden/paso/return/`,{
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
                // this.activarLavadora(this.data.idLavadora)
                this.modalReiniciar = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se a cerrado el proceso Exitosamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.$emit('updatePage', '200')
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        terminar(id){

            let token = this.$session.get('token')
            fetch(this.url+`orden/proceso/${id}`,{
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
                    // this.activarLavadora(this.data.idLavadora)
                    this.modalShowDetail = false
                    this.openNotification(`Exito: ${data.mensaje}`, `Se a cerrado el proceso Exitosamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })

        },
        async aperturarLavadora(status){
            if(status == 200){
                this.comfirm = false
                this.activarLavadora(this.data.idHist, true)
            }else{
                this.openNotification( `Error: ¡No autorizado!`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
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
                        "idOrdenPrenda": this.data.detalleMaquinada[0].idOrdenPrenda,
                        "idHist": this.data.detalleMaquinada[0].id

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
        },
        limitDecimal(num) {
            return parseFloat(num.toFixed(2));
        }
    }
}
</script>
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


/* From Uiverse.io by naveenkumarr-onyx */ 
/* .card {
  width: 190px;
  height: 254px;
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px;
  overflow: visible;
} */

.card .item {
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  /* flex-direction: column;
  align-items: center;
  justify-content: center; */
}

.item:hover {
  transform: scale(1.1);
  transition: all 1s ease-in-out;
  /* rotate: 360deg; */
  z-index:9;
}

.item svg {
  width: 40px;
  height: 40px;
  margin-bottom: 7px;
}

.item--1 {
  background: #e0e0e1;
}


.quantity {
  font-size: 25px;
  font-weight: 600;
}

.text {
  font-size: 12px;
  font-family: inherit;
  font-weight: 600;
}

.text--1 {
  color: rgb(181, 181, 181);
}

.mt-card{
    margin-top: -5rem;
}

</style>
