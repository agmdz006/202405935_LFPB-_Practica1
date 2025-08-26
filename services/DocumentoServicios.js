import fs from "fs"
import path from "path"
import { parseLine } from "../utils/parseador.js"

export function LeerArchivo(filePath, callback) {
  try {
    console.log(`Leyendo archivo: ${filePath}`)

    let normalizedPath = filePath.trim()

    // quitando las comillas de la ruta absoluta
    normalizedPath = normalizedPath.replace(/^["']|["']$/g, "")

    //convirtiendo los slash "/" a la forma "\" para que windows reconozca bien la ruta y no hayan problemas
     if (process.platform === "win32") {
      normalizedPath = normalizedPath.replace(/\//g, "\\")
    }

    // verificación de ruta absoluta al momento de ingresarla a la consola
    if (!path.isAbsolute(normalizedPath)) {
      normalizedPath = path.resolve(normalizedPath)
    }

    console.log(` Ruta normalizada: ${normalizedPath}`)

    //revisando si el archivo existe y puede leerse
    fs.access(normalizedPath, fs.constants.F_OK | fs.constants.R_OK, (accessErr) => {
    //en caso de obtener un error y no se pueda acceder al archivo:
      if (accessErr) {
        console.log(` ERROR: No se puede acceder al archivo '${normalizedPath}'`)


        //si obtenemos un error al no poder entrar al archivo:
        if (accessErr.code === "ENOENT") {
          console.log(`💡 El archivo no existe en la ruta especificada`)
        }

        //retornando lista vacía "callback" cuando no se pueda leer el archivo
        if (callback) callback([])
        return
      }

      //leyendo el archivo...
      fs.readFile(normalizedPath, "utf8", (readErr, contenido) => {
        //en caso de un error de lectura...
        if (readErr) {
          console.log(` Error al leer el archivo: ${readErr.message}`)
        //retornando lista vacía para que no se rompa el programa
          if (callback) callback([])
          return
        }

        try {
          const lines = contenido
        .replace(/\r\n?|\n/g, "\n")  
        .split("\n")                 
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith("#"))

        //si el archivo está vacío notificarlo y retornar lista vacía para mantener una buena ejecución
          if (lines.length === 0) {
            console.log(" El archivo está vacío o no contiene datos válidos")
            if (callback) callback([])
            return
          }

          console.log(`Procesando ${lines.length} líneas del archivo CSV...`)

          const validRecords = [] //contenedor para los registros correctos
          let invalidLines = 0 //contenedor para registros malos

          lines.forEach((line, index) => {
            try {
              const parts = line.split(",").map((part) => {
                
                return part.trim().replace(/^["']|["']$/g, "")
              })
            //ignorando lineas extras que no entran en el formato esperado
              if (parts.length !== 5) {
                console.log(` Línea ${index + 1} ignorada: formato incorrecto (${parts.length} campos en lugar de 5)`)
                invalidLines++
                return
              }

              const record = parseLine(line)
              if (record) {
                validRecords.push(record)
              }
            } catch (error) {
              console.log(` Línea ${index + 1} ignorada: ${error.message}`)
              invalidLines++
            }
          })

          //condicional de que si las lineas válidas es igual a 0
          if (validRecords.length === 0) {
            console.log(" No se pudieron procesar registros válidos del archivo")
            console.log(" Formato requerido: id_operador,nombre_operador,estrellas,id_cliente,nombre_cliente")
            console.log(" Ejemplo: 1,Carlos Salazar,xxxxx,101,Juan Perez")
            if (callback) callback([])
            return
          }
          //confirmando carga de archivos
          console.log(
            ` Se cargaron ${validRecords.length} registros correctamente desde ${path.basename(normalizedPath)}`,
          )
          //validación de lineas incorrectas
          if (invalidLines > 0) {
            console.log(` ${invalidLines} líneas fueron ignoradas por formato incorrecto`)
          }
          console.log("==== Archivo CSV cargado exitosamente ====")

          if (callback) callback(validRecords)
        } catch (error) {
          console.log(" Error al procesar el contenido del archivo: ", error.message)
          if (callback) callback([])
        }
      })
    })
  } catch (error) {
    console.log(" Error inesperado al procesar el archivo: ", error.message)
    console.log(" Formato requerido del archivo CSV:")
    console.log("  id_operador,nombre_operador,estrellas,id_cliente,nombre_cliente")
    console.log("  Ejemplo: 1,Carlos Salazar,xxxxx,101,Juan Perez")

    if (callback) callback([])
    return []
  }
}

