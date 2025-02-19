<template>
    <div>
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
            <b-skeleton type="input" class="mt-2"></b-skeleton>
        </b-card>        
        <b-card v-else >
            <div class="d-flex flex-row bd-highlight">
                <div class="p-1 bd-highlight">
                    <box-icon name='radio-circle-marked' :color="dataProceso.estado == 1 ? '#32ff00' : '#ff0023'" ></box-icon>
                    
                </div>
                <div class="p-1 bd-highlight">
                    <h5 class="card-title">{{dataProceso.codigo}}</h5>
                    <h6 class="card-subtitle text-muted mb-2">{{dataProceso.nombre}}</h6>
                </div>
            </div>
            <!-- {{ dataProceso.pasos }} -->
            <vs-button primary block class="mt-2"  @click="modalDetalles">
                <box-icon name='detail' color="#fff"></box-icon> Mostrar Detalles
            </vs-button>
            <b-modal centered v-model="activeDetalles">
                <template #modal-header="{ close }">
                    <h5>Detalles <b>{{dataProceso.codigo}}</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <div class="con-form">
                    <v-timeline  dense v-for="(paso, i) in dataProceso.pasos" :key="i">
                        <v-timeline-item  color="deep-purple lighten-1" >
                            <span slot="opposite">{{paso.nombre}}</span>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <div class="mt-1">
                                        <label for="descripcion">Descripcion: </label>
                                        <strong>{{paso.descripcion}}</strong>
                                    </div>
                                    <div class="mt-1">
                                        <label for="tipoLavado">Tipo de Lavado: </label>                                    
                                        <strong>
                                            {{paso.nombre}}
                                        </strong>
                                    </div>
                                    
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                       
                    </v-timeline>
                </div>
                <br>
                <template #modal-footer="{ ok }">
                    <vs-button danger @click="ok()">
                        <box-icon name='exit' color="#fff"></box-icon> Salir
                    </vs-button>
                </template>
            </b-modal>
            <vs-button primary block class="mt-2" @click="activeEditar=!activeEditar">
                <box-icon name='edit' color="#fff"></box-icon> Editar
            </vs-button>
            <b-modal size="xl" centered v-model="activeEditar">
                <template #modal-header="{ close }">
                    <h5>Editar <b>{{dataProceso.codigo}}</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <div class="con-form">
                    <b-container class="bv-example-row">
                        <b-card>
                            <b-row>
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <vs-input primary v-model="nombreProceso" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <vs-input primary v-model="codigoProceso" label-placeholder="Clave del Proceso">
                                        <template #icon>
                                            <box-icon name='dialpad-alt'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="2" md="4" sm="12">
                                    <vs-button
                                        primary
                                        block
                                        @click="EditarNomProceso()"
                                    >
                                        <box-icon name='edit' color="#fff"></box-icon>Editar
                                    </vs-button>
                                </b-col>
                            </b-row>
                        </b-card>
                        
                        <draggable class="row" v-model="pasos" @change="onDragEnd"></draggable>
                        <div class="row" >
                            <div class="col-lg-4 col-md-6 col-sm-12 mt-3 mb-3" lg="4" md="6" sm="6" v-for="(paso, i) in pasos" :key="i">
                                <b-card :title="paso.nombre" tag="article" class="mb-2">
                                    <b-card-text>
                                        {{paso.descripcion}}
                                    </b-card-text>
                                    <vs-button
                                        danger
                                        block
                                        @click="deletePaso(paso.id)"
                                    >
                                        <box-icon name='minus' color="#fff"></box-icon >Eliminar
                                    </vs-button>
                                    <vs-button
                                        primary
                                        block
                                        @click="editarPaso(paso)"
                                    >
                                        <box-icon name='edit' color="#fff"></box-icon >Editar
                                    </vs-button>
                                </b-card>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12 mt-3 mb-3">
                                <b-card  tag="article" class="mb-2">
                                    <vs-button
                                        primary
                                        block
                                        @click="AddPaso()"
                                    >
                                        <box-icon name='edit' color="#fff"></box-icon >Agregar Paso
                                    </vs-button>  
                                </b-card>
                            </div>
                        </div>
                    </b-container>
                </div>
                <br>
                <template #modal-footer="{ ok }">
                     <!-- <vs-button success size="large" @click="updateProceso()">
                        <box-icon name='save' color="#fff"></box-icon > Guardar Registro
                    </vs-button> -->
                    <vs-button danger @click="ok()">
                        <box-icon name='exit' color="#fff"></box-icon> Salir
                    </vs-button>
                </template>
            </b-modal>
            <b-modal size="xl" centered v-model="activeEditarPaso">
                <template #modal-header="{ close }">
                    <h5>Editar <b>Paso</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <div class="con-form">
                    <b-container class="bv-example-row">
                        <!-- bugError -->
                        <b-card class="mt-4" title="Editar de Pasos">
                            <b-row class="mt-2 align-items-end">
                                <b-col class="mt-2" lg="4" md="4" sm="12">
                                    <vs-input primary v-model="nombre" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-4" lg="4" md="4" sm="12">
                                    <vs-input primary v-model="descripcion" label-placeholder="Descripción del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                
                                <b-col lg="4" md="4" sm="12">
                                    <div class="con-selects">
                                        <v-select
                                            v-model="tipoLavado"
                                            :options="tipoLavados"
                                            label="nombre"
                                            placeholder="Selecciona el tipo de Lavado"
                                            :reduce="option => option.id"
                                            :searchable="true"
                                            :clearable="false"
                                        />
                                    </div>
                                </b-col>
                                
                                
                                <div class="con-switch mt-5">
                                    
                                    <b-card title="Vistas">
                                        <b-row>
                                            <b-col class="mt-3" cols="2" v-for="(rol, i) in allRoles.slice(0, 16)" :key="i">
                                                <vs-switch  :val="''+rol.id" v-model="optionsRoles">
                                                {{ rol.nombre }}
                                                </vs-switch>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                    <b-card class="mt-5" title="Permisos de lavados">
                                        <b-row>
                                            <b-col class="mt-3" cols="2" v-for="(rol, i) in allRoles.slice(17)" :key="i">
                                                <vs-switch  :val="''+rol.id" v-model="optionsRoles">
                                                {{ rol.nombre }}
                                                </vs-switch>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                </div>
                                <!-- <b-container class="mt-3">
                                    <vs-button
                                        success
                                        flat
                                        :active="Agregar == 1"
                                        @click="addNewPaso()"
                                    >
                                        Asignar Paso
                                    </vs-button>
                                </b-container> -->
                            </b-row>
                        </b-card>
                    </b-container>
                </div>
                <br>
                <template #modal-footer="{ ok }">
                     <vs-button success size="large" @click="updateProceso()">
                        <box-icon name='save' color="#fff"></box-icon > Guardar Registro
                    </vs-button>
                    <vs-button danger @click="ok()">
                        <box-icon name='exit' color="#fff"></box-icon> Salir
                    </vs-button>
                </template>
            </b-modal>
            
            <b-modal size="xl" centered v-model="activeAddPaso">
                <template #modal-header="{ close }">
                    <h5>Agregar <b>Paso</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <div class="con-form">
                    <b-container class="bv-example-row">
                        
                        <b-card class="mt-4" title="Agregar de Pasos">
                            <b-row class="mt-2 align-items-end">
                                <b-col class="mt-2" lg="4" md="4" sm="12">
                                    <vs-input primary v-model="nombreAdd" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="4" md="4" sm="12">
                                    <vs-input primary v-model="descripcionAdd" label-placeholder="Descripción del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                
                                <b-col lg="4" md="4" sm="12">
                                    <div class="con-selects">
                                        <v-select
                                            v-model="tipoLavadoAdd"
                                            :options="tipoLavados"
                                            label="nombre"
                                            placeholder="Tipo de Lavado"
                                            :reduce="option => option.id"
                                            :searchable="true"
                                            :clearable="false"
                                        />
                                    </div>
                                </b-col>
                                
                                <div class="con-switch mt-5">
                                    
                                    <b-card title="Vistas">
                                        <b-row>
                                            <b-col class="mt-3" cols="2" v-for="(rol, i) in allRoles.slice(0, 16)" :key="i">
                                                <vs-switch  :val="''+rol.id" v-model="optionsRolesAdd">
                                                {{ rol.nombre }}
                                                </vs-switch>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                    <b-card class="mt-5" title="Permisos de lavados">
                                        <b-row>
                                            <b-col class="mt-3" cols="2" v-for="(rol, i) in allRoles.slice(17)" :key="i">
                                                <vs-switch  :val="''+rol.id" v-model="optionsRolesAdd">
                                                {{ rol.nombre }}
                                                </vs-switch>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                </div>
                                
                            </b-row>
                        </b-card>
                    </b-container>
                </div>
                <br>
                <template #modal-footer="{ ok }">
                     <vs-button success size="large" @click="addNewPaso()">
                        <box-icon name='save' color="#fff"></box-icon > Guardar Registro
                    </vs-button>
                    <vs-button danger @click="ok()">
                        <box-icon name='exit' color="#fff"></box-icon> Salir
                    </vs-button>
                </template>
            </b-modal>
            <vs-button v-if="dataProceso.estado != 1" primary block class="mt-2" @click="activarProceso">
                <box-icon name='play' color="#fff"></box-icon> Activar
            </vs-button>
            <vs-button danger v-else block class="mt-2"  @click="deleteProceso">
                <box-icon name='trash' color="#fff"></box-icon> Eliminar
            </vs-button>
        </b-card>
        
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import draggable from 'vuedraggable';


export default {
    name:"CardProcesoUpdateComponent",
    props: {
        dataProceso: Object,
    },
    data: () => ({
        
        elementos: [],
        nombreAdd: '',
        descripcionAdd: '',
        tipoLavadoAdd: '',
        optionsRolesAdd: [],
        allRoles: [],
        lavados: [],
        tipoLavados: [],
        lavado: '',
        tipoLavado: '',
        nombreProceso: '',
        codigoProceso: '',
        descripcion: '',
        idPaso: '',
        nombre: '',
        orden: 1,
        contador: 0,
        optionsRoles: [],
        pasos: [],
        Agregar: 0,
        active2: false,
        resultados: [],
        lavadoras: [],
        select : '',
        activeDetalles: false,
        activeEditar: false,
        activeEditarPaso: false,
        activeAddPaso: false,
        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        loginComponent,
        draggable,
        vSelect
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.contador = this.dataProceso.pasos.length
        this.pasos = this.dataProceso.pasos.map((paso) => ({
            id: paso.id,
            descripcion: paso.descripcion,
            nombre: paso.nombre,
            orden: paso.orden,
            rolesCambio: paso.roles,
            idTipoLavado: paso.idTipoLavado,
        }));
        this.nombreProceso = this.dataProceso.nombre
        this.codigoProceso = this.dataProceso.codigo
        this.mostraRoles()
        this.mostrarTipoLavados()
        setTimeout(() => {
            this.render = false
        }, 1000) 
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },

        onDragEnd() {
            this.pasos = this.pasos.map((paso, index) => ({
                id: paso.id,
                idTipoLavado: paso.idTipoLavado,
                nombre: paso.nombre,
                orden: index+1,
                descripcion: paso.descripcion,
                rolesCambio: paso.rolesCambio,
            }));
        },
        modalDetalles(){
            this.activeDetalles = true
            this.$forceUpdate();
        },
        editarPaso(pasos){

            this.activeEditar = true
            this.activeEditarPaso = true
            this.nombre = pasos.nombre
            this.descripcion = pasos.descripcion
            this.tipoLavado = pasos.idTipoLavado
            this.idPaso = pasos.id 
            this.ordenPaso = pasos.orden
            pasos.rolesCambio.forEach( rol => {
                this.optionsRoles.push(''+rol) 
            });
            
        },
        
        async EditarNomProceso(){
            let token = this.$session.get('token')

            let json = {
                "idProceso": this.dataProceso.id,
                "nombreProceso": this.nombreProceso,
                "codigo": this.codigoProceso,
            };
            let res = await fetch(this.url+"proceso/update/proceso",{
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
                //se actualiza token
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.updatePage(200)
                this.activeEditar = false
            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado al actualizar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async mostraRoles(){
            fetchApi(this.url+'rol/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    if(!this.$session.get('roles').some(role => ['SISTEMAS'].includes(role))){
                        this.allRoles = data.datos.filter(function (rol) {
                            return rol.id !== 1;
                        });
                    }else{
                        this.allRoles = data.datos
                    }
                }
            })
        }, 
        
        mostrarTipoLavados(){
            this.tipoLavados = []
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavados = data.datos
                    // this.tipoLavados.push({"value": {id: "0", nombre: "No Aplica" }, "text": "No Aplica"})
                    // data.datos.forEach( value => {
                    //     this.tipoLavados.push({"value": {id: value.id, nombre: value.nombre }, "text": value.nombre})
                    // })
                }
            })
        }, 
        AddPaso(){
            this.activeAddPaso = true
            this.resultados = []
        },
        async deletePaso(id){

            this.pasos = this.pasos.filter(paso => paso.id != id)

            let token = this.$session.get('token')
            const res = await fetch(this.url+`proceso/delete/paso/${id}`,{
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
                this.updatePage(200)

                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
                this.openNotification(`Error: inesperado al querer eliminar`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                
            }
        },
        async addNewPaso(){
            
            let error = []
            if(this.descripcionAdd == ''){
                error.push("<br>Es Requerido el campo Descripción")
            }
            if(this.nombreAdd == ''){
                error.push("<br>Es Requerido el campo Nombre")
            }
            if(this.optionsRolesAdd.length == 0){
                error.push("<br>Es Requerido seleccionar un Rol")
            }

            let pasos = {
                "descripcion": this.descripcionAdd,
                "nombre": this.nombreAdd,
                "orden": this.orden++,
                "rolesCambio": this.optionsRolesAdd,
                "idTipoLavado": this.tipoLavadoAdd.id,
                "id": this.contador,
                "idProceso": this.dataProceso.id
            }
            if(error.length == 0){
                
                let token = this.$session.get('token')

                let res = await fetch(this.url+"proceso/add/paso",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                    body: JSON.stringify(pasos)
                })
                let data = await res.json()

                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    //se actualiza token
                    this.pasos.push(pasos)
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.updatePage(200)
                    this.nombreAdd = ''
                    this.descripcionAdd = ''
                    this.tipoLavadoAdd = ''
                    this.optionsRolesAdd = []
                    this.activeAddPaso = false
                }else{
                    console.warn(data)
                    this.openNotification(`Error Inesperado al Registar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }else{
                this.openNotification(`Error: Al agregar un Paso`, `${error}`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }

        },
        async updateProceso(){
            let token = this.$session.get('token')

            let json = {
                "idPaso": this.idPaso,
                "descripcion": this.descripcion,
                "nombre": this.nombre,
                "idTipoLavado": this.tipoLavado,
                "orden": this.ordenPaso,
                "rolesCambio": this.optionsRoles,
            };
            
            // bugError

            let res = await fetch(this.url+"proceso/update/paso",{
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
                this.activeEditarPaso = false
                this.activeEditar = true

                //se actualiza token
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.updatePage(200)
                this.activeEditar = false
            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado al actualizar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },

        async deleteProceso(){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`proceso/delete/${this.dataProceso.id}`,{
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
                this.$emit('updatePage', '200')
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
                console.warn(data)
                this.openNotification(`Error Inesperado al desactivar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async activarProceso(){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`proceso/activate/${this.dataProceso.id}`,{
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
                this.$emit('updatePage', '200')
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Activado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
            
                console.warn(data)
                this.openNotification(`Error Inesperado al activar el proceso`, `Comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async updatePage(status){
            if(status == 200){
                this.$emit('updatePage', '200')
                this.mostraRoles()
                this.mostrarTipoLavados()
                // setTimeout(() => {
                //     this.render = false

                // }, 1000) 
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

.vs--searchable .vs__dropdown-toggle{
    border-radius: 0.7rem;
}
.vs__dropdown-toggle{
    margin-top: 3.3rem;
}
input[type="search"] {
    padding:5px;
    border: 1px solid #f6f6f6;
    border-radius: 4px;
    outline: none;
}

input[type="search"]:focus {
    border-color: #f6f6f6;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); 
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

</style>