import readline from "readline"
import { LeerArchivo } from "./DocumentoServicios.js"
import {exportarHistorialHTML,exportarOperadoresHTML,exportarClientesHTML,exportarRendimientoHTML,mostrarPorcentajeClasificacion,
  mostrarCantidadPorCalificacion,
} from "./ReporteServicios.js"

let records = []

export function startMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  function showMenu() {
    console.log("\n=== MENÚ PRINCIPAL ===")
    console.log("1. Cargar Registros de Llamadas")
    console.log("2. Exportar Historial de Llamadas")
    console.log("3. Exportar Listado de Operadores")
    console.log("4. Exportar Listado de Clientes")
    console.log("5. Exportar Rendimiento de Operadores")
    console.log("6. Mostrar Porcentaje de Clasificación de Llamadas")
    console.log("7. Mostrar Cantidad de Llamadas por Calificación")
    console.log("8. Salir")
    console.log("========================")
    rl.question("Seleccione una opción: ", handleMenuOption)
  }

  function handleMenuOption(option) {
    switch (option) {
      case "1":
        rl.question("Ingrese la ruta del archivo (TXT o CSV): ", (filePath) => {
          if (!filePath.trim()) {
            filePath = "./data/llamadas.txt" // Default file
            console.log(" Usando archivo por defecto: ./data/llamadas.txt")
          }

          // Validate file extension
          const validExtensions = [".txt", ".csv"]
          const fileExtension = filePath.toLowerCase().substring(filePath.lastIndexOf("."))

          if (!validExtensions.includes(fileExtension)) {
            console.log(" Formato de archivo no válido. Use archivos .txt o .csv")
            showMenu()
            return
          }

          LeerArchivo(filePath, (loadedRecords) => {
            records = loadedRecords
            if (records.length > 0) {
              console.log(`✓ Se cargaron ${records.length} registros correctamente desde ${filePath}`)
            }
            showMenu()
          })
        })
        return 
      case "2":
        if (records.length === 0) {
          console.log(" Primero debe cargar los registros de llamadas")
        } else {
          exportarHistorialHTML(records)
        }
        break
      case "3":
        if (records.length === 0) {
          console.log(" Primero debe cargar los registros de llamadas")
        } else {
          exportarOperadoresHTML(records)
        }
        break
      case "4":
        if (records.length === 0) {
          console.log(" Primero debe cargar los registros de llamadas")
        } else {
          exportarClientesHTML(records)
        }
        break
      case "5":
        if (records.length === 0) {
          console.log(" Primero debe cargar los registros de llamadas")
        } else {
          exportarRendimientoHTML(records)
        }
        break
      case "6":
        if (records.length === 0) {
          console.log(" Primero debe cargar los registros de llamadas")
        } else {
          mostrarPorcentajeClasificacion(records)
        }
        break
      case "7":
        if (records.length === 0) {
          console.log("Primero debe cargar los registros de llamadas")
        } else {
          mostrarCantidadPorCalificacion(records)
        }
        break
      case "8":
        console.log("Saliendo del programa...")
        rl.close()
        return
      default:
        console.log(" Opción no válida. Intente de nuevo.")
    }
    showMenu()
  }

  showMenu()
}
