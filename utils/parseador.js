import CallRecord from "../models/CallsRecord.js"

export function parseLine(line) {
  const parts = line.split(",") // separando por medio de comas los datos del archivo txt

  const idOperador = Number.parseInt(parts[0]) // parseando a tipo int el id del operador
  const nombreOperador = parts[1] // separando por comas el nombre del operador
  const estrellas = parts[2].trim() // separando por comas el numero de estrellas
  const idCliente = Number.parseInt(parts[3]) // parseando a tipo int el id del cliente
  const nombreCliente = parts[4] // separando el nombre del cliente

  return new CallRecord(idOperador, nombreOperador, estrellas, idCliente, nombreCliente)
}