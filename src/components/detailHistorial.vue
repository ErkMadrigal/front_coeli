<template>
    <div>
        <b-card class="mb-4 p-2" v-if="render">
            <b-row>
                <b-col cols="10">
                    <div class='badge bg-primary text-wrap float-end' >
                        {{ dataHitorial.historial.estado }}
                    </div>
                    <h4 class="mb-5 ">
                        {{ dataHitorial.historial.pasoProceso.nombre }}
                    </h4>
                    
                </b-col>
            </b-row>
            <h5 class="fw-lighter">{{dataHitorial.historial.pasoProceso.descripcion}}</h5>
            
            
            <div class="mt-1">
                <label for="tipoLavado">Tipo de Lavado: </label>                                    
                <strong>
                    {{ dataHitorial.historial.pasoProceso.idTipoLavado ? tipoLavado : "No aplica tipo de lavado" }} 
                </strong>
            </div>
           
            <div class="mt-1">
                <label for="tipoLavado">Lavadora en uso: </label>                                    
                <strong>
                    {{ dataHitorial.historial.lavadora ? lavadora : "No aplica uso de Lavadora" }} 
                </strong>
            </div>
        </b-card>
        <b-skeleton-img v-else style="border-radius: 1rem;"></b-skeleton-img>

    </div>
</template>
  
<script>
import { fetchApi } from "@/service/service.js"

export default {
    name:"CardDetailHitorialnComponent",
    props: {
        dataHitorial: Object,
    },
    components: {
    },
    data: () => ({
        
        tipoLavado: '',
        programaLavado: '',
        lavadora: '',
        render: false,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    mounted(){
        this.dataHitorial.historial.pasoProceso.idTipoLavado ? this.mostrarTipoLavado(this.dataHitorial.historial.pasoProceso.idTipoLavado) : ''
        this.dataHitorial.historial.pasoProceso.idProgramaLavado ? this.mostrarProgramaLavado(this.dataHitorial.historial.pasoProceso.idProgramaLavado) : '' 
        this.dataHitorial.historial.lavadora ? this.mostrarLavadoraEnUso(this.dataHitorial.historial.lavadora) : '' 
        setInterval(() => {
            this.render = true
        }, 1000);
    },
    methods:{

        mostrarTipoLavado(id){
            fetchApi(this.url+`tipoLavado/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavado = data.datos.nombre
                }
            })
        },

        mostrarProgramaLavado(id){
            fetchApi(this.url+`lavadora/programa/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.programaLavado =  {nombre: data.datos.nombre, descripcion: data.datos.descripcion, cantidadMinima: data.datos.cantidadMinima, cantidadMaxima: data.datos.cantidadMaxima}
                }
            })
        },
        mostrarLavadoraEnUso(id){
            fetchApi(this.url+`lavadora/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadora =  data.datos.lavadora
                }
            })
        },
    }
}
</script>
<style>
.card{
    border-radius: 1rem;
}
.modal-xl{
    margin-top: 5rem;
}

.vs-input{
    width: 95%;
}
.vs-select--state-null{
    width: 100%;
    margin-bottom: 1rem;
}
</style>
