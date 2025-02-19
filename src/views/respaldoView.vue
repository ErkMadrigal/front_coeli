<!-- <template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5 container">
            holq munndo lector QR
            <input v-model="code" placeholder="Código QR" @input="stopScanner" @blur="startScanner">
            <button class="btn btn-primary" @click="startScanner">Iniciar Escáner</button>
            <button class="btn btn-danger" @click="stopScanner">Detener Escáner</button>
            <p v-if="scanning">Escaneando...</p>
            <p>Código QR escaneado: {{ qrResult }}</p>
            <div id="scanner-container">
                <div id="video"></div>
            </div>
        </b-container>
        <br>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import { refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';
import Quagga from 'quagga';
// import VueQrReader from 'vue-qr-reader';

export default {
    data: () => ({
        scanning: false,
        qrResult: null,
        code: '',
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        loginComponent,
        // QrcodeStream,
        // QrcodeDropZone,
        // QrcodeCapture
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.startScanner();
         this.requestCameraAccess();
    },
    methods: {
        
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        requestCameraAccess() {
            const videoElement = document.getElementById('video');
    
            navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function (stream) {
                videoElement.srcObject = stream;
            })
            .catch(function (error) {
                console.error('Error al acceder a la cámara:', error);
            });
        },
        startScanner() {
            Quagga.init({
                    inputStream: {
                        name: "Live",
                        type: "LiveStream",
                        target: document.querySelector("#video"),
                    },
                    frequency: 5,
                    decoder: {
                        readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
                    },
                },
                (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    Quagga.start();
                    this.scanning = true;
                }
            );

            Quagga.onDetected((result) => {
                this.qrResult = result.codeResult.code;
                this.stopScanner();
            });
        },
        stopScanner() {
            Quagga.stop();
            this.scanning = false;
        },
        async updatePage(status){
            if(status == 200){
                this.mostraClientes()
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
</script> -->

<!-- <template>
    <div>
      <div id="camera-container">
        <video id="video" autoplay></video>
        <div v-if="showDetectionBox" :style="detectionBoxStyle" class="detection-box"></div>
      </div>
    </div>
  </template>
  
  <script>
  import Quagga from 'quagga';
  
  export default {
    data() {
      return {
        showDetectionBox: false,
        detectionBoxStyle: {
          left: '0px',
          top: '0px',
          width: '0px',
          height: '0px',
        },
      };
    },
    methods: {
      requestCameraAccess() {
        const videoElement = document.getElementById('video');
  
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            videoElement.srcObject = stream;
            this.startDetection();
          })
          .catch((error) => {
            console.error('Error al acceder a la cámara:', error);
          });
      },
      startDetection() {
        Quagga.init(
          {
            inputStream: {
              name: 'Live',
              type: 'LiveStream',
              target: document.querySelector('#video'),
            },
            frequency: 10, // Ajusta la frecuencia según sea necesario
            decoder: {
              readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'],
            },
          },
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            Quagga.start();
          }
        );
  
        Quagga.onDetected((result) => {
          this.showDetectionBox = true;
          const { codeResult, line } = result;
  
          const topLeft = line.reduce((acc, point) => {
            return {
              x: (point.x < acc.x) ? point.x : acc.x,
              y: (point.y < acc.y) ? point.y : acc.y,
            };
          }, { x: Infinity, y: Infinity });
  
          const bottomRight = line.reduce((acc, point) => {
            return {
              x: (point.x > acc.x) ? point.x : acc.x,
              y: (point.y > acc.y) ? point.y : acc.y,
            };
          }, { x: 0, y: 0 });
  
          this.detectionBoxStyle = {
            left: `${topLeft.x}px`,
            top: `${topLeft.y}px`,
            width: `${bottomRight.x - topLeft.x}px`,
            height: `${bottomRight.y - topLeft.y}px`,
          };
  
          // También puedes tomar medidas adicionales, como mostrar el valor del código de barras detectado.
          console.log(`Código de barras detectado: ${codeResult.code}`);
        });
      },
    },
    mounted() {
      this.requestCameraAccess();
    },
  };
  </script>
  
  <style scoped>
  #camera-container {
    position: relative;
  }
  
  .detection-box {
    position: absolute;
    border: 2px solid red;
    box-sizing: border-box;
    pointer-events: none;
  }
  </style> -->
  