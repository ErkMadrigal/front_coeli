<template>
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
</style>
