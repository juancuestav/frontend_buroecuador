<template>
  <q-page class="flex flex-center bg-black">
    <div ref="pdfContainer" class="pdf-container text-center">
      <canvas ref="pdfCanvas"></canvas>
    </div>
    <div class="controls">
      <div class="zoom-controls">
        <q-btn @click="zoomIn" label="Zoom In" color="primary" />
        <q-btn @click="zoomOut" label="Zoom Out" color="primary" />
        <span>Zoom: {{ zoomLevel.toFixed(1) }}x</span>
      </div>
      <div class="navigation-controls">
        <q-btn
          @click="prevPage"
          label="Anterior"
          :disabled="currentPage === 1"
          color="secondary"
        />
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <q-btn
          @click="nextPage"
          label="Siguiente"
          :disabled="currentPage === totalPages"
          color="secondary"
        />
      </div>
      <q-btn @click="loadPdf" label="Cargar PDF" color="secondary" />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'

// Configura el worker de PDF.js
GlobalWorkerOptions.workerSrc = 'pdf.worker.mjs'

export default {
  name: 'PdfViewer',
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const pdfContainer = ref(null)
    const pdfCanvas = ref(null)
    const zoomLevel = ref(1.5) // Nivel de zoom inicial
    const currentPage = ref(1) // Página actual
    let pdfDocument = null // Almacena el documento PDF
    const totalPages = ref(0) // Total de páginas en el PDF

    const loadPdf = async () => {
      try {
        const loadingTask = getDocument(props.pdfUrl)
        pdfDocument = await loadingTask.promise
        totalPages.value = pdfDocument.numPages // Obtener el número total de páginas
        renderPage(currentPage.value) // Renderiza la primera página
      } catch (error) {
        console.error('Error loading PDF: ', error)
      }
    }

    const renderPage = async (pageNumber) => {
      const page = await pdfDocument.getPage(pageNumber)
      const viewport = page.getViewport({ scale: zoomLevel.value })
      const canvas = pdfCanvas.value
      const context = canvas.getContext('2d')

      // Ajusta el tamaño del canvas
      canvas.height = viewport.height
      canvas.width = viewport.width

      // Limpia el canvas antes de renderizar
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Renderiza la página en el canvas
      await page.render({ canvasContext: context, viewport }).promise
    }

    const zoomIn = () => {
      zoomLevel.value += 0.1 // Aumentar el zoom
      renderPage(currentPage.value) // Renderiza la página nuevamente
    }

    const zoomOut = () => {
      if (zoomLevel.value > 0.1) {
        zoomLevel.value -= 0.1 // Disminuir el zoom
        renderPage(currentPage.value) // Renderiza la página nuevamente
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        renderPage(currentPage.value) // Renderiza la siguiente página
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        renderPage(currentPage.value) // Renderiza la página anterior
      }
    }

    onMounted(() => {
      loadPdf()
    })

    return {
      pdfContainer,
      pdfCanvas,
      loadPdf,
      zoomIn,
      zoomOut,
      nextPage,
      prevPage,
      currentPage,
      totalPages,
      zoomLevel,
    }
  },
}
</script>

<style scoped>
.pdf-container {
  width: 100%;
  height: auto; /* Permite que la altura se ajuste automáticamente */
  overflow: auto; /* Habilita el desplazamiento */
  position: relative; /* Para posicionar el canvas correctamente */
}

canvas {
  display: block; /* Elimina el espacio en blanco debajo del canvas */
}

.controls {
  position: fixed; /* Mantiene los controles en una posición fija */
  bottom: 20px; /* Espacio desde la parte inferior */
  left: 50%; /* Centra horizontalmente */
  transform: translateX(-50%); /* Ajusta el centrado */
  background-color: rgba(0, 0, 0, 0.7); /* Fondo semi-transparente */
  padding: 10px; /* Espaciado interno */
  border-radius: 5px; /* Bordes redondeados */
  z-index: 10; /* Asegura que los controles estén por encima del contenido */
}

.zoom-controls,
.navigation-controls {
  display: flex;
  justify-content: center;
  margin: 5px 0;
}
</style>