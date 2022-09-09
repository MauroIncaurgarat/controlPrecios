
//export generatiolist.html
export {formProveedor, formLista, buttonSave, clearList, FechaLocal, HoraLocal, selectOptionP }

//GENERATIONLIST.HTML
const formLista = document.getElementById("FormIngresos");
const buttonSave = document.getElementById("save");
const clearList = document.getElementById("reload");

//PROVEEDOR.HTML
const formProveedor = document.getElementById("ProveedorForm");
const selectOptionP = document.querySelector(".datosGuardadosP");

//TIEMPO - GLOBAL
const DateTime = luxon.DateTime;
const FechaLocal = DateTime.now().toLocaleString();
const HoraLocal = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)