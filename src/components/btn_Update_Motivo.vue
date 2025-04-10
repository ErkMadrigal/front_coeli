<template>
    <div>
        
        
        <vs-button circle icon floating primary  @click="dataModal">
            <box-icon name='edit' color="#fff"></box-icon>
        </vs-button>
        
        <vs-dialog blur v-model="active">
            <template #header>
                <h4 class="not-margin">
                    Editar <b>Motivo</b>
                </h4>
            </template>


            <div class="con-form">
                <template>
                    <div class="center content-inputs">
                        <vs-input success type="text" v-model="motivo" placeholder="Motivo">
                            <template #icon>
                                <box-icon name='note' type='solid' ></box-icon>
                            </template>
                        </vs-input>
                    </div>
                    <div class="center content-inputs">
                        <vs-input success type="text" v-model="descripcion" placeholder="Descripcion">
                            <template #icon>
                                <box-icon name='notepad' ></box-icon>
                            </template>
                        </vs-input>
                    </div>
                </template>
            </div>

            <template #footer>
                <div class="con-footer mt-4">
                    <vs-button success
                        flat
                        :btnActualizar="btnActualizar == 1"
                        @click="updateCliente()">
                        Actualizar
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
import { refreshSession } from "@/service/service.js"

export default {
    name: 'btnUpdateMotivo',
    props: {
        data: Object,
    },
    data:() => ({
        estado: '',
        active: false,
        motivo: '',
        descripcion: '',
        btnActualizar: 0,

        permisosUpCli: false,
        render: true,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        loginComponent
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
        dataModal(){
            this.active = true
            this.motivo = this.data.item.motivo
            this.descripcion = this.data.item.descripcion
        },
        
        async updateCliente(){
            let token = this.$session.get('token')

            let json = {
                "id": this.data.item.id,
                "descripcion": this.descripcion,
                "motivo": this.motivo,
            };
            let res = await fetch(this.url+"motivo/edita",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            if(res.ok){
                this.refresh()
                this.active = false
                this.openNotification(`Exito:`, `Se ha Registrado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                this.$emit('updatePage', '200')
            }else{
                this.openNotification(`Error: inesperado al actualizar`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
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
.card{
    border-radius: 1rem;
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