<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <b-tabs content-class="mt-3" align="center" >
                    <b-tab title="Por Procesar" active @click="updatePage(200)">
                            
                        <b-row>
                            <b-col class="" lg="12" md="12" sm="12">
                                <!-- Transición para animar la expansión/contracción -->
                                <transition name="scale-in-hor-left">
                                    <b-card v-if="isExpanded" class="expanded-card">
                                        <!-- Botón de cerrar -->
                                        <div class="close-btn" @click="contractCard">
                                            <box-icon name='x' color="#007bff"></box-icon>
                                        </div>

                                        <!-- Título "Buscar Orden" -->
                                        <h4 class="mb-4">Buscar Orden</h4>

                                        <!-- Campo de búsqueda -->
                                        <vs-input
                                            ref="buscarPrenda"
                                            primary
                                            class="mt-4"
                                            block
                                            type="text"
                                            icon-after
                                            v-model="searchQuery"
                                        >
                                            <template #icon>
                                                <box-icon name='search-alt-2' color="#007bff"></box-icon>
                                            </template>
                                        </vs-input>
                                    </b-card>
                                </transition>

                                <!-- Ícono de lupa (solo visible cuando el card no está expandido) -->
                                <div v-if="!isExpanded" class="icon-only" @click="expandCard">
                                    <box-icon name='search-alt-2' color="#007bff"></box-icon>
                                </div>
                            </b-col>
                            <b-col class="" lg="12" md="12" sm="12">
                            
                                <div 
                                    class="drop-zone"
                                    @dragover.prevent
                                    @dragenter="onDragEnter"
                                    @dragleave="onDragLeave"
                                    @drop="onDrop"
                                    ref="dropZone"
                                    :class="{
                                        'dragging': isDragging,
                                        'card-error': showError,
                                        'card-success': showSuccess
                                    }"
                                    >
                                    <div class="icon-only-drop icon-only">
                                        <vs-avatar badge badge-color="success" badge-position="top-right">
                                            <template #badge>
                                                {{droppedItemsCount}}
                                            </template>
                                            <box-icon type='solid' name='washer' color="#007bff"></box-icon>
                                        </vs-avatar>
                                    </div>
                                    <b-row class="mt-2">
                                        <b-col  v-for="(prenda, i) in prendas" :key="i">
                                            
                                            <b-card :title="prenda.nombreCliente" 
                                            :sub-title="prenda.prenda"
                                            :class="animate ? 'slide-in-blurred-right':''"
                                            >
                                            <div class="fixed">
                                                <div class="top m-2" @click="eliminar(i+1)" style="cursor: pointer;">
                                                    <box-icon name='trash' type='solid' color="rgb(242, 19, 93)" ></box-icon>
                                                </div>
                                            </div>
                                            <p class="text-center">
                                                Folio: {{ prenda.folio }} <br>
                                                cantidad: {{ prenda.cantidad }} <br>
                                                Tipo Lavado: {{ prenda.tipoLavado }}
                                            </p>
                                            </b-card>
                                        </b-col>
                                    </b-row>
                                        <vs-button class="mt-5" v-if="prendas.length > 1" block flat primary @click="modalIniciar =! modalIniciar"> Iniciar ({{ canTotal }} KG a ingresar)</vs-button> 
                                        <vs-dialog blur  v-model="modalIniciar">
                                            <template #header>
                                                <h4 class="not-margin">
                                                    Iniciar <b>Proceso Conbinado?</b>
                                                </h4>
                                            </template>
                            
                                            <div class="con-form">
                                                <div class="center  con-selects" >
                                                    <vs-select style="max-width:100%!important;" class="mt-3" success label-placeholder="Lavadora" color="success"  v-model="tipoLavadora">
                                                        <vs-option-group>
                                                            <div slot="title">
                                                                Selecciona una opcion
                                                            </div>
                                                            <vs-option  v-for="(lavado, i) in getLavado" :key="i" 
                                                            :label="`${lavado.lavadora} - Max: ${(lavado.max / 100) * lavado.kilos} Min: ${(lavado.min / 100) * lavado.kilos}`" 
                                                            :value="lavado.idLavadora">
                                                                {{ lavado.lavadora }}  Max.: {{ (lavado.max/100)*lavado.kilos }} KG  Min.: {{ (lavado.min/100)*lavado.kilos }} KG
                                                            </vs-option>
                                                        </vs-option-group>
                                                    </vs-select>
                                                    <vs-select 
                                                        style="max-width:100%!important;" class="mt-3" success label-placeholder="Motivo" color="success" 
                                                         v-model="idMotivoMaquinada">
                                                        <vs-option-group>
                                                            <div slot="title">
                                                                Selecciona una motivo
                                                            </div>
                                                            <vs-option  v-for="(motivo, i) in motivos" :key="i" 
                                                            :label="motivo.motivo" 
                                                            :value="motivo.id">
                                                                {{ motivo.motivo }}
                                                            </vs-option>
                                                        </vs-option-group>
                                                    </vs-select>

                                                </div>
                                            </div>
                                            <template #footer>
                                                <div class="footer-dialog" >
                                                    <vs-button  class="mt-3" block @click="iniciar()" :disabled="iniciarProceso">
                                                        <box-icon v-if="iniciarProceso" name='loader' flip='vertical' animation='spin' color='#ffffff' ></box-icon>
                                                        Iniciar 
                                                    </vs-button>
                                                </div>
                                            </template>
                                        </vs-dialog>
                                </div>
                            </b-col>

                            <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cons, i) in filteredConsultas" :key="i">
                                <div 
                                    class="card-wrapper"
                                    draggable="true"
                                    @dragstart="onDragStart($event, cons)"
                                    @dragend="onDragEnd"
                                    
                                >
                                    <CardProcesoPrendaComponent 
                                        @updatePage="updatePage" 
                                        :data="cons"
                                    />
                                </div>
                            </b-col>
                        </b-row>            
                        <vs-alert class="mt-5" v-if="filteredConsultas.length === 0" shadow danger>
                            <template #title>
                                No se han encontrado datos
                            </template>
                        </vs-alert>
                    </b-tab>
                    <b-tab title="Procesando"  @click="updatePage(200)" >
                        <b-row>
                            <b-col class="mt-4" lg="12" md="12" sm="12">
                                <!-- Transición para animar la expansión/contracción -->
                                <transition name="scale-in-hor-left">
                                    <b-card v-if="isExpanded" class="expanded-card">
                                        <!-- Botón de cerrar -->
                                        <div class="close-btn" @click="contractCard">
                                            <box-icon name='x' color="#007bff"></box-icon>
                                        </div>

                                        <!-- Título "Buscar Orden" -->
                                        <h4 class="mb-4">Buscar Orden</h4>

                                        <!-- Campo de búsqueda -->
                                        <vs-input
                                            ref="buscarPrenda"
                                            primary
                                            class="mt-4"
                                            block
                                            type="text"
                                            icon-after
                                            v-model="searchQueryP"
                                        >
                                            <template #icon>
                                                <box-icon name='search-alt-2' color="#007bff"></box-icon>
                                            </template>
                                        </vs-input>
                                    </b-card>
                                </transition>

                                <!-- Ícono de lupa (solo visible cuando el card no está expandido) -->
                                <div v-if="!isExpanded" class="icon-only" @click="expandCard">
                                    <box-icon name='search-alt-2' color="#007bff"></box-icon>
                                </div>
                            </b-col>
                            <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cp, i) in filteredConsultasP" :key="i">
                                <CardProcesandoPrendaComponent @updatePage="updatePage" :data="cp"></CardProcesandoPrendaComponent>
                            </b-col>
                        </b-row>            
                        <vs-alert class="mt-5" v-if="filteredConsultasP.length === 0" shadow danger>
                            <template #title>
                                No se han encontrado datos
                            </template>
                        </vs-alert>
                    </b-tab>
                </b-tabs>

                <vs-dialog blur v-model="cantidadCobinado">
                    <template #header>
                        <h4 class="not-margin">
                            Seguro que deseas agregar <b> la orden? </b>
                        </h4>
                    </template>
                    <div class="con-form">
                        <template>
                            <p>Cliente <b> {{nombreCliente}} </b></p>
                            <p>Prenda <b> {{prenda}} </b></p>
                            <p>Folio <b> {{folio}} </b></p>
                            <p>Cantidad <b> {{cantidadOriginal}} </b></p>
                            
                            <div class="center content-inputs">
                                <vs-input danger type="number" v-model="cantidadPrendasConbinar" label-placeholder="Digita una cantidad">
                                    <template #icon>
                                        <box-icon name='dialpad-alt' ></box-icon>
                                    </template>
                                </vs-input>
                            </div>
                        </template>
                    </div>

                    <template #footer>
                        <div class="con-footer mt-4">
                            <vs-button primary
                                block
                                flat
                                @click="confimar()">
                                confirmar
                            </vs-button>
                        </div>
                    </template>
                </vs-dialog>
            </template>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import CardProcesoPrendaComponent from '@/components/cardProcesoPrenda.vue';
import CardProcesandoPrendaComponent from '@/components/cardProcesandoPrenda.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    data: () => ({
        idMotivoMaquinada:'',
        canTotal: 0,
        animate: false,
        modalIniciar: false,
        iniciarProceso: false, 
        tipoLavadora: '',
        prendas:[],
        searchQuery: "",
        searchQueryP: "",
        filteredConsultas: [],
        filteredConsultasP: [],
        consultas: [],
        motivos: [],
        sinData: false,
        sinDataProcesando: false,
        consultasProcesando: [],
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
        isExpanded: false,
        cantidadCobinado: false,
        cantidadPrendasConbinar: "",
        cantidadPorKilo: "",
        droppedItemsCount: 0,
        isDragging: false,
        cantidadOriginal: "",
        nombreCliente:"",
        prenda:"",
        tipoLavado: "",
        folio: "",
        idPaso: "",
        idTipoLavado: "",
        idOrdenPrenda: "",
        showError: false,
        showSuccess: false,
        currentDraggedItem: null,
        nombreTipoLavado: "",
        getLavado: [],
    }),
    components: {
        CardProcesoPrendaComponent,
        CardProcesandoPrendaComponent,
        HeaderComponent,
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostratConsultas();
        this.mostrarMotivo()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        prendTotal(){
           this.canTotal =  this.prendas.reduce((acumulador, valorActual) =>{
            //    console.log(acumulador, valorActual) 
               return acumulador +  (parseFloat(valorActual.cantidad)/parseFloat(valorActual.cantidadPorKilo))

           },0)
        },
        async mostrarLavadoras(id){
            fetchApi(this.url+`lavadora/findByTipoLavado/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 200){
                    this.getLavado = data.datos 
                } 
            })
        },
        onDragStart(event, item) {
            this.isDragging = true
            event.dataTransfer.setData('text/plain', JSON.stringify(item))
            event.dataTransfer.effectAllowed = 'move'
            
            // Efecto visual durante el arrastre
            event.target.classList.add('dragging')
        },
        
        onDragEnd() {
            this.isDragging = false
            document.querySelectorAll('.dragging').forEach(el => {
                el.classList.remove('dragging')
            })
        },
        
        onDragEnter(event) {
            event.target.classList.add('drag-over')
        },
        
        onDragLeave(event) {
            event.target.classList.remove('drag-over')
        },
        
        onDrop(event) {
            event.preventDefault()
            event.target.classList.remove('drag-over')
            
            const data = event.dataTransfer.getData('text/plain')
            if (!data) return
            
            const droppedItem = JSON.parse(data)
            this.idTipoLavado = droppedItem.idTipoLavado
            
            if(this.prendas.length > 0){

                let prendaLider = this.prendas[0].idTipoLavado
                if(prendaLider == this.idTipoLavado){
                    this.mostrarLavadoras(prendaLider)
                    this.handleValidDrop(droppedItem)
                    this.cantidadCobinado = true
                }else{
                    this.handleInvalidDrop()

                }
            }

            if(this.prendas.length == 0){
                this.cantidadCobinado = true
                this.animate = true

            }
            this.nombreTipoLavado = droppedItem.tipoLavado
            this.idOrdenPrenda = droppedItem.idOrdenPrenda
            this.idPaso = droppedItem.idPaso
            this.prenda = droppedItem.nombrePrenda
            this.nombreCliente = droppedItem.nomCliente
            this.folio = droppedItem.folio
            this.cantidadOriginal = droppedItem.cantidadPrendas
            this.cantidadPorKilo = droppedItem.cantidadPorKilo
            
            // Incrementar contador
            
            // Aquí puedes hacer lo que necesites con el elemento soltado
            // Por ejemplo emitir un evento al padre:
            this.$emit('item-dropped', droppedItem)
        },
        
        confimar(){
            this.prendas.push({
                    "id": this.prendas.length+1,
                    "idOrdenPrenda": this.idOrdenPrenda,
                    "cantidad": this.cantidadPrendasConbinar,
                    "idPasoProceso": this.idPaso,
                    "idTipoLavado": this.idTipoLavado,
                    "prenda": this.prenda,
                    "folio": this.folio,
                    "nombreCliente": this.nombreCliente,
                    "tipoLavado": this.nombreTipoLavado,
                    "cantidadPorKilo": this.cantidadPorKilo
            })
            this.droppedItemsCount = this.prendas.length
            this.cantidadPrendasConbinar = ""
            this.cantidadCobinado = false
            this.prendTotal()
        },

        handleValidDrop(item) {
            this.showSuccess = true
            this.showError = false
            
            
            // Emitir evento al padre
            this.$emit('item-dropped', item)
            
            // Resetear animación después de 1 segundo
            setTimeout(() => {
                this.showSuccess = false
            }, 1000)
        },
        
        handleInvalidDrop() {
            this.showError = true
            this.showSuccess = false
            
            // Resetear animación después de 1 segundo
            setTimeout(() => {
                this.showError = false
            }, 1000)
        },

        async mostrarMotivo(){
            this.motivos = []
            fetchApi(this.url+'motivo/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.motivos = data
            })
        },
      
        eliminar(eliminar){
            const nuevoArray = this.prendas.filter(prenda => prenda.id !== eliminar);
            this.prendas = nuevoArray
            this.tipoLavadora = ''
        },
        async iniciar(){
            
            this.iniciarProceso = true;

            let token = this.$session.get('token')

            let json = {
                "idMotivoMaquinada": this.idMotivoMaquinada,
                "idLavadora": this.tipoLavadora,
                "prendas": this.prendas,
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
                this.prendas = []
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
        expandCard() {
            this.isExpanded = true; // Expande el card
            this.$nextTick(() => {
                // Asegura que el campo de búsqueda esté en el DOM antes de enfocarlo
                if (this.$refs.buscarPrenda && this.$refs.buscarPrenda.$el) {
                    this.$refs.buscarPrenda.$el.querySelector('input').focus();
                }
            });
        },
        contractCard() {
            this.isExpanded = false; // Contrae el card
        },
        filterConsultas() {
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
                this.filteredConsultas = this.consultas.filter(consulta => {
                    // Buscar en todas las propiedades relevantes
                    return (
                        (consulta.nomCliente && consulta.nomCliente.toLowerCase().includes(query)) ||
                        (consulta.nombrePaso && consulta.nombrePaso.toLowerCase().includes(query)) ||
                        (consulta.nombrePrenda && consulta.nombrePrenda.toLowerCase().includes(query))||
                        (consulta.nombreSigPaso && consulta.nombreSigPaso.toLowerCase().includes(query))||
                        (consulta.tipoLavado && consulta.tipoLavado.toLowerCase().includes(query))||
                        (consulta.folio && consulta.folio.toLowerCase().includes(query))||
                        (consulta.descripcionEstado && consulta.descripcionEstado.toLowerCase().includes(query))||
                        (consulta.idOrdenLavado.toString() && consulta.idOrdenLavado.toString().includes(query))||
                        (this.obtenerFechaBonita(consulta.fechaEntrega) && this.obtenerFechaBonita(consulta.fechaEntrega).toLowerCase().includes(query))||
                        (this.obtenerFechaBonita(consulta.fhAlta) && this.obtenerFechaBonita(consulta.fhAlta.toLowerCase()).includes(query))
                    );
                });
            } else {
                // Si no hay texto de búsqueda, muestra todas las cards
                this.filteredConsultas = this.consultas;
            }


        },
        filterConsultasP() {
            if (this.searchQueryP) {
                const query = this.searchQueryP.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
                this.filteredConsultasP = this.consultasProcesando.filter(consulta => {
                    // Buscar en todas las propiedades relevantes
                    return (
                        (consulta.nomCliente && consulta.nomCliente.toLowerCase().includes(query)) ||
                        (consulta.nombrePaso && consulta.nombrePaso.toLowerCase().includes(query)) ||
                        (consulta.nombrePrenda && consulta.nombrePrenda.toLowerCase().includes(query))||
                        (consulta.nombreSigPaso && consulta.nombreSigPaso.toLowerCase().includes(query))||
                        (consulta.tipoLavado && consulta.tipoLavado.toLowerCase().includes(query))||
                        (consulta.folio && consulta.folio.toLowerCase().includes(query))||
                        (consulta.descripcionEstado && consulta.descripcionEstado.toLowerCase().includes(query))||
                        (consulta.idOrdenLavado.toString() && consulta.idOrdenLavado.toString().includes(query))||
                        (this.obtenerFechaBonita(consulta.fechaEntrega) && this.obtenerFechaBonita(consulta.fechaEntrega).toLowerCase().includes(query))||
                        (this.obtenerFechaBonita(consulta.fhAlta) && this.obtenerFechaBonita(consulta.fhAlta.toLowerCase()).includes(query))
                    );
                });
            } else {
                // Si no hay texto de búsqueda, muestra todas las cards
                this.filteredConsultasP = this.consultasProcesando;
            }


        },
        async mostratConsultas() {
            this.consultas = [];
            this.consultasProcesando = [];
            fetchApi(this.url + 'orden/consulta', 'GET', this.$session.get('token'))
                .then(data => {
                    if (data.status == 401) { this.activarReboot = true; }
                    if (data.status == 200) {
                        
                        data.datos.pendientes.forEach(value => {
                            // if (value.idEstado == null) {
                                this.consultas.push(value);
                                this.sinData = false;
                            // } else {
                            //     this.consultasProcesando.push(value);
                            //     this.sinDataProcesando = false;
                            // }
                        });
                        data.datos.maquinadas.forEach(value => {
                                this.consultasProcesando.push(value);
                                this.sinDataProcesando = false;
                        });
                        // Actualiza filteredConsultas con los datos cargados
                        this.filteredConsultas = this.consultas;
                        this.filteredConsultasP = this.consultasProcesando;
                        // console.log(this.filteredConsultasP)
                    } else {
                        if (this.consultas.length == 0) {
                            this.sinData = true;
                        }
                        if (this.consultasProcesando.length == 0) {
                            this.sinDataProcesando = true;
                        }
                    }
                });
        },
        updatePage(status){
            if(status == 200){
                this.mostratConsultas()
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
    watch: {
        searchQuery() {
            // Observa cambios en el texto de búsqueda y filtra las cards
            this.filterConsultas();
        },
        searchQueryP() {
            // Observa cambios en el texto de búsqueda y filtra las cards
            this.filterConsultasP();
        },
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
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}

.vs-card{
    padding: 0.5rem;
}

.vs-input{
    width: 100%;
}

#vs-input--1785{
    width: 100%;
}


</style>

<style scoped>
/* Animación scale-in-hor-left */
@keyframes scale-in-hor-left {
    0% {
        transform: scaleX(0);
        transform-origin: 0% 0%;
        opacity: 0;
    }
    100% {
        transform: scaleX(1);
        transform-origin: 0% 0%;
        opacity: 1;
    }
}

.scale-in-hor-left-enter-active {
    animation: scale-in-hor-left 0.3s ease-out;
}

.scale-in-hor-left-leave-active {
    animation: scale-in-hor-left 0.3s ease-out reverse;
}

/* Estilo del card cuando está expandido */
.expanded-card {
    width: 100%; /* Ocupa todo el ancho */
    height: auto;
    position: relative; /* Para posicionar el botón de cerrar */
    padding-top: 40px; /* Espacio para el botón de cerrar */
}

/* Botón de cerrar */
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 1; /* Asegura que esté por encima del contenido */
}

.close-btn box-icon {
    transition: transform 0.2s ease;
}

.close-btn:hover box-icon {
    transform: scale(1.2); /* Efecto de escala al hacer hover */
}

/* Estilo inicial (solo ícono) */
.icon-only {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 50px;
    height: 50px;
    margin: 0 auto; /* Centrar el ícono */
    background-color: #f8f9fa; /* Fondo para que se vea como un card */
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra suave */
}


.icon-only box-icon {
    transition: transform 0.2s ease;
}

.icon-only:hover box-icon {
    transform: scale(1.2); /* Efecto de escala al hacer hover */
}

/* Estilo del título "Buscar Orden" */
h4 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff; /* Color azul para coincidir con el ícono */
    margin-bottom: 1rem; /* Espacio debajo del título */
}


/* drag and drop */
.card-wrapper {
  cursor: grab;
  transition: all 0.2s ease;
}

.card-wrapper.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  cursor: grabbing;
}

.drop-zone {
  margin-top: 2rem;
  padding: 2rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.drop-zone.drag-over {
  border-color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
  transform: scale(1.02);
}

.icon-only-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.icon-only-drop p {
  margin: 0;
  color: #007bff;
  font-weight: bold;
}

/* Efecto durante el arrastre sobre la zona de drop */
.drop-zone.drag-over .icon-only-drop {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}




/* Animaciones */
.drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(13, 110, 253, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
}

.drop-preview {
  background-color: #0d6efd;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  animation: pulse 1.5s infinite;
}

.drop-info {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}

.card-error {
  animation: shake 0.6s ease-in-out;
  border: 2px solid #dc3545;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
  background-color: rgba(220, 53, 69, 0.1);
}

@keyframes success {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.card-success {
  animation: success 0.8s ease-out;
  border: 2px solid #28a745;
  box-shadow: 0 0 10px rgba(40, 167, 69, 0.6);
  background-color: rgba(40, 167, 69, 0.1);
}

.fixed{
    display: flex;
}
.top{
    position: absolute;
    top: 10px;
    right: 0;
}

.scale-in-center {
  -webkit-animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
/* ----------------------------------------------
 * Generated by Animista on 2025-3-30 20:31:19
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation scale-in-center
 * ----------------------------------------
 */
 @-webkit-keyframes scale-in-center {
  0% {
    -webkit-transform: scale(0);
            transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 1;
  }
}
@keyframes scale-in-center {
  0% {
    -webkit-transform: scale(0);
            transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 1;
  }
}


.tilt-in-top-1 {
-webkit-animation: tilt-in-top-1 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
animation: tilt-in-top-1 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2025-3-30 20:40:0
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation tilt-in-top-1
 * ----------------------------------------
 */
 @-webkit-keyframes tilt-in-top-1 {
  0% {
    -webkit-transform: rotateY(30deg) translateY(-300px) skewY(-30deg);
            transform: rotateY(30deg) translateY(-300px) skewY(-30deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: rotateY(0deg) translateY(0) skewY(0deg);
            transform: rotateY(0deg) translateY(0) skewY(0deg);
    opacity: 1;
  }
}
@keyframes tilt-in-top-1 {
  0% {
    -webkit-transform: rotateY(30deg) translateY(-300px) skewY(-30deg);
            transform: rotateY(30deg) translateY(-300px) skewY(-30deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: rotateY(0deg) translateY(0) skewY(0deg);
            transform: rotateY(0deg) translateY(0) skewY(0deg);
    opacity: 1;
  }
}

.slide-in-blurred-right {
-webkit-animation: slide-in-blurred-right 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
animation: slide-in-blurred-right 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2025-3-30 20:42:17
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-in-blurred-right
 * ----------------------------------------
 */
 @-webkit-keyframes slide-in-blurred-right {
  0% {
    -webkit-transform: translateX(1000px) scaleX(2.5) scaleY(0.2);
            transform: translateX(1000px) scaleX(2.5) scaleY(0.2);
    -webkit-transform-origin: 0% 50%;
            transform-origin: 0% 50%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0) scaleY(1) scaleX(1);
            transform: translateX(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
}
@keyframes slide-in-blurred-right {
  0% {
    -webkit-transform: translateX(1000px) scaleX(2.5) scaleY(0.2);
            transform: translateX(1000px) scaleX(2.5) scaleY(0.2);
    -webkit-transform-origin: 0% 50%;
            transform-origin: 0% 50%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0) scaleY(1) scaleX(1);
            transform: translateX(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
}

</style>