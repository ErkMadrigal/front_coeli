<template>
    <div>
        <b-card title="Frecuencia de los clientes">
            <apexchart-all v-if="reload" type="bar" height="350" :options="chartOptions" :series="series"></apexchart-all>
            
        </b-card>
    </div>
</template>
  
<script>
// import { fetchApi } from "@/service/service.js"
export default {
    name:"graficaClientes",
    props: {
        data: Object,
    },
    data: () => ({
        url: process.env.VUE_APP_SERVICE_URL_API,
        reload: false,
        series: [ ],
        chartOptions: {
          chart: {
            height: 350,
            type: 'bar',
            zoom: {
              enabled: true
            }
          },
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          plotOptions: {
            // bar: {
            //   columnWidth: '60%'
            // }
            bar: {
                horizontal: false,
                borderRadius: 10,
                dataLabels: {
                  total: {
                    enabled: true,
                    style: {
                      fontSize: '13px',
                      fontWeight: 900
                    }
                  }
                }
              },
          },
          colors: ['#4eeba2'],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Mes Actual', 'Mes Pasado'],
            markers: {
              fillColors: ['#4eeba2', '#fb5f4f']
            }
          }
        },
        
        
    }),
    mounted(){
      setTimeout(() => {
        this.series = [{
          name: 'Mes Actual',
          data: this.data.clientesGraf 
        }]
        
        this.reload = true
      }, 5000);
        
    },
    methods: {
        
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