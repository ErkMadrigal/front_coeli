<template>
        
    <b-card :title="dataRastreo.prendas[0].nomCliente" :sub-title="'Id Orden' + dataRastreo.idOrden">
        <v-row justify="space-between">
            <v-col cols="10">
                <strong>Fecha Recepcion: </strong> {{ fecha(dataRastreo.fechaRecepcion) }}
                <br>
                <strong>Fecha Entrega: </strong> {{ fecha(dataRastreo.fechaEntrega) }}
            </v-col>
            <v-col class="text-right" cols="2">
                <div class='badge bg-primary text-wrap float-start' >
                    {{ dataRastreo.nombreEstado }}
                </div>
            </v-col>
        </v-row>
        <br>
        <v-timeline  dense >
            <v-timeline-item  color="deep-purple lighten-1"  v-for="(rs, i) in dataRastreo.prendas" :key="i">
                <v-card class="elevation-2">
                    <div class='badge bg-primary text-wrap float-end' >
                        {{ rs.nombreEstado }}
                    </div>
                    <v-card-title class="text-h5">
                        <strong>Fecha Alta: </strong> {{ fecha(rs.fechaAlta) }}
                        <strong>Ultimo Movimiento: </strong> {{ fecha(rs.ultimoEstado) }}
                    </v-card-title>
                    <v-card-text>
                        <div class="mt-1">
                            <label for="descripcion">cantidad: </label>
                            <strong>{{rs.cantidad}}</strong>
                        </div>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </b-card>
                    

</template>

<script>
import { refreshSession, fetchApi } from "@/service/service.js"
import moment from 'moment'

export default {
    name:"rastreoOrdenesView",
    props: {
        dataRastreo: Object,
    },
    data: () => ({
        nombreUs1: '',
        nombreUs2: '',
        lavadora: '',
        tipoLavado: '',
        programaLavado: '',
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    
    components: {
    },
    created(){
        moment.locale('es');  
        
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })

    },
    mounted(){

    },
    methods: {
        
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        
        fecha(fecha){
            let fechaCorta = fecha.split("T")

            moment.locale('es')
            return moment(fechaCorta[0]).format("LL");  
        },
        
        buscarUsuario(id, tipo){
            fetchApi(this.url+`usuario/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    let dd = data.datos
                    if(tipo == 1){
                        this.nombreUs1 = `${dd.nombre} ${dd.paterno} ${dd.materno}`
                    }else{
                        this.nombreUs2 = `${dd.nombre} ${dd.paterno} ${dd.materno}`
                    }
                }
            })
        },
        buscarTipoLavado(id){
            fetchApi(this.url+`tipoLavado/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavado = data.datos.nombre
                }
            })
        },

        buscarProgramaLavado(id){
            fetchApi(this.url+`lavadora/programa/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.programaLavado =  {nombre: data.datos.nombre, descripcion: data.datos.descripcion, cantidadMinima: data.datos.cantidadMinima, cantidadMaxima: data.datos.cantidadMaxima}
                }
            })
        },
        buscarLavadora(id){
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
body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    background: #f1f1f1 !important;
}
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}
</style>

<style>

.centerAll{
    display: grid;
    place-items: center;
}

.card{
    border-radius: 1rem;
}
.vs-input{
    width: 100%;
}

</style>