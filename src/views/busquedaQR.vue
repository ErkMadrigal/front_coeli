<template>
    <div>
        <HeaderComponent/>
        <br>
        
        <div class="container">
            <b-row class="container">
                <b-col lg="5" md="12" sm="12" class="mt-5 container p-3">
                    <b-card title="Buscar estado de la prenda">
                                
                        <vs-input
                            ref="buscarPrenda"
                            primary
                            class="mt-4"
                            block
                            type="number"
                            v-model="buscarPrenda"
                            label-placeholder="Numero de la papeleta"
                            icon-after
                            @click-icon="buscar"
                            @keyup.enter="buscar">
                            <template #icon>
                                <box-icon name='search-alt-2' color="#007bff"></box-icon>
                            </template>

                        </vs-input>
                    </b-card>
                    
                </b-col>
                <b-col lg="7" md="12" sm="12" class="mt-5 container p-3">
                   
                    <div class="spinner text-center" v-if="showSpinner">
                        <box-icon name='loader-circle' animation='spin' flip='horizontal' size="7rem"></box-icon>
                    </div>
                    <b-card v-if="mostrarInfo" :title="cliente" :sub-title="cantidadTotal">
                            <vs-button v-if="nombreEstado == 'TERMINADO'" circle icon floating primary @click="imprimirTicket(idOrdenPrena)">
                                <box-icon name='printer' color="#fff"></box-icon>
                            </vs-button>
                        <label>
                            Número de papeleta <br>
                            <strong>{{ numeroPapeleta }}</strong>
                        </label>
                        <div class="badge bg-success text-wrap float-end" >
                            {{ nombreEstado }}
                        </div>
                        <p>
                            <label for="Ingreso">
                                <strong>Ingreso: </strong> {{ fecha(new Date(fechaAlta)) }} 
                            </label><br>
                            <label for="Ingreso">
                                <strong>Ultimo Estado: </strong> {{ calcularTiempoTranscurrido(new Date(ultimoEstado)) }} 
                            </label><br>
                            <label for="Ingreso">
                                <strong>Número de Orden: </strong> {{ numeroOrden }} 
                            </label>
                        </p>
                        <hr>
                        <v-timeline dense clipped >
                            <v-timeline-item fill-dot class="white--text mb-12" color="orange" large>
                                <template v-slot:icon>
                                    <span><box-icon name='shower'></box-icon></span>
                                </template>
                            </v-timeline-item>
                            <br>
                            <v-timeline-item class="mb-4" color="primary" icon-color="grey lighten-2" small  v-for="(pa, i) in pasosAnt" :key="'ant-' +i">
                                
                                <b-card :title="pa.nombre" :sub-title="pa.descripcion">
                                    <div class="badge bg-primary text-wrap float-end" >
                                        {{ pa.estado }}
                                    </div>
                                    <br>
                                    <div v-if="pa.requiereAutorizacion" class="badge bg-danger text-wrap float-end" >
                                        Autorizado
                                    </div>
                                    <p>
                                        <label for="Cantidad">
                                            <strong>Cantidad: </strong>{{ pa.cantidad }}
                                        </label><br>
                                        <label for="Prenda">
                                            <strong>Prenda: </strong>{{ pa.nombrePrenda }}
                                        </label><br>
                                        <label for="pasoProceso">
                                            <strong>Proceso: </strong>{{ pa.pasoProceso.nombre }}<br>
                                            <strong>Descripcion: </strong>{{ pa.pasoProceso.descripcion }}<br>
                                            <strong>Personal Asignado: </strong>{{ pa.nomUsuario }}<br>
                                            <strong>Lavadora Asignada: </strong>{{ pa.nomLavadora }}<br>
                                            <p v-if="pa.idEstado == 8" class="fw-light text-muted">Tiempo Proceso {{ difFecha(pa.fechaInicio, pa.fechaFin) }}</p>
                                            <p v-else class="fw-light text-muted">En proceso</p>
                                        </label>

                                        <label for="Auth" v-if="pa.autorizacion != null">
                                            <hr>
                                            <strong>Fecha de Autorizacion: </strong>{{ fecha(new Date(pa.autorizacion.fechaAutoriza)) }}<br>
                                            <strong>Quien Autorizo: </strong>{{ pa.autorizacion.nomUsuario }}<br>

                                        </label>
                                        
                                        <label for="Auth" v-else>
                                            <hr>

                                        </label>
                                    </p>
                                </b-card>
                            </v-timeline-item>
                            <v-timeline-item class="mb-4" color="primary" icon-color="grey lighten-2" small  v-for="(pr, i) in pasosRestantes" :key="'rest-' +i">
                                <b-card :title="pr.nombre" :sub-title="pr.descripcion"></b-card>
                            </v-timeline-item>
                        </v-timeline>

                    </b-card>
                    <div class="center" v-else>
                        <vs-alert color="danger">
                            <template #title>
                                Sin datos, ingrese el codigo el codigo de barras
                            </template>
                        </vs-alert>
                    </div>
                </b-col>
            </b-row>

        </div>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>  
    </div>
</template>
  
<script>
    import HeaderComponent from '@/components/Header.vue';
    import loginComponent from '@/components/cardLogin.vue';
    import { refreshSession, fetchApi } from "@/service/service.js"
    import moment from 'moment';

    export default {
        data:() => ({
            showSpinner: false,
            mostrarInfo: false,
            idOrdenPrena: '',
            buscarPrenda: '',
            numeroPapeleta: '',
            numeroOrden: '',
            cantidadTotal: '',
            nombreEstado: '',
            ultimoEstado: '',
            fechaAlta: '',
            pasosAnt: [],
            pasosRestantes: [],
            showDetectionBox: false,
            detectionBoxStyle: {
                left: '0px',
                top: '0px',
                width: '0px',
                height: '0px',
            },
            cliente: '',
            url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
        }),
        components: {
            HeaderComponent,
            loginComponent

        },
        created(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            })
        },
        methods: {
            refresh(){
                refreshSession(this.url ,this.$session.get('token')).then( data => {
                    this.$session.start()
                    this.$session.set('token', data.datos.token)
                }) 
            },
            fecha(fecha){
                const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(fecha).toLocaleDateString(undefined, opciones);
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
            difFecha(inicio, final){
                let fechaCortaI = inicio.split("T")
                let fechaCortaF = final.split("T")
                let fecha1 = moment(`${fechaCortaI[0]} ${fechaCortaI[1].split(".")[0]}`, "YYYY-MM-DD HH:mm:ss")
                let fecha2 = moment(`${fechaCortaF[0]} ${fechaCortaF[1].split(".")[0]}`, "YYYY-MM-DD HH:mm:ss")
                // console.log(fecha2.diff(fecha1, 'h'))
                let res = ''
                let diff = fecha2.diff(fecha1, 'h')

                if(diff == 0){
                    diff = fecha2.diff(fecha1, 'm');
                    res = diff+" min(s)"
                }else{
                    res = diff+" hora(s)"
                }
                return res
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
            async buscar(){
                this.mostrarInfo = false
                this.showSpinner = true

                if(this.buscarPrenda != ''){
                    let t = this
                    this.numeroPapeleta = this.buscarPrenda
                    let buscar = this.buscarPrenda.slice(0, -1)
                    fetchApi(this.url+`orden/findByIdOrdenPrenda/${buscar}`, 'GET', this.$session.get('token'))
                    .then(data => {
                        if(data.status == 200){
                            

                            this.mostrarInfo = true;
                            this.idOrdenPrena = data.datos.idOrdenPrena
                            this.cliente = data.datos.nomCliente
                            this.cantidadTotal = 'Cantidad total de prendas '+data.datos.cantidad
                            this.nombreEstado = data.datos.nombreEstado
                            this.ultimoEstado = data.datos.ultimoEstado
                            this.fechaAlta = data.datos.fechaAlta
                            this.numeroOrden = data.datos.idOrden
                            // console.log(data.datos)
                            let idsPasos = [] 
                            this.pasosAnt = data.datos.historial
                            this.pasosAnt.forEach(element => {
                                idsPasos.push(element.pasoProceso.id)
                            });
                            fetchApi(this.url+`prenda/findById/${data.datos.idPrenda}`, 'GET', this.$session.get('token'))
                            .then(dataPenda => {
                                let pasos = [] 
                                pasos = dataPenda.datos.proceso.pasos
                                const objetosFiltrados = pasos.filter(objeto => !idsPasos.includes(objeto.id));
                                t.pasosRestantes = objetosFiltrados

                                
                            })
                            this.$refs.buscarPrenda.focus = true;

                            this.buscarPrenda = ''
                        }else{
                            this.mostrarInfo = false;

                            this.openNotification(`Ooops!:`, `No existes coincidencias`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                        }
                    })
                    .finally(() =>{
                        this.showSpinner = false
                        
                    })
                }else{
                    this.mostrarInfo = false;

                    this.openNotification(`Ooops! Error:`, `Es requerido un dato`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
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
            
        },
    };
</script>
  
<style scoped>
  #camera-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .detection-box {
    position: absolute;
    border: 8px solid #6c3 ;
    box-sizing: border-box;
    pointer-events: none;
  }
  .buscarPrenda{
    width: 90%;
  }
</style>
  