<template>
    <div>
        <b-container class="bv-example-row">
            <b-card  v-if="render">
                <b-skeleton animation="throb" width="85%"></b-skeleton>
                <b-skeleton animation="throb" width="100%"></b-skeleton>
                <b-skeleton animation="throb" width="70%"></b-skeleton>
                <b-skeleton type="button" width="100%" class="mb-2"></b-skeleton>
                <b-skeleton type="button" width="100%"></b-skeleton>
            </b-card>        
            <b-card v-else :title="data.data.nomCliente" :style="{ 'border-left': `solid 5px #0d6efd !important` }">
                <small>{{ data.data.prenda }}</small>
                <div class="badge bg-success text-wrap float-end" >
                    {{ data.data.nombreEstado }}
                </div>
                <vs-button circle icon floating primary @click="imprimirTicket(data.data.idOrdenPrena)">
                    <box-icon name='printer' color="#fff"></box-icon>
                </vs-button>
                <p class="fw-light text-muted">id Orden {{ data.data.idOrden }}.</p>
                <p>{{ date }}</p>
                cantidad de prendas
                <div class="badge bg-success text-wrap float-end" >
                    {{ data.data.cantidad }}
                </div>
                <br>
                <br>
            </b-card>
            <div v-if="activarReboot">
                <loginComponent :login="activarReboot"></loginComponent>
            </div>
        </b-container>
    </div>
</template>

<script>
// import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import moment from 'moment';

export default {
    name:"ProcesandoComponent",
    props: {
        data: Object,
    },
    data: () => ({
        date: '',

        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        // ConfirmComponent,
        loginComponent
    },
    mounted(){
        moment.locale('es');  
        let fechaIngreso = this.data.data.ultimoEstado.split('T')
        let horaIngreso = fechaIngreso[1].split('.')[0]
        let fechaHora = fechaIngreso[0]+" "+horaIngreso
        this.date = moment(fechaHora).startOf('hour').fromNow()
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
        async imprimirTicket(idOrdenPrena){
            let objbuilder = ``
            // this.modalPrint = true
            // console.log(idOrdenPrena)
            fetchApi(this.url+`orden/reportes/prenda/${idOrdenPrena}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    objbuilder = `<embed type='application/pdf' width='100%' height='600px' style='margin-top: 35px; border: 1px solid #ccc;' src='data:application/pdf;base64,${data.datos.base64}'>`
                    let win = window.open("about:blank", "Entrega", "width=900px,height=600px");
                    let title = "Entrega";
                    win.document.write('<html><title>'+ title +'</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
                    win.document.write(objbuilder);
                    win.document.write('</body></html>');
                }else{
                    this.openNotification('Ocurrio un error', `Al obtener los datosde imprecion`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
       
        async updatePage(status){
            if(status == 200){
                this.mostraActivos()
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
<style lang="stylus">
getColor(colorx, alpha = 1)
    unquote("rgba(var(--vs-"+colorx+"), "+alpha+")")
getVar(var)
    unquote("var(--vs-"+var+")")

.content-tooltip
  .body
    display flex
    align-items flex-start
    justify-content center
    .vs-avatar-content
      margin-top -30px
      border 3px solid getVar('theme-layout')
      box-shadow 0px 4px 15px 0px rgba(0,0,0,.1)
    .text
      display flex
      align-items center
      justify-content center
      flex-direction column
      font-size .55rem
      padding 10px
      font-weight normal
      span
        font-weight bold
        font-size .7rem
  footer
    display flex
    align-items center
    justify-content center
  h4
    padding 8px
    margin 0px
    text-align left
  p
    text-align left
    padding 0px
    margin 0px
    line-height 1rem
    padding-bottom 5px
    padding-left 8px
</style>