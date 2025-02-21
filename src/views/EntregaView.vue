<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <b-tabs content-class="mt-3" align="center"  @click="updatePage(200)">
                    <b-tab title="Ordenes Concluidas"  @click="updatePage(200)" active>
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
                                            v-model="searchQueryO"
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
                            <b-col  class="mt-4" lg="3" md="4" sm="6" v-for="(dt, i) in filteredConsultasO" :key="i">
                                <EntregasComponent @updatePage="updatePage" :data="dt"></EntregasComponent>
                            </b-col>
                        </b-row>
                        <vs-alert class="mt-5" v-if="filteredConsultasO.length === 0" shadow danger>
                            <template #title>
                                No se han encontrado datos
                            </template>
                        </vs-alert>
                    </b-tab>
                    <b-tab title="Prendas Concluidas" @click="updatePage(200)">
                        <b-row>
                            <b-col  class="mt-4" lg="3" md="4" sm="6" v-for="(dt, i) in filteredConsultasP" :key="i">
                                <ProcesandoComponent @updatePage="updatePage" :data="{data:dt}"></ProcesandoComponent>
                            </b-col>
                        </b-row>
                        <vs-alert class="mt-5" v-if="filteredConsultasP.length === 0" shadow danger>
                            <template #title>
                                No se han encontrado datos
                            </template>
                        </vs-alert>
                    </b-tab>
                </b-tabs>
            </template>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';
import EntregasComponent from '@/components/cardEntrega.vue';
import ProcesandoComponent from '@/components/cardProcesando.vue';
import moment from 'moment';


export default {
    name:"EntregaView",
    data: () => ({
        isExpanded: false,
        filteredConsultasO: [],
        filteredConsultasP: [],
        searchQueryO: "",
        searchQueryP: "",

        getDatos: [],
        procesando: false,
        buscar: false,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        loginComponent,
        EntregasComponent,
        ProcesandoComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostraPrendas()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
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
        filterConsultasO() {
            if (this.searchQueryO) {
                const query = this.searchQueryO.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
                this.filteredConsultasO = this.getDatos[0].filter(consulta => {
                    // Buscar en todas las propiedades relevantes
                    return (
                        (consulta.prendas[0].nomCliente && consulta.prendas[0].nomCliente.toLowerCase().includes(query)) ||
                        (this.fecha(consulta.fechaEntrega) && this.fecha(consulta.fechaEntrega).toLowerCase().includes(query))||
                        (this.fecha(consulta.fechaRecepcion) && this.fecha(consulta.fechaRecepcion.toLowerCase()).includes(query))
                    );
                });
            } else {
                // Si no hay texto de búsqueda, muestra todas las cards
                this.filteredConsultasO = this.getDatos[0];
            }
            console.log(this.filteredConsultasO)


        },
        filterConsultasP() {
            if (this.searchQueryP) {
                const query = this.searchQueryP.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
                this.filteredConsultasP = this.getDatos[1].filter(consulta => {
                    // Buscar en todas las propiedades relevantes
                    return (
                        (consulta.nomCliente && consulta.nomCliente.toLowerCase().includes(query)) ||
                        (consulta.nombrePaso && consulta.nombrePaso.toLowerCase().includes(query)) ||
                        (consulta.nombrePrenda && consulta.nombrePrenda.toLowerCase().includes(query))||
                        (consulta.nombreSigPaso && consulta.nombreSigPaso.toLowerCase().includes(query))||
                        (consulta.tipoLavado && consulta.tipoLavado.toLowerCase().includes(query))||
                        (consulta.folio && consulta.folio.toLowerCase().includes(query))||
                        (consulta.descripcionEstado && consulta.descripcionEstado.toLowerCase().includes(query))||
                        (this.fecha(consulta.fechaEntrega) && this.fecha(consulta.fechaEntrega).toLowerCase().includes(query))||
                        (this.fecha(consulta.fhAlta) && this.fecha(consulta.fhAlta.toLowerCase()).includes(query))
                    );
                });
            } else {
                // Si no hay texto de búsqueda, muestra todas las cards
                this.filteredConsultasP = this.getDatos[1];
            }
            // console.log(this.filteredConsultasP)


        },
        async mostraPrendas(){
            this.getDatos = []
            fetchApi(this.url+`orden/terminados`, 'GET', this.$session.get('token'))
            .then(data => {
                
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    if(data.datos.length != 0){
                        data.datos.forEach( value => {
                           this.getDatos.push(value) 
                        })
                    }

                    this.filteredConsultasO = this.getDatos[0];
                    this.filteredConsultasP = this.getDatos[1];
                }else{
                    this.getDatos = []
                }
                
                // console.log(this.getDatos)

            })
            .catch(err => console.log(err))
        },
           
        updatePage(status){
            if(status == 200){
                this.mostraPrendas()
            }
        },
        fecha(fechaLarga){
            let fecha = fechaLarga.split("T")
            moment.locale('es')
            return moment(fecha[0]).format("LL")
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
    watch: {
        searchQueryO() {
            // Observa cambios en el texto de búsqueda y filtra las cards
            this.filterConsultasO();
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
.vs-component--primary{
    /* height: 2rem !important; */
    /* background: radial-gradient(#939393, transparent); */
}
.vs-switch__circle{
    height: 1.5rem;
    width: 1.5rem;
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
</style>