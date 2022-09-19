import {formProveedor, FechaLocal, HoraLocal, selectOptionP, infoGenerica} from './variables.js';
//variables para mostrar datos guardados
import{textCosto, textCuit, textDescripcion, textDireccion, textNombre, textTransporte} from './variables.js';

/*Cuando cargue los proveedores, su nombre debe aparecer en las opciones de generar lista*/


document.addEventListener('DOMContentLoaded', () => {   
    //Cargue las opciones guardadas 
    NombresOpciones(); 
});
                    //EVENTOS
//Submit formulario
formProveedor.addEventListener("submit", function(event){
    //cancelo el envio al servidor
    event.preventDefault();

    let ProveedorFormData = new FormData(formProveedor);
 
    let ProveedorObj = DateToObject(ProveedorFormData);

    saveProveedorForm(ProveedorObj);
    
    formProveedor.reset();
    //muestre el msje y se refresque la pagina para incorporar la opcion 
    setTimeout(() => {
        location.reload()
    }, 1500);
    
});
//seleccion y carga de informacion de las opciones de proveedores guardados
selectOptionP.addEventListener('change', (event)=>{
    
    //buscar nueva informacion del proveedor
    let seleccion = event.target.value;
    buscarInfo(seleccion);
    
})

                    //FUNCIONES
//insertar opciones
function NombresOpciones(){

    let ProveedorArray = JSON.parse(localStorage.getItem("Proveedores")) || "vacio";
    if(ProveedorArray === "vacio"){
        innerOptionHTML("Generico", "-1")
    }else{
        //siempre tenga la opcion de trabajar con un proveedor generico
        innerOptionHTML("Generico", "-1")
        //creo un array con los nombres de los proveedores guardados
        const nombres = ProveedorArray.map((el) => {
            return {
                Nombre : el.ProveedorName,
                Id : el.ProveedorId,
            }
        });
        nombres.forEach(
            //la funcion guarda los elementos del array en "arrayElement" y los inserta en la tabla
            function(arrayElement){
                innerOptionHTML(arrayElement.Nombre, arrayElement.Id);
            }
        );
    }
}
//setear id
function getNewProveedorId(){
    //primero va a la memoria y toma el último id guardado, si el resultado es null, undefined o string vacio -> toma -1.
    let lastProveedorId = localStorage.getItem("lastProveedorId") || "-1";
    let newProveedorId = JSON.parse(lastProveedorId) + 1 ;
    localStorage.setItem("lastProveedorId", JSON.stringify(newProveedorId));
    return newProveedorId;
}
//convertir datos del formulario a objeto
function DateToObject (ProveedorFormData){
    let id = getNewProveedorId()
    return{//retorno un OBJETOa
        "ProveedorId" : id,
        //Nombre en mayuscula para normalizar la entrada de este dato
        "ProveedorName": ProveedorFormData.get("ProveedorName").toUpperCase(),
        "ProveedorDescription": ProveedorFormData.get("ProveedorDescription"),
        "ProveedorAdress": ProveedorFormData.get("ProveedorAdress"),
        "ProveedorCUIT" : ProveedorFormData.get("ProveedorCUIT"),
        "ProveedorTransporte" : ProveedorFormData.get("ProveedorTransporte"),
        "ProveedorCoin" : ProveedorFormData.get("monedaType").toUpperCase(),
        "FechaGeneración" : FechaLocal,
        "HorarioGeneracion" : HoraLocal,
    }
}
//guardar informacion
function saveProveedorForm (ProveedorObj){   
    /*Si el proveedor existe debo sobreescribir los datos*/  
    
    //Leo el localStorage
    let ProveedorArrayRef = JSON.parse(localStorage.getItem("Proveedores")) || [];
    //busco el nombre que ingrese en el formulario
    let nombreReferencia = ProveedorObj.ProveedorName;

    //recorro el array guardado en la memoria para encontrar coincidencia
    let ProveedorIndex = ProveedorArrayRef.findIndex(function (ProveedorArrayRef){
        return ProveedorArrayRef.ProveedorName === nombreReferencia;
        // Si coincide me retoran un número >=0;
        // Si NO coincide me retorna -1;
    });

     //Condicion para agregar o sobreescribir un elemento y guardar
    if(ProveedorIndex < 0){  
        //ingreso los nuevos objetos al array
        ProveedorArrayRef.push(ProveedorObj);
        //Proceso para guardar
        let ProveedorArrayJSON = JSON.stringify(ProveedorArrayRef);  
        localStorage.setItem("Proveedores", ProveedorArrayJSON);

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'PROVEEDOR ' + nombreReferencia + ' GUARDADO',
            showConfirmButton: false,
            timer: 1500
        })
    }else{ 
        //Sobreescribo el proveedor
        //elimino el objeto del indice y le inserto el del formulario
        ProveedorArrayRef.splice(ProveedorIndex,1,ProveedorObj);
        //proceso para guardar
        let ProveedorArrayRefJSON = JSON.stringify(ProveedorArrayRef);
        localStorage.setItem("Proveedores", ProveedorArrayRefJSON);

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'DATOS DE ' + nombreReferencia + ' ACTUALIZADOS',
            showConfirmButton: false,
            timer: 1500
        })
    }

}
//modificar html
function innerOptionHTML (nombres, Id){     
    //creo el elemento <option>
    let opcionesLista = document.createElement('option')
    opcionesLista.innerHTML= nombres
    
    //seteo un atributo para tener referencia de la opcion seleccionada
    opcionesLista.setAttribute("id", Id)
    
    //inserto el elemento <option>
    let contenedor = document.querySelector('#datosGuardadosP')
    contenedor.appendChild(opcionesLista)
}
//Logica de busqueda
function buscarInfo (nombreProveedor){
    
    //buscar informacion en el local storage
    let ProveedorArray = JSON.parse(localStorage.getItem("Proveedores")) || "Generico";

    //ver si el nombre seleccionado coincide con algun objeto guardado
    let ProveedorIndex = ProveedorArray.findIndex(function (ProveedorArray){return ProveedorArray.ProveedorName === nombreProveedor;    
    });
    // Si coincide me retoran un número >=0;
    // Si NO coincide me retorna -1;
    if(ProveedorIndex < 0){ 
        //info generica
        innerProveedorInformation(infoGenerica);
        }else{//Sobreescribir informacion      
        //Extraigo del Array los datos del proveedor
        let extraccion = ProveedorArray.splice(ProveedorIndex,1,ProveedorArray);
        //Genero un objeto Global 
        innerProveedorInformation(extraccion);
    }        
}
//insertar en html
function innerProveedorInformation(objeto){
    //como extraigo informacion de mi objeto global quedan con indice 0
    textNombre.innerHTML = objeto[0].ProveedorName
    textDescripcion.innerHTML = objeto[0].ProveedorDescription
    textDireccion.innerHTML = objeto[0].ProveedorAdress
    textCuit.innerHTML = objeto[0].ProveedorCUIT  
    textTransporte.innerHTML = objeto[0].ProveedorTransporte
    textCosto.innerHTML = objeto[0].ProveedorCoin
}




