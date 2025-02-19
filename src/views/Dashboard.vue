<template>
    <div>
        <HeaderComponent/>
        <br>
        <b-row class="mt-1">
            <b-col class="mt-5" lg="6" md="6" sm="12">
              <b-card title="Ordenes entregadas">
                  <apexchart-all type="donut" height="200" :options="chartOptionsSemiDonut" :series="entradasSalidas"></apexchart-all>
              </b-card>
            </b-col>
            <b-col class="mt-5" lg="6" md="6" sm="12">
              <b-card title="Ordenes del mes pasado y actual">
                  <apexchart-all type="bar" height="200" :options="chartOptionsMPA" :series="seriesMPA"></apexchart-all>
              </b-card>
            </b-col>
            <b-col lg="6" md="12" sm="12">
                <b-card title="Entregas" v-if="seriesEntregas.length > 0">
                    <apexchart-all height="200" type="donut" :options="chartOptionsEntregas" :series="seriesEntregas"></apexchart-all>
                </b-card>
                <b-card no-body class="overflow-hidden" v-else>
                    <v-skeleton-loader
                        height="300"
                        type="image, image, image"
                    >
                    </v-skeleton-loader>
                </b-card>
            </b-col>
            <b-col lg="6" md="12" sm="12">
                <b-card title="Visita clientes" v-if="seriesVisitas.length > 0">
                  <apexchart-all type="bar" height="200" :options="chartOptionsVisitas" :series="seriesVisitas"></apexchart-all>
                </b-card>
                <b-card no-body class="overflow-hidden" v-else>
                    <v-skeleton-loader
                        height="300"
                        type="image, image, image"
                    >
                    </v-skeleton-loader>
                </b-card>
            </b-col>
            <b-col lg="6" md="12" sm="12">
                <b-card title="Ingerso prendas mensuales" v-if="seriesPrendas.length > 0">
                  <apexchart-all type="bar" height="200" :options="chartOptionsPrendas" :series="seriesPrendas"></apexchart-all>
                </b-card> 
                <b-card no-body class="overflow-hidden" v-else>
                    <v-skeleton-loader
                        height="300"
                        type="image, image, image"
                    >
                    </v-skeleton-loader>
                </b-card>
            </b-col>
            <b-col lg="6" md="12" sm="12">
                <b-card title="Ingreso prendas anuales" v-if="seriesPrendasAnuales.length > 0">
                    <apexchart-all type="bar" height="200" :options="chartOptionsPrendasAnuales" :series="seriesPrendasAnuales"></apexchart-all>
                </b-card>
                <b-card no-body class="overflow-hidden" v-else>
                    <v-skeleton-loader
                        height="300"
                        type="image, image, image"
                    >
                    </v-skeleton-loader>
                </b-card>
            </b-col>

            <b-col lg="12" md="12" sm="12">
                <b-card :title="cliente" :style="{ 'border-left': `solid 5px ${fechaEntregaColor} !important` }">
                    <b-row>
                        <b-col lg="3" md="6" sm="12">
                            <apexchart-all class="mt-4"  type="radialBar" :options="chartOptionsRadial" :series="seriesRadial"></apexchart-all>
                            <label for="Buscar Orden de Lavado">Buscar Orden de Lavado</label>
                            <b-input-group class="mt-3">
                                <b-form-input placeholder="Orden de Lavado" type="number" v-model="buscarOrdenLavado"></b-form-input>
                                <b-input-group-append>
                                    <b-button @click="getDetalles(buscarOrdenLavado)" variant="primary"><box-icon name='search-alt-2' color="#fff"></box-icon></b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-col>
                        <b-col lg="9" md="6" sm="12">
                          <apexchart-all type="line" height="350" :options="chartOptionsLine" :series="seriesLine"></apexchart-all>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
            
        </b-row>
        
        <b-row>
          <b-col lg="3" md="4" sm="6" v-for="(lavadora, i) in lavadoras" :key="i">
            <lavadoraDashboard class="m-1"  :data="{id:lavadora.idLavadora ,nombre: lavadora.lavadora, tipoLavado: lavadora.tipoLavado, idEstado: lavadora.idEstado}"></lavadoraDashboard>
          </b-col>
        </b-row>
        
        <b-row>
          <b-col class="mt-4" lg="12" md="12" sm="12">
            <graficaClientes class="m-1"  :data="{clientesGraf}"></graficaClientes>
          </b-col>
        </b-row>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import lavadoraDashboard from '@/components/cardLavadoraDashboard.vue';
import graficaClientes from '@/components/graficaClientes.vue';
import loginComponent from '@/components/cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import numeral from 'numeral';

export default {
    name:"DashboardView",
    
    components: {
        HeaderComponent,
        lavadoraDashboard, 
        loginComponent,
        graficaClientes
    },
    
    data: () => ({
        url: process.env.VUE_APP_SERVICE_URL_API,
        reload:true,
        activarReboot: false,
        fechaEntregaColor: '',
        cliente: '',
        buscarOrdenLavado: '',

        ordenesAct: [],
        lavadoras: [],
        sinData: true,

        seriesEntregas: [],
        chartOptionsEntregas: {},

        seriesVisitas: [],
        chartOptionsVisitas: {},
        
        seriesPrendas: [],
        chartOptionsPrendas: {},

        seriesPrendasAnuales: [],
        chartOptionsPrendasAnuales: {},

        currentSlide: 0,
        entradasSalidas: [],
        chartOptionsSemiDonut: {
            chart: {
                type: 'donut',
            },
            labels: ["Entregadas", "Llegada"],
            colors:['#4eeba2', '#fb5f4f'],
            plotOptions: {
                pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10
                }
            },
            grid: {
              padding: {
                bottom: -80
              }
            },
            responsive: [{
                breakpoint: 100,
                options: {
                chart: {
                    width: 500
                },
                legend: {
                    position: 'bottom'
                }
                }
            }]
        },

        seriesMPA: [],
        chartOptionsMPA: {
            chart: {
                type: 'bar',
                height: 100
            },
            colors:['#4eeba2'],
            plotOptions: {
                bar: {
                    orderRadius: 4,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: ['Mes Pasado', 'Mes Actual' ],
            }
        },

        seriesRadial: [],
        chartOptionsRadial: {
            chart: {
              height: 350,
              type: 'radialBar',
              toolbar: {
                show: true
              }
            },
            plotOptions: {
              radialBar: {
                startAngle: -135,
                endAngle: 225,
                 hollow: {
                  margin: 0,
                  size: '70%',
                  background: '#fff',
                  image: undefined,
                  imageOffsetX: 0,
                  imageOffsetY: 0,
                  position: 'front',
                  dropShadow: {
                    enabled: true,
                    top: 3,
                    left: 0,
                    blur: 4,
                    opacity: 0.24
                  }
                },
                track: {
                  background: '#fff',
                  strokeWidth: '67%',
                  margin: 0, // margin is in pixels
                  dropShadow: {
                    enabled: true,
                    top: -3,
                    left: 0,
                    blur: 4,
                    opacity: 0.35
                  }
                },
            
                dataLabels: {
                  show: true,
                  name: {
                    offsetY: -10,
                    show: true,
                    color: '#888',
                    fontSize: '17px'
                  },
                  value: {
                    formatter: function(val) {
                      return parseInt(val);
                    },
                    color: '#111',
                    fontSize: '36px',
                    show: true,
                  }
                }
              }
            },
            fill: {
              type: 'gradient',
              gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#007bff'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
              }
            },
            stroke: {
              lineCap: 'round'
            },
            labels: ['Avance'],
        },


        seriesLine: [],
        chartOptionsLine: {
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            colors: ['#4eeba2'],
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'Proceso de Prendas',
              align: 'rigth'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            xaxis: {
              categories: ['Restante', 'Terminados'],
            }
        },

        clientesGraf: [ ],
        
    }),
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.dataDash()
        this.Lavadoras()
        this.getOrdenes()
        

        setTimeout(() => {
          this.getDetalles(this.ordenesAct[Math.floor(Math.random() * this.ordenesAct.length)])
          this.reload = false
        }, 1000);
        
        setInterval(() => {
            this.getDetalles(this.ordenesAct[Math.floor(Math.random() * this.ordenesAct.length)])
        }, 30000);
            
        
    },
    methods:{
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        
        previousSlide() {
            this.currentSlide--
        },
        nextSlide() {
            this.currentSlide++
        },
        
        dataDash(){
            this.entradasSalidas = []
            this.seriesMPA = []
            this.seriesEntregas = []
            this.seriesVisitas = []
            this.seriesPrendas = []
            this.seriesPrendasAnuales = []
            this.series = []
            fetchApi(this.url+`orden/dashboard`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.seriesEntregas = [data.datos.entregasTiempo, data.datos.entregasDestiempo]
                    let total = data.datos.entregasTiempo + data.datos.entregasDestiempo
                    let totalVisitas = data.datos.numClientesMes + data.datos.numClientesAnio

                    let totalPrendas = data.datos.numPrendasMes + data.datos.numCanceladasMes
                    let totalPrendasAnuales = data.datos.numPrendasAnio + data.datos.numCanceladasAnio

                    this.chartOptionsEntregas ={
                      chart: {
                        type: 'donut',
                      },
                      labels: ["a tiempo", "a destiempo"],
                      colors:['#4eeba2', '#fb5f4f'],

                      title: {
                        text: `${numeral(total).format('0,0')}`,
                        offsetX: 0,
                        style: {
                          fontSize: '24px',
                        }
                      },
                      subtitle: {
                        text: 'Entreas Totales',
                        offsetX: 0,
                        style: {
                          fontSize: '14px',
                        }
                      },
                      responsive: [{
                        breakpoint: 480,
                        options: {
                          chart: {
                            width: 200
                          },
                          legend: {
                            position: 'center'
                          }
                        }
                      }]
                    }

                    this.chartOptionsVisitas = {

                      chart: {
                        type: 'bar',
                        height: 280
                      },
                      labels: ["a tiempo", "a destiempo"],
                      colors:['#4eeba2', '#fb5f4f'],
                      title: {
                        text: `${numeral(totalVisitas).format('0,0')}`,
                        offsetX: 0,
                        style: {
                          fontSize: '24px',
                        }
                      },
                      
                      subtitle: {
                        text: 'Vistas Totales',
                        offsetX: 0,
                        style: {
                          fontSize: '14px',
                        }
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 1,
                          horizontal: true,
                        }
                      },
                      dataLabels: {
                        enabled: false
                      },
                      xaxis: {
                        categories: ['Mes', 'Anual' ],
                      }
                    }

                    this.chartOptionsPrendas = {
                      chart: {
                        type: 'bar',
                        height: 280
                      },
                      labels: ["Completas", "Canceladas"],
                      colors:['#4eeba2', '#fb5f4f'],
                      title: {
                        text: `${numeral(totalPrendas).format('0,0')}`,
                        offsetX: 0,
                        style: {
                          fontSize: '24px',
                        }
                      },
                      
                      subtitle: {
                        text: 'Prendas Totales',
                        offsetX: 0,
                        style: {
                          fontSize: '14px',
                        }
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 4,
                          horizontal: true,
                        }
                      },
                      dataLabels: {
                        enabled: false
                      },
                      xaxis: {
                        categories: ['Completas', 'Canceladas' ],

                      }
                    }

                    this.chartOptionsPrendasAnuales = {

                      chart: {
                        type: 'bar',
                        height: 280
                      },
                      labels: ["Completas", "Canceladas"],
                      colors:['#4eeba2', '#fb5f4f'],
                      title: {
                        text: `${numeral(totalPrendasAnuales).format('0,0')}`,
                        offsetX: 0,
                        style: {
                          fontSize: '24px',
                        }
                      },
                      
                      subtitle: {
                        text: 'Prendas Totales',
                        offsetX: 0,
                        style: {
                          fontSize: '14px',
                        }
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 4,
                          horizontal: true,
                        }
                      },
                      dataLabels: {
                        enabled: false
                      },
                      xaxis: {
                        categories: ['Completas', 'Canceladas' ],
                      }

                    }
                    
                    if(data.datos.entregas == 0 && data.datos.entradasMes == 0){
                      this.entradasSalidas = [100,0]                      
                    }else{
                      this.entradasSalidas = [data.datos.entregas, data.datos.entradasMes]
                    }

                    this.seriesVisitas.push({  name: 'Visitas', data: [data.datos.numClientesMes, data.datos.numClientesAnio]})
                    this.seriesPrendas.push({  name: 'Prendas', data: [data.datos.numPrendasMes, data.datos.numCanceladasMes]})
                    this.seriesPrendasAnuales.push({  name: 'Prendas', data: [data.datos.numPrendasAnio, data.datos.numCanceladasAnio]})

                    this.seriesMPA.push({ name: 'Ordenes', data: [data.datos.entradasMesAnterior, data.datos.entradasMes]})
                    data.datos.clientes.forEach( cli => {
                      this.clientesGraf.push({
                        x: cli.cliente,
                        y: cli.visitasMes,
                        goals: [
                          {
                            name: 'Mes Pasado',
                            value: cli.visitasMesAnterior,
                            strokeHeight: 10,
                            strokeWidth: 0,
                            strokeLineCap: 'round',

                            strokeColor: '#fb5f4f'
                          }
                        ]
                      })
                    });
                    

                }

            })
            .catch(err => console.log(err))
        },
        async Lavadoras(){
            fetchApi(this.url+'lavadora/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    if(this.lavadoras.length == 0){
                        this.sinData == false
                    }
                }
            })
        },
        async getOrdenes(){
            fetchApi(this.url+`orden/findByEstado/9`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach(dt => {
                        this.ordenesAct.push(dt.idOrden)
                    });
                }
            })
        },
        async getDetalles(idOrdenLavado){
            this.seriesRadial = []
            this.seriesLine = []
            fetchApi(this.url+`orden/dashboard/${idOrdenLavado}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.seriesRadial = [data.datos.avance]
                    this.seriesLine.push({name: "Procesos", data: [data.datos.cantidadRestante, data.datos.cantidadTerminados]})
                    this.cliente = data.datos.cliente
                    let fechaEstablecida = new Date(data.datos.fechaEntrega.split('T')[0])
                    let fechaActual = new Date()
                    if (fechaActual > fechaEstablecida) {
                        this.fechaEntregaColor = "#d9534f"
                    }else{
                        this.fechaEntregaColor = "#0d6efd"
                    }
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
.card{
    border-radius: 1rem;
}
</style>

<style scoped>
.slider {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  position: relative;
}

.cardsContent {
  display: flex;
  width: 100%;
  height: 20rem;
  transition: transform 0.3s ease-in-out;
}

.controls {
  position: absolute;
  bottom: -2rem;
  left: 0;
  width: 100%
}
</style>
