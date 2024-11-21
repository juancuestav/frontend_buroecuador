<template>
  <q-page>
    <div class="pdf-container">
      <canvas ref="pdfCanvas"></canvas>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'

// Configurar Worker Local
GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js'

const loadPdf = async (url: string) => {
  const pdfDoc = await getDocument(url).promise
  const page = await pdfDoc.getPage(1)

  // Renderizar página en un canvas
  const viewport = page.getViewport({ scale: 1.5 })
  const canvas = document.getElementById('pdfCanvas') as HTMLCanvasElement
  const context = canvas.getContext('2d')!
  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({ canvasContext: context, viewport }).promise
}

// Cargar PDF
loadPdf('https://example.com/path/to/pdf.pdf')

// GlobalWorkerOptions.workerSrc =
// 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
/* GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js'
const pdfCanvas = ref<HTMLCanvasElement | null>(null)
const pdfDoc = ref<any>(null)
const pageNum = ref(1)
const pageCount = ref(0)

const loadPdf = async (url: string) => {
  pdfDoc.value = await getDocument(url).promise
  pageCount.value = pdfDoc.value.numPages
  renderPage()
}

const renderPage = async () => {
  const page = await pdfDoc.value.getPage(pageNum.value)
  const viewport = page.getViewport({ scale: 1.5 })

  const canvas = pdfCanvas.value
  if (!canvas) return

  const context = canvas.getContext('2d')
  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({
    canvasContext: context!,
    viewport: viewport,
  }).promise
}

const prevPage = () => {
  if (pageNum.value > 1) {
    pageNum.value--
    renderPage()
  }
}

const nextPage = () => {
  if (pageNum.value < pageCount.value) {
    pageNum.value++
    renderPage()
  }
}

onMounted(() => {
  loadPdf(
    'https://www.uv.mx/pozarica/caa-conta/files/2016/02/REGULAR-AND-IRREGULAR-VERBS.pdf'
  ) // Cambia por tu ruta al PDF
}) */
</script>

<style scoped>
.pdf-container {
  text-align: center;
  overflow: auto;
  max-height: 80vh;
}
canvas {
  border: 1px solid #ccc;
  margin: auto;
}
</style>
