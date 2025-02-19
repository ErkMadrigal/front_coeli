<template>
    <div>
        <vs-button flat block icon @click="activeModalListLavado =! activeModalListLavado">
            <box-icon name='list-ul' color="#195bff" ></box-icon> Lista de Lavados
        </vs-button>
        <b-modal size="xl" centered v-model="activeModalListLavado">
            <template #modal-header="{ close }">
                <h5>Todos los lavados</h5>
                <vs-button circle icon floating danger @click="close()">
                    <box-icon name='x' color="#fff"></box-icon>
                </vs-button>
            </template>
            <template>
                <b-container fluid>
                    <!-- User Interface controls -->
                    <b-row>

                    <b-col lg="6" class="my-1">
                        <b-form-group
                        label="Buscar"
                        label-for="filter-input"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        class="mb-0"
                        >
                        <b-input-group size="sm">
                            <b-form-input
                            id="filter-input"
                            v-model="filter"
                            type="search"
                            placeholder="Buscar"
                            ></b-form-input>

                            <b-input-group-append>
                            <b-button :disabled="!filter" @click="filter = ''" variant="danger">X</b-button>
                            </b-input-group-append>
                        </b-input-group>
                        </b-form-group>
                    </b-col>

                    <b-col sm="5" md="6" class="my-1">
                        <b-form-group
                        label="registros"
                        label-for="per-page-select"
                        label-cols-sm="6"
                        label-cols-md="4"
                        label-cols-lg="3"
                        label-align-sm="right"
                        label-size="sm"
                        class="mb-0"
                        >
                        <b-form-select style=""
                            id="per-page-select"
                            v-model="perPage"
                            :options="pageOptions"
                            size="sm"
                        ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col sm="7" md="6" class="my-1">
                        <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"
                        ></b-pagination>
                    </b-col>
                    </b-row>

                    <!-- Main table element -->
                    <b-table
                    :items="items"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    label-sort-asc=""
                    label-sort-desc=""
                    label-sort-clear=""
                    stacked="md"
                    show-empty
                    empty-text="No hay datos disponibles"
                    small
                    @filtered="onFiltered"
                    >
                    <template #cell(actions)="row">
                        <vs-button circle icon floating danger @click="eliminarLavado(row.item.id)">
                            <box-icon name='trash' color="#fff"></box-icon>
                        </vs-button>
                        <vs-button circle floating primary icon @click="modalEdit(row.item)">
                            <box-icon name='edit-alt' color="#fff"></box-icon>
                        </vs-button>
                        
                    </template>

                    <template #row-details="row">
                        <b-card>
                        <ul>
                            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                        </ul>
                        </b-card>
                    </template>
                    </b-table>

                </b-container>
            </template>

            <template #modal-footer="{ ok }">
                <vs-button danger @click="ok()">
                    <box-icon name='exit' color="#fff"></box-icon> Salir
                </vs-button>
            </template>
            
        </b-modal>
        <vs-dialog v-model="activeModalEditLavado">
            <template #header>
            <h4 class="not-margin">
                Editar <b>Capacidad</b>
            </h4>
            </template>

            <div class="con-form">
                <vs-input class="d-none" v-model="id" ></vs-input>
                <vs-input success class="mt-3" type="text" v-model="nombre" label-placeholder="nombre">
                    <template #icon>
                        <box-icon name='rename'></box-icon>
                    </template>
                </vs-input>
                <vs-input success class="mt-3" type="text" v-model="descripcion" label-placeholder="descripcion">
                    <template #icon>
                        <box-icon name='rename'></box-icon>
                    </template>
                </vs-input>

                <vs-input success class="mt-3" type="text" v-model="minima" label-placeholder="Cantidad Minima">
                    <template #icon>
                        <box-icon name='dialpad-alt' ></box-icon>
                    </template>
                </vs-input>
                <vs-input success class="mt-3" type="text" v-model="maxima" label-placeholder="Cantidad Maxima">
                    <template #icon>
                        <box-icon name='dialpad-alt' ></box-icon>
                    </template>
                </vs-input>
            </div>
            <br>
            <template #footer>
                <div class="footer-dialog">
                    <vs-button block success
                        flat
                        @click="editarLavado()">
                        Guardar
                    </vs-button>
                </div>
            </template>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
    </div>
    
</template>
<script>

import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"

export default {
    name: 'modalListCapacidades',
    props: {
    },
    data:() => ({
        nombre: '',
        id: '',
        descripcion: '',
        maxima: '',
        minima: '',
        activeModalEditLavado: false,

        items: [],
        fields: [
          { key: 'nombre', label: 'Nombre', sortable: true, sortDirection: 'desc' },
          { key: 'descripcion', label: 'Descripción', sortable: true, class: 'text-center' },
          {
            key: 'maxCant',
            label: 'Canitidad Máxima',
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          {
            key: 'minCant',
            label: 'Canitidad Mínima',
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          { key: 'actions', label: 'Acciones' }
        ],
        
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15, { value: 100, text: "mostrar Todo" }],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        },
        activeModalListLavado: false,

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.mostrarTodosLavados()
        this.totalRows = this.items.length 
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
       
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        async mostrarTodosLavados(){
            this.items = []
            fetchApi(this.url+'lavadora/programa/findByAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( val => {
                        this.items.push({ maxCant: val.cantidadMaxima, minCant: val.cantidadMinima, descripcion: val.descripcion, nombre: val.nombre, id: val.id },)
                    })
                    this.totalRows = this.items.length 
                }
            })
        },
        modalEdit(data){
            this.activeModalEditLavado = true
            this.activeModalListLavado = false
            this.nombre = data.nombre
            this.descripcion = data.descripcion
            this.minima = data.minCant
            this.maxima = data.maxCant
            this.id = data.id
        },
        async editarLavado(){
            let token = this.$session.get('token')

            let json = {
                "idPrograma": this.id,
                "nombre": this.nombre,
                "descripcion": this.descripcion,
                "cantidadMaxima": this.maxima,
                "cantidadMinima": this.minima,
            };
            let res = await fetch(this.url+"lavadora/programa/update",{
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
                this.activeModalListLavado = false
                this.totalRows = this.items.length 
                this.activeModalEditLavado = false

                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostrarTodosLavados()
                this.$emit('updatePage', '200')

            }else{
                this.openNotification(`Error: inesperado al actualizar`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                
            }
            
        },
        eliminarLavado(data){
            let token = this.$session.get('token')

            fetch(this.url+`lavadora/programa/delete/${data}`,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            .then(res => res.json())
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.activeModalListLavado = false
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Eliminado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.mostrarTodosLavados()
                    this.$emit('updatePage', '200')
                    
                    this.totalRows = this.items.length 
                }else{
                    this.openNotification(`Error: Inesperado al eliminar`, `Si el problema persiste comuniquese con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })

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