//Programa destinado a la generacion y control de precios

/* 
Para corroborar el funcionamiento y que de números similares con los cargados usar:
U$D = 137
Costo U$D = 1 
*/

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


