<template>
    <div>
        <b-card :title="data.nombre" :sub-title="tipoLavado.nombre" v-if="reload">
            <apexchart-all type="radialBar" :options="chartOptionsRadial" :series="seriesRadial"></apexchart-all> 
        </b-card>
        <b-card no-body class="overflow-hidden" v-else>
            <v-skeleton-loader
                height="300"
                type="image, image, image"
            >
            </v-skeleton-loader>
        </b-card>
    </div>
</template>
  
<script>
import { fetchApi } from "@/service/service.js"
export default {
    name:"lavadoraDashboard",
    props: {
        data: Object,
    },
    data: () => ({
        url: process.env.VUE_APP_SERVICE_URL_API,
        reload: false,
        tipoLavado: '',
       labels: ['Percent'],
        
       seriesRadial: [],
        // chartOptionsRadial: {
        //     chart: {
        //       height: 350,
        //       type: 'radialBar',
        //       toolbar: {
        //         show: true
        //       }
        //     },
        //     plotOptions: {
        //       radialBar: {
        //         startAngle: -135,
        //         endAngle: 225,
        //          hollow: {
        //           margin: 0,
        //           size: '70%',
        //           background: '#fff',
        //           image: undefined,
        //           imageOffsetX: 0,
        //           imageOffsetY: 0,
        //           position: 'front',
        //           dropShadow: {
        //             enabled: true,
        //             top: 3,
        //             left: 0,
        //             blur: 4,
        //             opacity: 0.24
        //           }
        //         },
        //         track: {
        //           background: '#fff',
        //           strokeWidth: '67%',
        //           margin: 0, // margin is in pixels
        //           dropShadow: {
        //             enabled: true,
        //             top: -3,
        //             left: 0,
        //             blur: 4,
        //             opacity: 0.35
        //           }
        //         },
            
        //         dataLabels: {
        //           show: true,
        //           name: {
        //             offsetY: -10,
        //             show: true,
        //             color: '#888',
        //             fontSize: '17px'
        //           },
        //           value: {
        //             formatter: function(val) {
        //               return parseInt(val);
        //             },
        //             color: '#111',
        //             fontSize: '36px',
        //             show: true,
        //           }
        //         }
        //       }
        //     },
        //     fill: {
        //       type: 'gradient',
        //       gradient: {
        //         shade: 'dark',
        //         type: 'horizontal',
        //         shadeIntensity: 0.5,
        //         gradientToColors: ['#007bff'],
        //         inverseColors: true,
        //         opacityFrom: 1,
        //         opacityTo: 1,
        //         stops: [0, 100]
        //       }
        //     },
        //     stroke: {
        //       lineCap: 'round'
        //     },
        //     labels: ['Avance'],
        // },

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
                shadeIntensity: 0.6,
                // gradientToColors: ['#4eeba2'],
                gradientToColors: ['#ff1800'],
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
              }
            },
            stroke: {
              lineCap: 'round'
            },
            labels: ['Capacidad %',],
          },

        
    }),
    mounted(){
        this.Lavadoras()
        this.capacidad(this.data.id)
        // setTimeout(() => {
            this.reload = true
        // }, 1500);
        
    },
    methods: {
        async Lavadoras(){
            fetchApi(this.url+`tipoLavado/findById/${this.data.tipoLavado}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavado = data.datos
                }
            })
        },
        capacidad(id){
            fetchApi(this.url+`lavadora/capacidad/${id}`, 'GET', this.$session.get('token'))
            .then(dt => {
              if(dt.datos.porcentaje > 100){
                this.seriesRadial = [100]
                }else{
                  this.seriesRadial = [dt.datos.porcentaje]
                }
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
    /* height: 20rem; */
}


</style>