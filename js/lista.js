//Importar Variables 
import {formLista, FechaLocal, HoraLocal, spanTitle, spanCoin, selectOptionG, ProductsGenerico, selectOptionP} from './variables.js';
/*import {costMenMay, finalSaleMenMay, OrdenAlf} from './variables.js';*/
                            //EVENTOS

                        //Cargar lo guardado en el sessionStorage
document.addEventListener('DOMContentLoaded', () => { 
    NombresOpciones();
    let nombreProveedorOption = selectOptionG.value;
    console.log(nombreProveedorOption)
    cargarDatosSession(nombreProveedorOption , "PESOS")
    spanCoin.innerHTML = "PESOS"
}); 
                        //Agregal elementos a la Lista
formLista.addEventListener("submit", function(event) {
    let nombreReferencia = selectOptionG.value
    //cancelo el envio al servidor
    event.preventDefault();
    //Construir objeto FormData 
    let ProductFormData = new FormData(formLista); 

    //Saber con que moneda trabajo
    let moneda = spanCoin.outerText;

    //convertir datos a objeto
    let ProductObj = DateToObject(ProductFormData, moneda);
    
    //Elimino la informacion pregabada si quiero trabajar con la clase generico
    if(nombreReferencia == "GENERICO"){
        ClearHTML()
        clearSession(nombreReferencia)
    }
    //insertar datos a la tabla
    insertRowInTable(ProductObj, moneda);

    //guardar en localStorage
    
    saveProductObj(ProductObj, nombreReferencia ); 
    clear();

    /*
    TENGO QUE VER COMO TRABAJAR EL LOCAL STORAGE!!!!
    ESTOY DUPLICANDO FUNCIONES
    */
});
                        //Cargar encabezado de tabla
selectOptionG.addEventListener("change", function(){
    //limpio el html para luego cargar los datos del proveedor
    //si no lo hago se van agregando items cada vez que cambio la opcion
    ClearHTML();
    
    //Obtengo el nombre seleccionado
    let NameProveedorOption = selectOptionG.value;

    //Lo inserto en la cabecera de la lista
    spanTitle.innerHTML = NameProveedorOption

    //busco dentro de la memoria los proveedores guardados
    let proveedor = JSON.parse(localStorage.getItem("Proveedores"))
    //busco el indice del proveedor seleccionado y extraigo la moneda con cual trabaja
    let index = proveedor.findIndex(element => element.ProveedorName === NameProveedorOption);
    
    //INSERTRO
    spanCoin.innerHTML = proveedor[index].ProveedorCoin;
    
    //Inserta elementos para listas con U$D y validar que no este ya cargado    
    let existe = document.getElementById("costoEnPesos") ;   
    if (existe){
        console.log("lista cargada")
    }else{     
        proveedor[index].ProveedorCoin === "DOLAR" && ElementosDolar() ;
    }
    //si cambio de una lista de dolar a pesos, debo eliminar los elementos creados anteriormente
    if (proveedor[index].ProveedorCoin === "PESOS" && existe){
        RemoveElementDolar();
    }
    
    //Cargo los datos guardados en la sessionStorage
    cargarDatosSession(NameProveedorOption, proveedor[index].ProveedorCoin)
})                          
                        //Delegacion de eventos click
document.addEventListener("click", (e)=>{ 

    //Variable Global local - Nombre del proveedor seleccionado en opciones
    let nombreProveedorOption = selectOptionG.value
    //Variables para filtros
    let moneda = spanCoin.outerText
    
    //Eliminar Filas de Tabla
    if (e.target.matches("#buttonRemoveRow")){  
        //busco el nodo tg
        let productRow =  e.target.parentNode.parentNode; //padre td -> padre th
        // busco el Id para eliminar del objeto - Gravado en el class
        let ReferenciaId = e.target.className;
        
        if (ReferenciaId === "X"){ 
            productRow.remove(); //elimino del HTML ya que cuando recargo la pagina guardo nuevamente Obj Generico
        }else{ 
            productRow.remove(); //elimino del HTML
            deleteProductObj(ReferenciaId, nombreProveedorOption); //elimino del Objeto
        }
    }
    //Guardar datos de la Tabla LocalStorage
    else if(e.target.matches(".saveIcon")){  
        saveProveedor(nombreProveedorOption);
    }
    //Limpiar Datos de la tabla
    else if(e.target.matches(".reloadIcon")){  
        ClearHTML();
        clearSession(nombreProveedorOption);
        
    }
    //FILTROS DE LA TABLA
    else if(e.target.matches("#abc")){
        ClearHTML();
        ordenarPorAbc(nombreProveedorOption, moneda);     
    }
    else if (e.target.matches("#costMenMay")){
        ClearHTML();
        OrdenarCostMenorToMayor(nombreProveedorOption, moneda);   
    }
    else if (e.target.matches("#finalSaleMenMay")){
        ClearHTML();
        OrdenarFinalSaleMenorToMayor(nombreProveedorOption, moneda);       
    }
    else if (e.target.matches("#id")){
        ClearHTML();
        ordenPorDefectoId(nombreProveedorOption, moneda)
    };      
});

                                //FUNCTIONS
//////////////////////////////////  funciones de Calculo
function VentaNeta (x,y){
    return x*((y/100)+1);  
}
function Iva(x){
    return x*1.21;
}
function DolarPesos(x,y){
    return x*y;
}
function ReccorrerObjetoParaInsertarHTML(obj,moneda){
    obj.forEach(
        //la funcion guarda los elementos del array en "arrayElement" y los inserta en la tabla
        function(arrayElement){
            insertRowInTable(arrayElement, moneda);
        }
    );
}

////////////////////////////////// MODIFICAR HTML ENCABEZADO TABLA 
//Entregar los nombres guardados a innerOption
function NombresOpciones(){

    let ProveedorArray = JSON.parse(localStorage.getItem("Proveedores"));

    //creo un array con los nombres de los proveedores guardados
    const nombres = ProveedorArray.map((el) => el.ProveedorName);
    nombres.forEach(
        //la funcion guarda los elementos del array en "arrayElement" y los inserta en la tabla
        function(arrayElement){
            innerOptionHTML(arrayElement)
        }
    );
    
}
//Agregar opciones al HTML
function innerOptionHTML (nombres){     
    let opcionesLista = document.createElement('option')
    opcionesLista.innerHTML= nombres
    
    let contenedor = document.querySelector('#ListaName')
    contenedor.appendChild(opcionesLista)
}

//////////////////////////////////  CREAR TABLA DEL FORMULARIO 

//Crear un ID para cada producto - Puedo eliminar del objeto con el id
function getNewProductId(){
    //primero va a la memoria y toma el último id guardado, si el resultado es null, undefined o string vacio -> toma -1.
    let lastProductId = localStorage.getItem("lastProductId") || "-1";
    let newProductId = JSON.parse(lastProductId) + 1 ;
    localStorage.setItem("lastProductId", JSON.stringify(newProductId));
    return newProductId;
}
//Convertir los datos del formulario a un objeto
function DateToObject (ProductFormData, moneda){
    //almaceno los valores obtenidos del formulario en variables
    
    let ProductUtility = ProductFormData.get("ProductUtility");
    let ProductId = getNewProductId();
    //aplico funciones para los datos que me faltan
    
    if (moneda === "PESOS"){ 
        let ProductCost = ProductFormData.get("ProductCost");
        let ProductNetSale = VentaNeta(ProductCost,ProductUtility).toFixed(2);
        let ProductFinalSale = Iva(ProductNetSale).toFixed(2);
        return{//retorno un OBJETO
            "ProductName": ProductFormData.get("ProductName"),
            "ProductCost": ProductCost,
            "ProductPresentation" : ProductFormData.get("ProductPresentation"),
            "ProductUtility" : ProductUtility,
            "ProductNetSale" : ProductNetSale,
            "ProductFinalSale" : ProductFinalSale,
            "ProductId" : ProductId,
        }
    }else{
        //dato particular
        let ProductCost = ProductFormData.get("ProductCost");
     
        let valorDolar =  ProductFormData.get("cotizacionDolar");
        let ProductNetSale = (VentaNeta(DolarPesos(ProductCost,valorDolar),ProductUtility)).toFixed(2);
        let ProductFinalSale = Iva(ProductNetSale).toFixed(2);
        return{//retorno un OBJETO
            "ProductName": ProductFormData.get("ProductName"),
            "CotizacionDolar" : ProductCost,
            "ProductCost": DolarPesos(ProductCost,valorDolar).toFixed(2),
            "ProductPresentation" : ProductFormData.get("ProductPresentation"),
            "ProductUtility" : ProductUtility,
            "ProductNetSale" : ProductNetSale,
            "ProductFinalSale" : ProductFinalSale,
            "ProductId" : ProductId,
        }  
    }
}
//Funcion para añadir Celdas a la tabla
function insertRowInTable(ProductObj, moneda){ 
    if (moneda === "PESOS") { 
        let tableListRef = document.getElementById("tableList"); 
        // -1 inserta al final - Creo un tr
        let newProductRowRef = tableListRef.insertRow(-1); 
        //cuando inserto una fila le agrego un atributo personalizado
        newProductRowRef.setAttribute("data-product-id", ProductObj["ProductId"]);
        newProductRowRef.setAttribute("class", "eliminar");
        // Creo un td en la posicion [i], de la última fila
        let newProductRowCell = newProductRowRef.insertCell(0); 
        newProductRowCell.textContent = ProductObj["ProductId"]; // para cuando recargue la numeracion vuelva a cero

        newProductRowCell = newProductRowRef.insertCell(1);
        newProductRowCell.textContent = ProductObj["ProductName"];
        
        newProductRowCell = newProductRowRef.insertCell(2);
        newProductRowCell.textContent = ProductObj["ProductPresentation"];

        newProductRowCell = newProductRowRef.insertCell(3);
        newProductRowCell.textContent = ProductObj["ProductCost"];

        newProductRowCell = newProductRowRef.insertCell(4);
        newProductRowCell.textContent = ProductObj["ProductUtility"] + " %";

        newProductRowCell = newProductRowRef.insertCell(5);
        newProductRowCell.textContent = ProductObj["ProductNetSale"];

        newProductRowCell = newProductRowRef.insertCell(6);
        newProductRowCell.textContent = ProductObj["ProductFinalSale"];

        crearBotonEliminar(ProductObj, newProductRowRef, 7)

    }else{
        let tableListRef = document.getElementById("tableList"); 
        // -1 inserta al final - Creo un tr
        let newProductRowRef = tableListRef.insertRow(-1); 
        //cuando inserto una fila le agrego un atributo personalizado
        newProductRowRef.setAttribute("data-product-id", ProductObj["ProductId"]);
        newProductRowRef.setAttribute("class", "eliminar");
        // Creo un td en la posicion [i], de la última fila
        let newProductRowCell = newProductRowRef.insertCell(0); 
        newProductRowCell.textContent = ProductObj["ProductId"]; // para cuando recargue la numeracion vuelva a cero

        newProductRowCell = newProductRowRef.insertCell(1);
        newProductRowCell.textContent = ProductObj["ProductName"];
        
        newProductRowCell = newProductRowRef.insertCell(2);
        newProductRowCell.textContent = ProductObj["ProductPresentation"];

        newProductRowCell = newProductRowRef.insertCell(3);
        newProductRowCell.textContent = ProductObj["CotizacionDolar"];    

        newProductRowCell = newProductRowRef.insertCell(4);
        newProductRowCell.textContent = ProductObj["ProductCost"];

        newProductRowCell = newProductRowRef.insertCell(5);
        newProductRowCell.textContent = ProductObj["ProductUtility"] + " %";

        newProductRowCell = newProductRowRef.insertCell(6);
        newProductRowCell.textContent = ProductObj["ProductNetSale"];

        newProductRowCell = newProductRowRef.insertCell(7);
        newProductRowCell.textContent = ProductObj["ProductFinalSale"];

        crearBotonEliminar(ProductObj, newProductRowRef, 8)
       
    }
}
//Botton eliminar Fila
function crearBotonEliminar(ProductObj, newProductRowRef, numeroCelda){
    //Creo un botton
    let deleteButton = document.createElement("button")
    //inserto
    let newDeleteButton = newProductRowRef.insertCell(numeroCelda);  //creo la celda para contener al button
    //creo un boton 
    deleteButton.setAttribute("id","buttonRemoveRow")
    deleteButton.setAttribute("class",ProductObj["ProductId"] )
    deleteButton.textContent = "ELIMINAR";   //inserto un texto
    newDeleteButton.appendChild(deleteButton); //le digo al programa que es hijo de newDelteButton

}


//////////////////////////////////  MODIFICAR TABLA  

//Agregar elementos cuando trabajo con costo en Dolares
function ElementosDolar(){

    //AGREGAR COLUMNA A LA TABLA - COSTO U$D
    //creo un th
    var CostoEnPesos = document.createElement("th")
    CostoEnPesos.innerHTML = "Costo U$D"
    CostoEnPesos.setAttribute("id", "costoEnPesos")
    //lo ubico dentro de mi tabla
    let NodoDerecha = document.getElementById("cost")
    let nodoPadre = NodoDerecha.parentNode;
    nodoPadre.insertBefore(CostoEnPesos, NodoDerecha);

    //AGREGAR OTRO INPUT AL FORMULARIO - COTIZACION DOLAR
    //Creo el div contenedor
    let divCotizacion = document.createElement("div")
    divCotizacion.setAttribute("class", "FormElement")
    //Genero el label del input
    var CotizacionDolarLabel = document.createElement("label")
    CotizacionDolarLabel.innerHTML = "Cotizacion Dolar"
    CotizacionDolarLabel.setAttribute("class", "block")
    CotizacionDolarLabel.setAttribute("for", "cotizacionDolar")
    //Genero el input
    var inputCotizacion = document.createElement("input")
    inputCotizacion.setAttribute("name", "cotizacionDolar")
    inputCotizacion.setAttribute("id", "cotizacionDolar")

    divCotizacion.appendChild(CotizacionDolarLabel)
    divCotizacion.appendChild(inputCotizacion)
    
    //Ubico dentro de mi tabla
    let divDerecha = document.getElementById("divBefore")
    let Padrediv = divDerecha.parentNode
    Padrediv.insertBefore(divCotizacion,divDerecha)
}
//Eliminar Elementos para el Dolar
function RemoveElementDolar(){
    let CostoEnPesos = document.getElementById("costoEnPesos")
    CostoEnPesos.remove();

    let RefdivCotizacion = document.getElementById("cotizacionDolar")
    RefdivCotizacion.parentNode.remove();
}
// Limpiar campos del formulario.
function clear(){
    document.getElementById("ProductName").value = "";
    document.getElementById("ProductPresentation").value = "";
    document.getElementById("ProductCost").value = "";
    //document.getElementById("ProductUtility").value = " ";
    document.getElementById("ProductDescription").value = "";
}
//Eliminar Filas de la tabla - Session
function deleteProductObj (ProductId, nombreProveedor){
    //cargo los datos del localStore y genero un objeto
    let productObjArr = JSON.parse(sessionStorage.getItem(nombreProveedor + " Volatil"));
   
    //busco el indice/posicion del producto que quiero eliminar
    let ProductIndexInArry = productObjArr.findIndex(element => element.ProductId === ProductId);
   
    //elimino el elemento de la posicion
    productObjArr.splice(ProductIndexInArry, 1);
   
    //Guardo nuevamente mi objeto sin el elemento
    let productArrayJSON = JSON.stringify(productObjArr); 
   
    //guardo en el localStorage
    sessionStorage.setItem(nombreProveedor + " Volatil", productArrayJSON);
}
//Limpiar Lista del HTML
function ClearHTML(){  
    let number = document.querySelectorAll(".eliminar").length || "0";
    console.log(number)
    //si es igual a cero es porque no tengo nada cargado en la pantalla y NO debo ejecutar el código
    if (number != 0){ 
        for (let i = 0; i <number ; i++){document.querySelector(".eliminar").remove()}
    }
}

////////////////////////////////// ALMACENAMIENTO 

// Funcion Almacenamiento en el sessionStorage -  Trabajar sin perder datos
function saveProductObj (ProductObj, nombre){   
    /*Funcionamiento: Mi programa lee lo que se encuentra almcaenado en el localStorage y el añade un nuevo objeto, en el caso de que el usuario vaya iterando en el formulario */  
    
    //si mi sessionStorage está vacio --> que guarde un array vacio (evito guardar "null" y que se rompa el codigo)
    let productArray = JSON.parse(sessionStorage.getItem(nombre + " Volatil")) || [];
    //ingreso los nuevos objetos al array
    productArray.push(ProductObj);
    // Paso my array a JSON para poder almacenarlo
    let productArrayJSON = JSON.stringify(productArray); //transformo el objeto a string
    // guardo en el localStorage
    sessionStorage.setItem(nombre + " Volatil", productArrayJSON);
    
}
// Guardar Proveedor localStorage
function saveProveedor(nombre){
    let proveedorArray = JSON.parse(sessionStorage.getItem(nombre + " Volatil"))
    //cuando selecciono otro proveedor se debe refrescar la pagina debo solucionarlo
    let ProductFormData = new FormData(formLista); 
    let nombreProveedor = ProductFormData.get("ListaName")

    let ProveedorArrayRef = JSON.parse(localStorage.getItem("Proveedores")) || [];
    //recorro el array guardado en la memoria para encontrar coincidencia
    let ProveedorIndex = ProveedorArrayRef.findIndex(function (ProveedorArrayRef){return ProveedorArrayRef.ProveedorName === nombreProveedor;
        // Si coincide me retoran un número >=0;
        // Si NO coincide me retorna -1;
    });

     //Proceso para poder guardar los datos globales del proveedor
    if(ProveedorIndex < 0){ 
        //Guardar solo la lista con el nombre "generica"
        let llaveProveedor = nombreProveedor; //extraigo 
        let proveedorArrayJSON = JSON.stringify(proveedorArray); //transformo el objeto a string
        // guardo en el localStorage
        localStorage.setItem(llaveProveedor, proveedorArrayJSON);
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'LISTA GENERICA GUARDADA',
            showConfirmButton: false,
            timer: 1500
        })
    }else{//Sobreescribir informacion  
        
        //Extraigo del Array los datos del proveedor
        let extraccion = ProveedorArrayRef.slice(ProveedorIndex,1,ProveedorArrayRef);
        //Genero un objeto Global
        const Global = {
            DatosProveedor : {...extraccion,},
            FechaLista : {
                dia : FechaLocal,
                hora : HoraLocal, 
                Productos : {
                    ...proveedorArray,
                },
            }
        }
        //guardo en el local Storage
        let globalJSON = JSON.stringify(Global);
        localStorage.setItem(nombreProveedor + " Global", globalJSON);
        localStorage.removeItem(nombreProveedor);
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'LISTA ' + nombreProveedor + ' GUARDADA',
            showConfirmButton: false,
            timer: 1500
        })
    } 
}
//Cargar datos de la sessionStorage
function cargarDatosSession(nombreLista, moneda){

    //trigo la informacion del sessionStorage, la transformo a objeto y la guardo en productObjArr
    let productObjArr = JSON.parse(sessionStorage.getItem( nombreLista + " Volatil")) || []; // para evitar error

    //Cargar cuando no tengo nada en Generico 
    if(productObjArr-length == 0 && nombreLista == "GENERICO"){
        ReccorrerObjetoParaInsertarHTML(ProductsGenerico, moneda)
    }

    //Insertar en tabla HTML
    ReccorrerObjetoParaInsertarHTML(productObjArr,moneda) 
}
//Limpiar la lista Volatil del Proveedor
function clearSession(nombre){
    sessionStorage.removeItem(nombre + " Volatil");
}

//////////////////////////////////  FILTROS 
function OrdenarCostMenorToMayor(nombreLista, moneda){

    let productObjArr = JSON.parse(sessionStorage.getItem( nombreLista + " Volatil"))
    
    function sortMenorToMayor(x,y){
        
        if (parseInt(x.ProductCost) < parseInt(y.ProductCost) ){ return -1;}
        if ( parseInt(x.ProductCost) > parseInt(y.ProductCost)){ return 1;}
        return 0;
    };
    
    let ArrayMenorToMayor = productObjArr.sort(sortMenorToMayor);

    ReccorrerObjetoParaInsertarHTML(ArrayMenorToMayor,moneda)
}
function OrdenarFinalSaleMenorToMayor(nombreLista, moneda){

    let productObjArr = JSON.parse(sessionStorage.getItem( nombreLista + " Volatil"))
    function sortMenorToMayor(x,y){
        if ( parseInt(x.ProductFinalSale) < parseInt(y.ProductFinalSale) ){ return -1;}
        if ( parseInt(x.ProductFinalSale) > parseInt(y.ProductFinalSale)){ return 1;}
        return 0;
    };
    let ArrayMenorToMayor = productObjArr.sort(sortMenorToMayor);
    
    ReccorrerObjetoParaInsertarHTML(ArrayMenorToMayor,moneda)
   
}
function ordenPorDefectoId(nombreLista, moneda){
    ClearHTML()
    
    let productObjArr = JSON.parse(sessionStorage.getItem( nombreLista + " Volatil"))

    function sortMenorToMayor(x,y){
        if ( parseInt(x.ProductId) < parseInt(y.ProductId) ){ return -1;}
        if ( parseInt(x.ProductId) > parseInt(y.ProductId)){ return 1;}
        return 0;
    };

    let ArrayMenorToMayor = productObjArr.sort(sortMenorToMayor);
    
    ReccorrerObjetoParaInsertarHTML(ArrayMenorToMayor,moneda)
}
function ordenarPorAbc(nombreLista, moneda){
    let productObjArr = JSON.parse(sessionStorage.getItem( nombreLista + " Volatil"))
    function abc(x,y){
        if (x.ProductName < y.ProductName ){ return -1;}
        if (x.ProductName > y.ProductName){ return 1;}
        return 0;
    };
    let ArrayAlfabetico = productObjArr.sort(abc);
    console.log(ArrayAlfabetico)
    ReccorrerObjetoParaInsertarHTML(ArrayAlfabetico,moneda)
}


/*function buscarInfoProductos(NameProveedor){
    
    //aplicar promesas para resolverlo
    let proveedor = JSON.parse(localStorage.getItem(NameProveedor + " Global")) 

    console.log(proveedor)

    let coin = proveedor.DatosProveedor[0].ProveedorCoin;
    spanCoin.innerHTML = coin;

    let tableListRef = document.getElementById("tableList"); 
    // -1 inserta al final - Creo un tr

    for(let i = 0; i < Object.keys(proveedor.FechaLista.Productos).length; i++) { 
        
        let newProductRowRef = tableListRef.insertRow(-1); 
        //cuando inserto una fila le agrego un atributo personalizado
        newProductRowRef.setAttribute("data-product-id", proveedor.FechaLista.Productos[i].ProductId)
        // Creo un td en la posicion [i], de la última fila
        let newProductRowCell = newProductRowRef.insertCell(0); 
        newProductRowCell.textContent = proveedor.FechaLista.Productos[i].ProductId; // para cuando recargue la numeracion vuelva a cero

        newProductRowCell = newProductRowRef.insertCell(1);
        newProductRowCell.textContent = proveedor.FechaLista.Productos[i].ProductName;
        
        newProductRowCell = newProductRowRef.insertCell(2);
        newProductRowCell.textContent = proveedor.FechaLista.Productos[i].ProductPresentation;

        newProductRowCell = newProductRowRef.insertCell(3);
        newProductRowCell.textContent = proveedor.FechaLista.Productos[i].ProductCost;

        newProductRowCell = newProductRowRef.insertCell(4);
        newProductRowCell.textContent = proveedor.FechaLista.Productos[i].ProductUtility + " %";

        newProductRowCell = newProductRowRef.insertCell(5);
        newProductRowCell.textContent = proveedor.FechaLista.Productos[i].ProductNetSale
        
        newProductRowCell = newProductRowRef.insertCell(6);
        newProductRowCell.textContent = proveedor.FechaLista.Productos[i].ProductFinalSale

    }
     
}
*/






/*
//API
var myHeaders = new Headers();
myHeaders.append("apikey", "nHfD8mrLieBLQXPsUFvBJHD6wRT8NvEp");
var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};
fetch("https://api.apilayer.com/exchangerates_data/latest?symbols=ARS&base=USD", requestOptions)
  .then(response => response.json())
  .then(result => 
    innerCotizacionHTML(result.rates.ARS))
  .catch(error => console.log('error', error));

//insertar valor dolar
function innerCotizacionHTML(valor){
    const idContenedor = "ContenedorUSD"
    
    let title = document.createElement('div')
    title.innerHTML = "USD : "
    title.setAttribute("id", idContenedor)
    let divCot = document.createElement('div')
    divCot.innerHTML=valor.toFixed(2);
    divCot.setAttribute("id", idContenedor)
    

    let contenedor = document.querySelector('.conteinerButtons')
    
    contenedor.appendChild(title);
    contenedor.appendChild(divCot);
}
*/




