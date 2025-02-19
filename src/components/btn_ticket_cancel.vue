<template>
    <div>
        <vs-button circle icon floating danger @click="modalTicket">
            <box-icon name='printer' color="#fff"></box-icon>
        </vs-button>
        <vs-dialog v-model="activeModal">
            <template #header>
            <h4 class="not-margin">
                Ticket <b>Cancelaciones</b>
            </h4>
            </template>

            <div class="con-form">
                <vs-input success type="number" v-model="cantidad" placeholder="Cantidad">
                    <template #icon>
                        <box-icon name='dialpad-alt' type='solid' ></box-icon>
                    </template>
                </vs-input>
                <vs-input success type="text" v-model="etiquetaPorBolsa " placeholder="Etiqueta por Bolsa">
                    <template #icon>
                        <box-icon name='dialpad-alt' ></box-icon>
                    </template>
                </vs-input>
            </div>
            <br>
            <template #footer>
                <div class="footer-dialog">
                    <vs-button block danger
                        flat
                        :btnGuardar="btnGuardar == 1"
                        @click="ticketCancelacion()">
                        Imprimir
                    </vs-button>
                </div>
            </template>
        </vs-dialog>

    </div>
</template>

<script>
import { refreshSession } from "@/service/service.js"

export default {
    props: {
        idOrdenPrenda: Number,
    },
    data: () => ({
        btnGuardar: 0,
        etiquetaPorBolsa: "",
        cantidad: "",
        activeModal: false,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    created(){
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
        async ticketCancelacion(){
            let objbuilder = ``

            let token = this.$session.get('token')
  
            let json = {
                "idOrdenPrenda": this.idOrdenPrenda,
                "cantidad": this.cantidad,
                "etiquetaPorBolsa": this.etiquetaPorBolsa,
            };
            let res = await fetch(this.url+"orden/reportes/cancela",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            let data = await res.json()
            if(data.status == 401){  this.activarReboot = true }
            if(data.status == 200){
                this.activeModal = false
                objbuilder = `<embed type='application/pdf' width='100%' height='600px' style='margin-top: 35px; border: 1px solid #ccc;' src='data:application/pdf;base64,${data.datos.base64}'>`
                let win = window.open("about:blank", "Entrega", "width=900px,height=600px");
                let title = "Entrega";
                win.document.write('<html><title>'+ title +'</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
                win.document.write(objbuilder);
                win.document.write('</body></html>');
                this.refresh()
                this.cantidad = ''
                this.etiquetaPorBolsa = ''
            }else{
                this.openNotification(`Error: Inesperado al obtener el ticket`, `Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        modalTicket(){
            this.activeModal = true
        },
    }
}
</script>

