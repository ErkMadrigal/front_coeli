<template>
    <div>
        <vs-button circle icon floating primary  @click="dataModal">
            <box-icon name='edit' color="#fff"></box-icon>
        </vs-button>
        
        <vs-dialog v-model="active">
            <template #header>
            <h4 class="not-margin">
                Editar <b>Lavadora</b>
            </h4>
            </template>
       
            <template>
                <div class="con-form">
                    <vs-input success type="text" v-model="nombreUp" class="mt-4" label-placeholder="Lavadora">
                        <template #icon>
                            <box-icon name='wind'></box-icon>
                        </template>
                    </vs-input>
                    <div class="con-selects mt-4">
                        <v-select
                            v-model="tipoLavado"
                            :options="tiposLavado"
                            label="nombre"
                            label-placeholder="Tipo de Lavado"
                            :reduce="option => option.id"
                            :searchable="true"
                            :clearable="false"
                        />
                    </div>
                    <vs-input success type="text" v-model="capKg" class="mt-4" label-placeholder="Capacidad en kilos">
                        <template #icon>
                            <box-icon name='wind'></box-icon>
                        </template>
                    </vs-input>
                    <vs-input success type="text" v-model="capMinima" class="mt-4" label-placeholder="Capacidad Minima">
                        <template #icon>
                            <box-icon name='wind'></box-icon>
                        </template>
                    </vs-input>
                    <vs-input success type="text" v-model="capMaxima" class="mt-4" label-placeholder="Capacidad Maxima">
                        <template #icon>
                            <box-icon name='wind'></box-icon>
                        </template>
                    </vs-input>
                </div>
            </template>
            
            <template #footer>
                <vs-button success
                    flat block
                    :btnActualizar="btnActualizar == 1"
                    @click="update(dataWasher.row.item.id)">
                    Actualizar
                </vs-button>
                <div v-if="(dataWasher.row.item.estado == 1)" class="">
                    <vs-button danger
                        flat block
                        :btnActualizar="btnElimina == 1"
                        @click="desactivar()">
                        Desactivar
                    </vs-button>
                </div>
                <div v-else>
                    <vs-button success
                        flat block
                        :btnActualizar="btnElimina == 1"
                        @click="activar()">
                        Activar
                    </vs-button>
                </div>
            </template>
            
        </vs-dialog>
        <vs-dialog v-model="active2">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Desactivarlo?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="deleteWasher"/>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
    
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"


export default {
    name: 'btnUpdateLavadora',
    props: {
        dataWasher: Object,
    },
    data:() => ({
        estado: '',
        contador: 0,
        programasItems: [],
        programasLavado: [],

        capMaxima: '',
        capMinima: '',
        capKg: '',
        tiposLavado: [],
        programas: [],
        active: false,
        active2: false,
        tipoLavado: '',
        progLavado: '',
        nombreUp: '',
        btnElimina: 0,
        btnActualizar: 0,
        render: true,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        ConfirmComponent,
        loginComponent,
        vSelect
    },
    mounted(){
        this.mostraTipoLavado()
        
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        dataModal(){
            this.active = true
            this.estado = this.dataWasher.row.item.estado == 1 ? true : false
            this.tipoLavado = this.dataWasher.row.item.tipoLavado
            this.nombreUp = this.dataWasher.row.item.nombre
            this.capMaxima = this.dataWasher.row.item.max
            this.capMinima = this.dataWasher.row.item.min
            this.capKg = this.dataWasher.row.item.kilos
        },
        desactivar(){
            this.active = false
            this.active2 = true
        },
        add(id){
            if(id){
                this.contador++
                fetchApi(this.url+`lavadora/programa/findById/${id}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        let pl = data.datos
                        this.programas.push({"id": this.contador, "nombre": pl.nombre, "descripcion": pl.descripcion, "cantidadMinima": pl.cantidadMinima, "cantidadMaxima": pl.cantidadMaxima, "idPrograma": pl.id })
                    }else{
                        this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                    }
                })
            }else{
                this.openNotification('Ocurrio un error', `Es requerido seleccionar algun programa de lavado`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        elim(id){
            this.programas = this.programas.filter(dt => dt.id != id)
        },
        
        async mostraTipoLavado(){
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.tiposLavado = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tiposLavado = data.datos
                }
            })
        },
        
        async deleteWasher(status){
            if(status == 200){
                let token = this.$session.get('token')
                const res = await fetch(this.url+`lavadora/delete/${this.dataWasher.row.item.id}`,{
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                })
                const data = await res.json();
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.active2 = false
                    this.active = false
                    this.$emit('updatePage', '200')
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

                }else{
                    this.openNotification(`Error: inesperado al eliminarlo`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

                }
            }
        },
        async activar(){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`lavadora/activate/${this.dataWasher.row.item.id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            const data = await res.json();
            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.active = false
                this.$emit('updatePage', '200')
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
                this.openNotification(`Error: inesperado al activarlo`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        async update(){
            let token = this.$session.get('token')
            let pogramLav = []
            this.programas.forEach( pl => {
                pogramLav.push(pl.idPrograma)
            })
            let json = {
                "lavadora": this.nombreUp,
                "idTipoLavado": this.tipoLavado,
                "idLavadora": this.dataWasher.row.item.id,
                "maximo": this.capMaxima,
                "minimo": this.capMinima,
                "kilos": this.capKg,
            };
            let res = await fetch(this.url+"lavadora/update",{
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
                //se actualiza token
                this.active = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.$emit('updatePage', '200')
            }else{
                this.openNotification(`Error: inesperado`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

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
.vs-select--state-null{
    width: 100%;
    margin-bottom: 1rem;
}
</style>
<style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .con-footer
    display flex
    align-items center
    justify-content flex-end
    .vs-button
      margin 0px
      .vs-button__content
        padding 10px 30px
      ~ .vs-button
        margin-left 10px
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
    padding-bottom 0px
  .con-content
    width 100%
    p
      font-size .8rem
      padding 0px 10px
    .vs-checkbox-label
      font-size .8rem
    .vs-input-parent
      width 100%
    .vs-input-content
      margin 10px 0px
      width calc(100%)
      .vs-input
        width 100%
  .footer-dialog
    display flex
    align-items center
    justify-content center
    flex-direction column
    width calc(100%)
    .new
      margin 0px
      margin-top 20px
      padding: 0px
      font-size .7rem
      a
        color getColor('primary') !important
        margin-left 6px
        &:hover
          text-decoration underline
    .vs-button
      margin 0px
  </style>