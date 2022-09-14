
//export generatiolist.html
export {formProveedor, formLista, buttonSave, clearList, FechaLocal, HoraLocal, selectOptionP, infoGenerica }

//GENERATIONLIST.HTML
const formLista = document.getElementById("FormIngresos");
const buttonSave = document.getElementById("save");
const clearList = document.getElementById("reload");

//PROVEEDOR.HTML
const formProveedor = document.getElementById("ProveedorForm");
const selectOptionP = document.querySelector(".datosGuardadosP");
const infoGenerica = `<h4> Nombre Proveedor : </h4>
<p id="textNombre"> Aministracion de Precios </p>
<h4 id="tituloDescripcion"> Descripcion : </h4>
<p id="textDescripcion"> Dedicados a brindarle una herramienta a los usuarios con el fin de facilital la administración de precios de su empresa/emprendimiento </p>
<h4 id="TituloDireccion"> Direccion : </h4>
<p id="textDireccion"> Alberdi 455, Ciudad, Mendoza</p>
<h4 id="tituloCuit"> CUIT : </h4>
<p id="textCuit"> 33-45686548-10 </p>
<h4 id="TituloTrasnporte"> Trasnporte : </h4>
<p id="textTransporte"> Web </p>
<h4 id="TituloCosto"> Moneda : </h4>
<p id="textCosto"> Gratuito </p>`;



//TIEMPO - GLOBAL
const DateTime = luxon.DateTime;
const FechaLocal = DateTime.now().toLocaleString();
const HoraLocal = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)