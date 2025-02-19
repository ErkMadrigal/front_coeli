<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5 container">
            <h2 class="mt-3 mb-5">Generar Reportes</h2>
                <b-form>
                    <b-form-group label="Selecciona el tipo de reporte">
                        <b-form-radio v-model="tipoReporte" value="semana">Por Semana</b-form-radio>
                        <b-form-radio v-model="tipoReporte" value="mes">Por Mes</b-form-radio>
                        <b-form-radio v-model="tipoReporte" value="anio">Por Año</b-form-radio>
                        <b-form-radio v-model="tipoReporte" value="personalizado">Personalizado</b-form-radio>
                    </b-form-group>

                    <b-row>
                        <b-col md="6" sm="6">
                            <b-form-group class="mt-4" label="Selecciona la fecha inicio">
                                <b-form-datepicker :no-date-selected-text="'Seleccione una fecha'" v-model="fechaInicio" :max="new Date()" @input="actualizarFechaFinal" required></b-form-datepicker>
                            </b-form-group>
                        </b-col>
                        <b-col md="6" sm="6">
                            <b-form-group class="mt-4" label="Selecciona la fecha final">
                                <b-form-datepicker :no-date-selected-text="'Seleccione una fecha'" v-model="fechaFinal" :min="fechaInicio" :max="calcularFechaMaxima()" required></b-form-datepicker>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <div class="card mt-5 btn" style="height: 10rem;" @click="generarReporte">
                        <div class="card-body" style="text-align: center;" id="altas">
                            <p class="lead">Reporte {{tipoReporte}}</p>
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="80px" height="80px"><rect width="16" height="9" x="28" y="15" fill="#21a366"/><path fill="#185c37" d="M44,24H12v16c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2V24z"/><rect width="16" height="9" x="28" y="24" fill="#107c42"/><rect width="16" height="9" x="12" y="15" fill="#3fa071"/><path fill="#33c481" d="M42,6H28v9h16V8C44,6.895,43.105,6,42,6z"/><path fill="#21a366" d="M14,6h14v9H12V8C12,6.895,12.895,6,14,6z"/><path d="M22.319,13H12v24h10.319C24.352,37,26,35.352,26,33.319V16.681C26,14.648,24.352,13,22.319,13z" opacity=".05"/><path d="M22.213,36H12V13.333h10.213c1.724,0,3.121,1.397,3.121,3.121v16.425	C25.333,34.603,23.936,36,22.213,36z" opacity=".07"/><path d="M22.106,35H12V13.667h10.106c1.414,0,2.56,1.146,2.56,2.56V32.44C24.667,33.854,23.52,35,22.106,35z" opacity=".09"/><linearGradient id="flEJnwg7q~uKUdkX0KCyBa" x1="4.725" x2="23.055" y1="14.725" y2="33.055" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"/><stop offset="1" stop-color="#0b6731"/></linearGradient><path fill="url(#flEJnwg7q~uKUdkX0KCyBa)" d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"/><path fill="#fff" d="M9.807,19h2.386l1.936,3.754L16.175,19h2.229l-3.071,5l3.141,5h-2.351l-2.11-3.93L11.912,29H9.526	l3.193-5.018L9.807,19z"/></svg>

                        </div>
                    </div>
                </b-form>

        </b-container>
        <br>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import loginComponent from '@/components/cardLogin.vue';
import { refreshSession } from "@/service/service.js"
import { addDays } from 'date-fns';

export default {
    name:"reportesView",
    data: () => ({
        rangos: {
            semana: 7,
            mes: 30,
            anio: 365,
            personalizado: null
        },
        tipoReporte: 'semana',
        fechaInicio: new Date(),
        fechaFinal: new Date(),
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        // this.getLogs()
    },
    methods: {
        
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        calcularFechaMaxima() {
            let seleccion = this.rangos[this.tipoReporte]

            if (this.fechaInicio && seleccion != null) {
                const fechaMinima = addDays(this.fechaInicio, seleccion);
                return fechaMinima;
            }
            return null;
        },
        actualizarFechaFinal() {
            let seleccion = this.rangos[this.tipoReporte]
            if (this.fechaInicio) {
                this.fechaFinal = addDays(this.fechaInicio, seleccion);
            }
        },
        async generarReporte(){
            let token = this.$session.get('token')

            let json = {
                "fechaInicio": this.fechaInicio,
                "fechaFin": this.fechaFinal,
            }
            let res = await fetch(this.url+"orden/reporte",{
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
                console.log(data.datos)
                this.refresh()
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Procesado Correctamente`, 'success', 'top-left',`<box-icon name='check' color="#fff"></box-icon>`)
                
                            
                const link = document.createElement("a");
                link.href = "data:application/octet-stream;base64,"+data.datos.base64;
                link.target = "_blank";
                link.download = `_${this.tipoReporte}_.xlsx`;

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link)

                this.fechaInicio = ''
                this.fechaFinal = ''
            }else{
                this.openNotification(`Error: inesperado al generar el reporte`, `verifica tus campos, Si el problema persiste, comunicate con el administrador`, 'danger', 'top-left',`<box-icon name='bug' color="#fff"></box-icon>`)

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

