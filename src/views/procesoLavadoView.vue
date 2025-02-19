<template>
    <div>
        <HeaderComponent/>
        <br>
        <b-container fluid class="mt-5">
            <b-container class="bv-example-row">
            <b-row >
                <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(proceso, i) in procesos" :key="i">
                    <CardProcesoUpdateComponent @updatePage="updatePage" :dataProceso="{codigo: proceso.codigo, nombre: proceso.nombre, pasos: proceso.pasos, id: proceso.id, estado: proceso.estado}" />
                </b-col>
            </b-row>
            <vs-alert v-if="sinData" shadow danger>
                <template #title>
                    No se han encontrado datos
                </template>
            </vs-alert>
        </b-container>
        </b-container>
        <br>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>
<script>
import HeaderComponent from '@/components/Header.vue';
import CardProcesoUpdateComponent from '@/components/cardProcesoUpdate.vue';
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';


export default {
    name:"PrendasView",
    data: () => ({
        procesos: [],
        sinData: false,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        loginComponent,
        CardProcesoUpdateComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostrarProcesos()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
    
        async mostrarProcesos(){
            
            fetchApi(this.url+'proceso/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.procesos = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.procesos = data.datos
                    if(this.procesos.length == 0){
                        this.sinData == true
                    }
                }else{
                    this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async updatePage(status){
            if(status == 200){
                this.mostrarProcesos()
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
    width: 100%;
}
.card{
    border-radius: 1rem;
}
.ml-5 .vs-card{
    margin-left: auto!important
} 

.centerAll{
    display: grid;
    place-items: center;
}

.vs-card{
    padding: 0.5rem;
}
.vs-input{
    width: 95%;
}
.form-select{
    background: rgba(var(--vs-primary), 0.1) !important;
    color: rgba(var(--vs-primary), 1);
    width: 95%;
    border-radius: 1rem;
    height: 1rem;
}
</style>
