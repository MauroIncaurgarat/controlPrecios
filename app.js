//Generador lista de Precios Nueva

                                   // PROVEEDORES SIN DEPENDENCIA MONEDA LOCAL
//Funciones
function controlGanancia(x,y) {
    return x/y;
}
function convertirFraccion (x){
    return parseFloat((x/100)+1); 
}
function iva (x){
    return x * 1.21;
}

//Objetos - Constructores
//Constructor Datos Proveedor - En el futuro quiero una base de datos con todos - Empiezo con uno solo para ver la funcionalidad
class proveedor {
    constructor (nombre, direccion, contacto, transporte, observaciones) {
        this.nombre = "Nombre: " + nombre.toUpperCase();
        this.direccion = "Direccion: " + direccion;
        this.contacto = "Contacto: " + contacto;
        this.transporte = "Transporte: " + transporte;
        this.observaciones = "Observaciones: " + observaciones;
    }     
}
//Constructor Lista del proveedor
class Producto {
    constructor(nombre, presentacion, costo, utilidad, descripcion) {
        this.nombre  = nombre;
        this.presentacion = presentacion;
        this.costo  = parseFloat(costo);
        this.utilidad = convertirFraccion (utilidad);
        this.descripcion = descripcion; 
    }
}
//Contructor Lista de Venta para Nuestra Empresa
class Lista{
    constructor(costoVenta, utilidad) {
        this.ventaNeta = costoVenta * utilidad;
        this.ventaFinal = parseFloat(this.ventaNeta * 1.21); 
    }
}

// Carga Inicial Datos Generales
const proveedor1 = new proveedor ("Enpolex", "Bs As", "2613837299", "Fradaos", "Demora del pedido: 15 días");

// Carga Productos Proveedor
const productosProveedor1 = [];
productosProveedor1.push (new Producto("Vaso termico 180", "x 25 unidades", 100, 50, "vaso"));
productosProveedor1.push (new Producto("Tapa vaso termico 180", "x 25 unidades", 110, 50, "tapa"));
productosProveedor1.push (new Producto("Vaso termico 240", "x 25 unidades", 115, 50, "vaso"));
productosProveedor1.push (new Producto("Tapa vaso termico 240", "x 25 unidades", 125, 52, "tapa")); // Para que salte el error en el control (52)
productosProveedor1.push (new Producto("Vaso termico 300", "x 25 unidades", 120, 50, "vaso"));
productosProveedor1.push (new Producto("Tapa vaso termico 300", "x 25 unidades", 130, 50, "tapa"));

let dimension = parseInt (productosProveedor1.length); //Saber el límite de mi iteración

// Generar Lista
const listaProveedor1 = [];
for (let i=0; i<dimension; i++){ 
    listaProveedor1.push (new Lista(productosProveedor1[i].costo,productosProveedor1[i].utilidad))
}
                                //UTILIDADES


//Filtro de Productos
const resultado = productosProveedor1.filter ((el) => el.descripcion.includes("vaso"));
const resultado2 = productosProveedor1.filter ((el) => el.descripcion.includes("tapa"));


                                    //VER RESULTADOS
//Datos Proveedor
for (const propiedad in proveedor1){
    console.log (proveedor1[propiedad]);
}
console.log("")//separar solo a fines visuales

//Listas de precio
console.log ("PRECIOS");
console.log("DATOS QUE VE EL DUEÑO");

for (let i=0; i<dimension; i++){ 
    console.log(productosProveedor1[i].nombre + " | Presentación: " + productosProveedor1[i].presentacion + " | costo: " + productosProveedor1[i].costo + " | Utilidad: " + productosProveedor1[i].utilidad + "\nVenta Neta: " + listaProveedor1[i].ventaNeta + " | Venta Final: " + listaProveedor1[i].ventaFinal ) 
}
console.log("") 

console.log("DATOS QUE VE EL CLIENTE")

for (let i=0; i<dimension; i++){ 
    console.log(productosProveedor1[i].nombre + " | Presentación: "  + productosProveedor1[i].presentacion + " | Venta Neta: " + listaProveedor1[i].ventaNeta + " | Venta Final: " + listaProveedor1[i].ventaFinal ) 
}
console.log("")

//comparador de margen de utilidad - Tengo algo fuera del estandar?
console.log("CONTROL MARGEN DE SEGURIDAD")

for (let i=0; i<dimension; i++){ 
    let z = controlGanancia(listaProveedor1[i].ventaNeta,productosProveedor1[i].costo)
    if ( z <= 1.49  || 1.51 <= z){ //Para que no sea exacto y darle cierta incertidumbre
        console.log("El producto " + productosProveedor1[i].nombre + " está FUERA de los márgenes de ganancia ( +/- 1% )")
    } 
}
console.log("")

//Filtros
console.log("Filtros")
console.log(resultado); 
console.log(resultado2);


                            //PROVEEDORES CON DEPENDENCIA DE DOLAR
console.log("");

//Parametros
const PorcentajeSeguridad = 1.03;  // Margen del 3% por inestabilidad del país
const valorDolar = 137;

/*validacion entrada numerica
do {
    valorDolar = parseInt (prompt ("Ingrese cotizacion U$D BNA")); 
} while (isNaN(valorDolar));
*/

class ProductoUSD {
    constructor(nombre, presentacion, costoUSD, utilidad, descripcion) {
        this.nombre  = nombre;
        this.presentacion = presentacion;
        this.costoUSD  = parseFloat (costoUSD);
        this.utilidad = convertirFraccion (utilidad);
        this.descripcion = descripcion; 
    }
}
class ListaUSD{
    constructor(costoUSD, valorDolar, utilidad, PorcentajeSeguridad) {
        this.costoUSD = costoUSD;
        this.valorDolar = valorDolar;
        this.utilidad = utilidad;
        this.PorcentajeSeguridad = PorcentajeSeguridad;
        this.costoPesos = (valorDolar * costoUSD)*PorcentajeSeguridad;
        this.ventaNeta = (this.costoPesos * utilidad).toFixed();
        this.ventaFinal = iva(this.ventaNeta).toFixed();
    }
}


// Carga Inicial Datos Proveedor
const proveedor2 = new proveedor ("Papelera Samseng", "Bs As", "2613832589", "Propio", "Demora del pedido: 15/20 días");
console.log ("");
for (const propiedad in proveedor2){
    console.log (proveedor2[propiedad]);
}

//Crear Productos
const productosProveedor2 = [];
productosProveedor2.push (new ProductoUSD("Toalla 4 paneles", "x 1000 unidades", 12, 48, "toalla"));
productosProveedor2.push (new ProductoUSD("Toalla 2 paneles", "x 1000 unidades", 12, 48, "toalla"));
productosProveedor2.push (new ProductoUSD("Rollo Cocina", "x 3 unidades", 0.876, 48, "papel"));
productosProveedor2.push (new ProductoUSD("Papel higénico", "x 4 unidades", 0.90, 48, "papel"));

//Crear lista precios U$D
let dimension2=productosProveedor2.length;
const listaProveedor2 = [];
for (let i=0; i<dimension2; i++){ 
    listaProveedor2.push (new ListaUSD(productosProveedor2[i].costoUSD, valorDolar, productosProveedor2[i].utilidad, PorcentajeSeguridad));
}

console.log ("PRECIOS");
console.log("DATOS QUE VE EL DUEÑO");
for (let i=0; i<dimension2; i++){ 
    console.log(productosProveedor2[i].nombre + " | Presentación: " + productosProveedor2[i].presentacion + " | costo U$D: " + productosProveedor2[i].costoUSD + " | Utilidad: " + productosProveedor2[i].utilidad + "\nVenta Neta: " + listaProveedor2[i].ventaNeta + " | Venta Final: " + listaProveedor2[i].ventaFinal ) 
}
console.log("");

console.log("DATOS QUE VE EL DUEÑO");
for (let i=0; i<dimension2; i++){ 
    console.log(productosProveedor2[i].nombre + " | Presentación: " + productosProveedor2[i].presentacion + "\nVenta Neta: " + listaProveedor2[i].ventaNeta + " | Venta Final: " + listaProveedor2[i].ventaFinal ) 
}


/*
                                    //CONTROL COSTOS

//SI CAMBIA EL DOLAR - CAMBIO EL COSTO?

//Modificamos el costo o no?
let diferenciaCosto = (((costoP1/resultadoMargenSeguridad)-1)*100).toFixed(2); 

if ( diferenciaCosto < 0) {
    console.log ("Hay que actualizar los costos. Tenemos una diferencia de % " + diferenciaCosto);
} else if (diferenciaCosto > 0 && diferenciaCosto < 1 ) {
    console.log ("Cuidado, estamos con una diferencia de costos debajo del 1%  ( " + diferenciaCosto + " ) " );
} else {
    console.log("Estamos dentro del Margen. La diferencia es de % " + diferenciaCosto);
}
*/
