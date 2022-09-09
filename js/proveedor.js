import {formProveedor, FechaLocal, HoraLocal, selectOptionP} from './variables.js';

/*Cuando cargue los proveedores, su nombre debe aparecer en las opciones de generar lista*/
/* Todavía tengo que armarlo, por ahora solo obtuve datos */

document.addEventListener('DOMContentLoaded', () => {    
    NombresOpciones();
});


formProveedor.addEventListener("submit", function(event){
    //cancelo el envio al servidor
    event.preventDefault();

    let ProveedorFormData = new FormData(formProveedor);
    //let NameProveedor = ProveedorFormData.get("ProveedorName");
 
    let ProveedorObj = DateToObject(ProveedorFormData);

    saveProveedorForm(ProveedorObj);

    formProveedor.reset()

});
selectOptionP.addEventListener('change', (event)=>{
    let resultado = event.target.value;
    console.log(resultado)

})
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
function getNewProveedorId(){
    //primero va a la memoria y toma el último id guardado, si el resultado es null, undefined o string vacio -> toma -1.
    let lastProveedorId = localStorage.getItem("lastProveedorId") || "-1";
    let newProveedorId = JSON.parse(lastProveedorId) + 1 ;
    localStorage.setItem("lastProveedorId", JSON.stringify(newProveedorId));
    return newProveedorId;
}
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
        "ProveedorCoin" : ProveedorFormData.get("monedaType"),
        "FechaGeneración" : FechaLocal,
        "HorarioGeneracion" : HoraLocal,
    }
}
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
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'PROVEEDOR ' + nombreReferencia + ' GUARDADO',
            showConfirmButton: false,
            timer: 1500
        })
        //ingreso los nuevos objetos al array
        ProveedorArrayRef.push(ProveedorObj);
        //Proceso para guardar
        let ProveedorArrayJSON = JSON.stringify(ProveedorArrayRef);  
        localStorage.setItem("Proveedores", ProveedorArrayJSON);
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






