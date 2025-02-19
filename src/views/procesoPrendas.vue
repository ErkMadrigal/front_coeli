<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <b-tabs content-class="mt-3" align="center" >
                    <b-tab title="Por Procesar" active @click="updatePage(200)">
                            
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
                            <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cons, i) in filteredConsultas" :key="i">
                                <CardProcesoPrendaComponent @updatePage="updatePage" :data="cons"></CardProcesoPrendaComponent>
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
                            <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cp, i) in consultasProcesando" :key="i">
                                <CardProcesandoPrendaComponent v-if="cp.idEstado" @updatePage="updatePage" :data="cp"></CardProcesandoPrendaComponent>
                            </b-col>
                        </b-row>            
                        <vs-alert class="mt-5" v-if="sinDataProcesando" shadow danger>
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
import CardProcesoPrendaComponent from '@/components/cardProcesoPrenda.vue';
import CardProcesandoPrendaComponent from '@/components/cardProcesandoPrenda.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    data: () => ({
        searchQuery: "",
        filteredConsultas: [],
        consultas: [],
        sinData: false,
        sinDataProcesando: false,
        consultasProcesando: [],
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
        isExpanded: false,
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
                        (consulta.descripcionEstado && consulta.descripcionEstado.toLowerCase().includes(query))
                    );
                });
            } else {
                // Si no hay texto de búsqueda, muestra todas las cards
                this.filteredConsultas = this.consultas;
            }
            console.log(this.filteredConsultas)


        },
        async mostratConsultas() {
            this.consultas = [];
            this.consultasProcesando = [];
            fetchApi(this.url + 'orden/consulta', 'GET', this.$session.get('token'))
                .then(data => {
                    if (data.status == 401) { this.activarReboot = true; }
                    if (data.status == 200) {
                        data.datos.forEach(value => {
                            if (value.idEstado == null) {
                                this.consultas.push(value);
                                this.sinData = false;
                            } else {
                                this.consultasProcesando.push(value);
                                this.sinDataProcesando = false;
                            }
                        });
                        // Actualiza filteredConsultas con los datos cargados
                        this.filteredConsultas = this.consultas;
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
        searchQuery() {
            // Observa cambios en el texto de búsqueda y filtra las cards
            this.filterConsultas();
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
</style>