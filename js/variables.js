//GLOBALES
export{FechaLocal, HoraLocal}

//GENERATIONLIST.HTML
export {formLista, buttonSave, clearList, spanTitle, spanCoin, selectOptionG, ProductsGenerico}
export {costMenMay, finalSaleMenMay}
//PROVEEDORES HTML
export{formProveedor, selectOptionP, infoGenerica,OrdenAlf}

export{textCosto, textCuit, textDescripcion, textDireccion, textNombre, textTransporte}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//GENERATIONLIST.HTML
const formLista = document.getElementById("FormIngresos");
const buttonSave = document.getElementById("save");
const clearList = document.getElementById("reload");
const spanTitle = document.getElementById("spanTitle");
const spanCoin = document.getElementById("spanCoin");
const selectOptionG = document.querySelector("#ListaName");
const costMenMay = document.getElementById("costMenMay");
const finalSaleMenMay = document.getElementById("finalSaleMenMay");
const OrdenAlf = document.getElementById("abc");
const ProductsGenerico = [{"ProductName": "Nombre del producto",
"ProductCost": "Valor de compra",
"ProductPresentation" : "Unidad de venta",
"ProductUtility" : "Margen",
"ProductNetSale" : "Venta s/impuestos",
"ProductFinalSale" : "Venta c/impuestos",
"ProductId" : "X"}];

//PROVEEDOR.HTML
const formProveedor = document.getElementById("ProveedorForm");
const selectOptionP = document.querySelector(".datosGuardadosP");
const infoGenerica ={
    ProveedorAdress: "Alberdi 455, Ciudad, Mendoza",
    ProveedorCUIT: "33-45686548-10",
    ProveedorCoin: "PESOS",
    ProveedorDescription: "Dedicados a brindarle una herramienta a los usuarios con el fin de facilitar la administración de precios de su empresa/emprendimiento",
    ProveedorName: "GENERICO",
    ProveedorTransporte:"Web"
};

let textNombre = document.getElementById('textNombre')
let textDescripcion = document.getElementById('textDescripcion')
let textDireccion = document.getElementById('textDireccion')
let textCuit = document.getElementById('textCuit')
let textTransporte = document.getElementById('textTransporte')
let textCosto = document.getElementById('textCosto')

//TIEMPO - GLOBAL
const DateTime = luxon.DateTime;
const FechaLocal = DateTime.now().toLocaleString();
const HoraLocal = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)