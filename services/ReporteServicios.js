import fs from "fs"

// Función para contar estrellas desde el string de estrellas
function contarEstrellas(estrellas) {
  return (estrellas.match(/x/g) || []).length
}

// Función para clasificar llamadas
function clasificarLlamada(numEstrellas) {
  if (numEstrellas >= 4) return "Buena"
  if (numEstrellas >= 2) return "Media"
  return "Mala"
}

export function mostrarHistorialConsola(records) {
  console.log("\n=== HISTORIAL DE LLAMADAS ===")
  console.log("ID Op. | Nombre Operador    | Estrellas | ID Cli. | Nombre Cliente")
  console.log("-------|-------------------|-----------|---------|------------------")

  records.forEach((r) => {
    const numEstrellas = contarEstrellas(r.estrellas)
    console.log(
      `${r.idOperador.toString().padEnd(6)} | ${r.NombreOperador.padEnd(17)} | ${numEstrellas} estrellas | ${r.idCliente.toString().padEnd(7)} | ${r.NombreCliente}`,
    )
  })
}

export function exportarHistorialHTML(records) {
  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historial de Llamadas</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #ccc; }
    </style>
</head>
<body>
    <h1>Historial de Llamadas</h1>
    <table>
        <tr>
            <th>ID Operador</th>
            <th>Nombre Operador</th>
            <th>Calificación</th>
            <th>ID Cliente</th>
            <th>Nombre Cliente</th>
            <th>Clasificación</th>
        </tr>`

  records.forEach((r) => {
    const numEstrellas = contarEstrellas(r.estrellas)
    const clasificacion = clasificarLlamada(numEstrellas)

    html += `
        <tr>
            <td>${r.idOperador}</td>
            <td>${r.NombreOperador}</td>
            <td>${numEstrellas} estrellas</td>
            <td>${r.idCliente}</td>
            <td>${r.NombreCliente}</td>
            <td>${clasificacion}</td>
        </tr>`
  })

  html += `
    </table>
    <p>Total de llamadas: ${records.length}</p>
</body>
</html>`

  if (!fs.existsSync("./reportes")) {
    fs.mkdirSync("./reportes")
  }

  fs.writeFileSync("./reportes/historial.html", html)
  console.log("✓ Reporte HTML generado en ./reportes/historial.html")
}

export function exportarOperadoresHTML(records) {
  // Obtener operadores únicos
  const operadores = []
  const operadoresMap = new Map()

  records.forEach((r) => {
    if (!operadoresMap.has(r.idOperador)) {
      operadoresMap.set(r.idOperador, r.NombreOperador)
      operadores.push({ id: r.idOperador, nombre: r.NombreOperador })
    }
  })

  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado de Operadores</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #ccc; }
    </style>
</head>
<body>
    <h1>Listado de Operadores</h1>
    <table>
        <tr>
            <th>ID Operador</th>
            <th>Nombre Operador</th>
        </tr>`

  operadores.forEach((op) => {
    html += `
        <tr>
            <td>${op.id}</td>
            <td>${op.nombre}</td>
        </tr>`
  })

  html += `
    </table>
    <p>Total de operadores: ${operadores.length}</p>
</body>
</html>`

  fs.writeFileSync("./reportes/operadores.html", html)
  console.log("✓ Reporte de operadores generado en ./reportes/operadores.html")
}

export function exportarClientesHTML(records) {
  // Obtener clientes únicos
  const clientes = []
  const clientesMap = new Map()

  records.forEach((r) => {
    if (!clientesMap.has(r.idCliente)) {
      clientesMap.set(r.idCliente, r.NombreCliente)
      clientes.push({ id: r.idCliente, nombre: r.NombreCliente })
    }
  })

  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado de Clientes</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #ccc; }
    </style>
</head>
<body>
    <h1>Listado de Clientes</h1>
    <table>
        <tr>
            <th>ID Cliente</th>
            <th>Nombre Cliente</th>
        </tr>`

  clientes.forEach((cliente) => {
    html += `
        <tr>
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
        </tr>`
  })

  html += `
    </table>
    <p>Total de clientes: ${clientes.length}</p>
</body>
</html>`

  fs.writeFileSync("./reportes/clientes.html", html)
  console.log("✓ Reporte de clientes generado en ./reportes/clientes.html")
}

export function exportarRendimientoHTML(records) {
  // Calcular rendimiento por operador
  const operadores = new Map()
  const totalLlamadas = records.length

  records.forEach((r) => {
    if (operadores.has(r.idOperador)) {
      operadores.get(r.idOperador).llamadas++
    } else {
      operadores.set(r.idOperador, {
        nombre: r.NombreOperador,
        llamadas: 1,
      })
    }
  })

  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Rendimiento de Operadores</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #ccc; }
    </style>
</head>
<body>
    <h1>Rendimiento de Operadores</h1>
    <table>
        <tr>
            <th>ID Operador</th>
            <th>Nombre Operador</th>
            <th>Llamadas Atendidas</th>
            <th>Porcentaje de Atención</th>
        </tr>`

  operadores.forEach((data, id) => {
    const porcentaje = ((data.llamadas / totalLlamadas) * 100).toFixed(2)
    html += `
        <tr>
            <td>${id}</td>
            <td>${data.nombre}</td>
            <td>${data.llamadas}</td>
            <td>${porcentaje}%</td>
        </tr>`
  })

  html += `
    </table>
    <p>Total de llamadas globales: ${totalLlamadas}</p>
</body>
</html>`

  fs.writeFileSync("./reportes/rendimiento.html", html)
  console.log("✓ Reporte de rendimiento generado en ./reportes/rendimiento.html")
}

export function mostrarPorcentajeClasificacion(records) {
  let buenas = 0,
    medias = 0,
    malas = 0

  records.forEach((r) => {
    const numEstrellas = contarEstrellas(r.estrellas)
    const clasificacion = clasificarLlamada(numEstrellas)

    if (clasificacion === "Buena") buenas++
    else if (clasificacion === "Media") medias++
    else malas++
  })

  const total = records.length
  const porcentajeBuenas = ((buenas / total) * 100).toFixed(2)
  const porcentajeMedias = ((medias / total) * 100).toFixed(2)
  const porcentajeMalas = ((malas / total) * 100).toFixed(2)

  console.log("\n=== PORCENTAJE DE CLASIFICACIÓN DE LLAMADAS ===")
  console.log(`🟢 Llamadas Buenas (4-5 estrellas): ${buenas} (${porcentajeBuenas}%)`)
  console.log(`🟡 Llamadas Medias (2-3 estrellas): ${medias} (${porcentajeMedias}%)`)
  console.log(`🔴 Llamadas Malas (0-1 estrellas): ${malas} (${porcentajeMalas}%)`)
  console.log(`📊 Total de llamadas: ${total}`)
}

export function mostrarCantidadPorCalificacion(records) {
  const calificaciones = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  records.forEach((r) => {
    const numEstrellas = contarEstrellas(r.estrellas)
    if (numEstrellas >= 1 && numEstrellas <= 5) {
      calificaciones[numEstrellas]++
    }
  })

  console.log("\n=== CANTIDAD DE LLAMADAS POR CALIFICACIÓN ===")
  console.log(`⭐ 1 estrella: ${calificaciones[1]} llamadas`)
  console.log(`⭐⭐ 2 estrellas: ${calificaciones[2]} llamadas`)
  console.log(`⭐⭐⭐ 3 estrellas: ${calificaciones[3]} llamadas`)
  console.log(`⭐⭐⭐⭐ 4 estrellas: ${calificaciones[4]} llamadas`)
  console.log(`⭐⭐⭐⭐⭐ 5 estrellas: ${calificaciones[5]} llamadas`)
  console.log(`📊 Total: ${records.length} llamadas`)
}