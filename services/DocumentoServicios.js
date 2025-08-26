import fs from "fs"
import path from "path"
import { parseLine } from "../utils/parseador.js"

export function LeerArchivo(filePath, callback) {
  try {
    console.log(`📖 Leyendo archivo: ${filePath}`)

    let normalizedPath = filePath.trim()

    // Remove quotes if present
    normalizedPath = normalizedPath.replace(/^["']|["']$/g, "")

    // Convert forward slashes to backslashes on Windows
    if (process.platform === "win32") {
      normalizedPath = normalizedPath.replace(/\//g, "\\")
    }

    // Resolve to absolute path
    if (!path.isAbsolute(normalizedPath)) {
      normalizedPath = path.resolve(normalizedPath)
    }

    console.log(`🔍 Ruta normalizada: ${normalizedPath}`)

    fs.access(normalizedPath, fs.constants.F_OK | fs.constants.R_OK, (accessErr) => {
      if (accessErr) {
        console.log(`❌ ERROR: No se puede acceder al archivo '${normalizedPath}'`)

        if (accessErr.code === "ENOENT") {
          console.log(`💡 El archivo no existe en la ruta especificada`)
        } else if (accessErr.code === "EACCES") {
          console.log(`💡 Sin permisos para leer el archivo`)
        } else {
          console.log(`💡 Error de acceso: ${accessErr.message}`)
        }

        console.log(`💡 Sugerencias:`)
        console.log(`   1. Verifica que el archivo existe: ${normalizedPath}`)
        console.log(`   2. Cierra Excel si tienes el archivo abierto`)
        console.log(`   3. Ejecuta como administrador si es necesario`)
        console.log(`   4. Copia el archivo a una carpeta sin espacios`)

        if (callback) callback([])
        return
      }

      fs.readFile(normalizedPath, "utf8", (readErr, contenido) => {
        if (readErr) {
          console.log(`❌ Error al leer el archivo: ${readErr.message}`)
          if (callback) callback([])
          return
        }

        try {
          const lines = contenido
            .replace(/\r\n/g, "\n") // Normalize line endings
            .replace(/\r/g, "\n") // Handle old Mac line endings
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.startsWith("#"))

          if (lines.length === 0) {
            console.log("❌ El archivo está vacío o no contiene datos válidos")
            if (callback) callback([])
            return
          }

          console.log(`📊 Procesando ${lines.length} líneas del archivo CSV...`)

          const validRecords = []
          let invalidLines = 0

          lines.forEach((line, index) => {
            try {
              const parts = line.split(",").map((part) => {
                // Remove surrounding quotes and trim
                return part.trim().replace(/^["']|["']$/g, "")
              })

              if (parts.length !== 5) {
                console.log(`⚠ Línea ${index + 1} ignorada: formato incorrecto (${parts.length} campos en lugar de 5)`)
                invalidLines++
                return
              }

              const record = parseLine(line)
              if (record) {
                validRecords.push(record)
              }
            } catch (error) {
              console.log(`⚠ Línea ${index + 1} ignorada: ${error.message}`)
              invalidLines++
            }
          })

          if (validRecords.length === 0) {
            console.log("❌ No se pudieron procesar registros válidos del archivo")
            console.log("💡 Formato requerido: id_operador,nombre_operador,estrellas,id_cliente,nombre_cliente")
            console.log("💡 Ejemplo: 1,Carlos Salazar,xxxxx,101,Juan Perez")
            if (callback) callback([])
            return
          }

          console.log(
            `✅ Se cargaron ${validRecords.length} registros correctamente desde ${path.basename(normalizedPath)}`,
          )
          if (invalidLines > 0) {
            console.log(`📊 ${invalidLines} líneas fueron ignoradas por formato incorrecto`)
          }
          console.log("==== Archivo CSV cargado exitosamente ====")

          if (callback) callback(validRecords)
        } catch (error) {
          console.log("❌ Error al procesar el contenido del archivo: ", error.message)
          if (callback) callback([])
        }
      })
    })
  } catch (error) {
    console.log("❌ Error inesperado al procesar el archivo: ", error.message)
    console.log("💡 Formato requerido del archivo CSV:")
    console.log("   id_operador,nombre_operador,estrellas,id_cliente,nombre_cliente")
    console.log("   Ejemplo: 1,Carlos Salazar,xxxxx,101,Juan Perez")

    if (callback) callback([])
    return []
  }
}

