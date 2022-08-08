//Generador lista de Precios Nueva

//Objetos
//Datos generales Proveedor - En el futuro quiero una base de datos con todos - Empiezo con uno solo para ver la funcionalidad
class proveedor {
    constructor (nombre, direccion, contacto, transporte, observaciones) {
        this.nombre = nombre.toUpperCase();
        this.direccion = direccion;
        this.contacto = contacto;
        this.transporte = transporte;
        this.observaciones = observaciones;
    }     
}
// Carga 
const proveedor1 = new proveedor ("Enpolex", "Bs As", "2613837299", "Fradaos", "Demora del pedido: 15 días");

for (const propiedad in proveedor1){
    console.log (proveedor1[propiedad]);
}
console.log ("Precios", proveedor1.nombre);

//Constructor Lista del proveedor
class Producto {
    constructor(nombre, presentacion, costo, utilidad) {
        this.nombre  = nombre;
        this.presentacion = presentacion;
        this.costo  = parseFloat(costo);
        this.utilidad = parseFloat((utilidad/100)+1);
    }
}

//Arrays -- Datos de entrada de productos de determinado proveedor
const productosProveedor1 = [];
productosProveedor1.push (new Producto("Vaso termico 180", "x 25 unidades", 100, 50));
productosProveedor1.push (new Producto("Tapa vaso termico 180", "x 25 unidades", 110, 50));
productosProveedor1.push (new Producto("Vaso termico 240", "x 25 unidades", 115, 50));
productosProveedor1.push (new Producto("Tapa vaso termico 240", "x 25 unidades", 125, 52)); // Para que salte el error en el control (52)

let dimension = parseInt (productosProveedor1.length); //limite iteracion

//Contructor Lista de Venta para Nuestra Empresa
class Lista{
    constructor(costoVenta, utilidad) {
        this.ventaNeta = costoVenta * utilidad;
        this.ventaFinal = parseFloat(this.ventaNeta * 1.21); 
    }
}

listaProveedor1 = [];
for (let i=0; i<dimension; i++){ 
    listaProveedor1.push (new Lista(productosProveedor1[i].costo,productosProveedor1[i].utilidad))
}
console.log("")

//Arrays -- Lista de precios de proveedor

// Ah fin de ver que este todo OK
console.log("DATOS QUE VE EL DUEÑO");
for (let i=0; i<dimension; i++){ 
    console.log(productosProveedor1[i].nombre + " | Presentación: " + productosProveedor1[i].presentacion + " | costo: " + productosProveedor1[i].costo + " | Utilidad: " + productosProveedor1[i].utilidad + "\nVenta Neta: " + listaProveedor1[i].ventaNeta + " | Venta Final: " + listaProveedor1[i].ventaFinal ) 
}
console.log("")
console.log("DATOS QUE VE EL CLIENTE")

//Datos para los clientes
for (let i=0; i<dimension; i++){ 
    console.log(productosProveedor1[i].nombre + " | Presentación: "  + productosProveedor1[i].presentacion + " | Venta Neta: " + listaProveedor1[i].ventaNeta + " | Venta Final: " + listaProveedor1[i].ventaFinal ) 
}

console.log("")

//comparador de margen de utilidad 
console.log("CONTROL MARGEN DE SEGURIDAD (En el futuro solo me va a interesar los que estén fuera)")

let controlGanancia;
for (let i=0; i<dimension; i++){ 
    controlGanancia = listaProveedor1[i].ventaNeta/productosProveedor1[i].costo;
    
    if (1.49 <= controlGanancia && controlGanancia <= 1.51){ //Para que no sea exacto y darle cierta incertidumbre
        console.log ( "El producto " + productosProveedor1[i].nombre + " está DENTRO de los margenes de ganancia ( +/- 1%)")
    } else {
        console.log("El producto " + productosProveedor1[i].nombre + " está FUERA de los márgenes de ganancia ( +/- 1% )" )
    }

}

/* DESACTIVO ESTA PARTE PORQUE TENGO QUE ANALIZAR COMO INCLUIRLO

//Programa destinado a la generacion y control de precios

Para corroborar el funcionamiento y que de números similares con los cargados usar:
U$D = 137
Costo U$D = 1 


//Parametros
let valorDolar; // X 
let precioDolar; // Y

//validacion entrada numerica
do {
    valorDolar = parseInt (prompt ("Ingrese cotizacion U$D BNA")); 
} while (isNaN(valorDolar));

do {
    precioDolar = parseInt( prompt ("Ingrese el costo en U$D del Producto")); 
} while (isNaN(precioDolar));


// Valores constantes donde el usuario no deberia modificar

const PorcentajeSeguridad = 1.03;  // Margen del 3%
const delta = 1.45; // Margen de utilidad del 45%

let costoP1 = 142;
let ventaP1 = 205.90; 

console.log ("Costo actual $ " + costoP1);
console.log ("Venta actual $ " + ventaP1);

//Comprobacion de la utilidad actual
let diferenciaMargen = (((ventaP1/costoP1)-1)*100).toFixed();
console.log("El margen actula de utilidad es de % " + diferenciaMargen );

                                    // GENERACION DE LISTA 

//Calculo del costo dolar 
function costoDolar (x, y){
    return x * y;
}
let resultadoCostoDolar = costoDolar(valorDolar, precioDolar);

//Calculo del costo con margen de seguridad
function MargenSeguridad (z){
    return resultadoCostoDolar * z;
}
let resultadoMargenSeguridad = MargenSeguridad(PorcentajeSeguridad);

//Calculo del valor de venta neto (s/IVA)
function VentaHoy(w){
    return resultadoMargenSeguridad * w;
}
let VentaNeta = (VentaHoy(delta)).toFixed(2);

console.log("Costo con " + valorDolar + " U$D (BNA) es de: $ " + resultadoCostoDolar);
console.log("Costo con el U$D de hoy + %3 es: $ " + resultadoMargenSeguridad);
console.log("Valor neto de venta con U$D hoy es de: $ " + VentaNeta);

                                    //CONTROL DE LISTA

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

