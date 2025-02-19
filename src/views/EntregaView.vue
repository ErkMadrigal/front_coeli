<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <b-tabs content-class="mt-3" align="center"  @click="updatePage(200)">
                    <b-tab title="Ordenes Concluidas"  @click="updatePage(200)" active>
                        <b-row>
                            <vs-alert class="mt-5" v-if="!mostraEntregas" shadow danger>
                                <template #title>
                                    No se han encontrado datos
                                </template>
                            </vs-alert>
                            <b-col  class="mt-4" lg="3" md="4" sm="6" v-for="(dt, i) in getDatos[0]" :key="i">
                                <EntregasComponent @updatePage="updatePage" :data="{dt}"></EntregasComponent>
                                <!-- <EntregasComponent @updatePage="updatePage" :data="{idOrden: dt.idOrden, idCliente: dt.idCliente, nombreEstado: dt.nombreEstado, prendas: dt.prendas, idOrdenPrena: dt.idOrdenPrena, fechaEntrega:dt.fechaEntrega}"></EntregasComponent> -->
                            </b-col>
                        </b-row>
                    </b-tab>
                    <b-tab title="Prendas Concluidas" @click="updatePage(200)">
                        <b-row>
                            <vs-alert class="mt-5" v-if="!mostraProcesos" shadow danger>
                                <template #title>
                                    No se han encontrado datos
                                </template>
                            </vs-alert>
                            <b-col  class="mt-4" lg="3" md="4" sm="6" v-for="(dt, i) in getDatos[1]" :key="i">
                                <ProcesandoComponent @updatePage="updatePage" :data="{data:dt}"></ProcesandoComponent>
                            </b-col>
                        </b-row>
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


export default {
    name:"EntregaView",
    data: () => ({
        getDatos: [],
        procesando: false,
        mostraEntregas: false,
        mostraProcesos: false,
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
                }else{
                    this.getDatos[0] = []
                    this.getDatos[1] = []
                }
                if(this.getDatos[1].length){
                    this.mostraProcesos = true
                }
                
                if(this.getDatos[0].length){
                    this.mostraEntregas = true
                }

            })
            .catch(err => console.log(err))
        },
           
        updatePage(status){
            if(status == 200){
                this.mostraPrendas()
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