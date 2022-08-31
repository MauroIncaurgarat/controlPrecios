//Importar Variables 
import {formLista, buttonSave, clearList} from './variables.js';


                                //EVENTOS

                            //Cargar lo guardado en el sessionStorage
document.addEventListener('DOMContentLoaded', () => { 
    NombresOpciones();
    
    //trigo la informacion del sessionStorage, la transformo a objeto y la guardo en productObjArr
    let productObjArr = JSON.parse(sessionStorage.getItem("ListaVolatil")) || []; // para evitar error
     
    //Recorro los elementos del Array y le aplico una funcion
    productObjArr.forEach(
        //la funcion guarda los elementos del array en "arrayElement" y los inserta en la tabla
        function(arrayElement){
            insertRowInTable(arrayElement);
        }
    );
    
}); 
                            //leer datos del formulario
formLista.addEventListener("submit", function(event) {
    //cancelo el envio al servidor
    event.preventDefault();
    //Construir objeto FormData 
    let ProductFormData = new FormData(formLista); 
    //convertir datos a objeto
    let ProductObj = DateToObject(ProductFormData);
    console.log(ProductObj) 
    //insertar datos a la tabla
    insertRowInTable(ProductObj);
    //guardar en localStorage
    saveProductObj(ProductObj); 
    
    formLista.reset();
});
                            //Guardar Lista
buttonSave.addEventListener("click", saveProveedor);  
                            //resetear local storage y la tabla
clearList.addEventListener("click", reload);

                                //FUNCTIONS
//funciones de Calculo
function VentaNeta (x,y){
    return x*((y/100)+1);  
}
function Iva(x){
    return x*1.21;
}
//Crear un ID para cada producto - Puedo eliminar del objeto con el id
function getNewProductId(){
    //primero va a la memoria y toma el último id guardado, si el resultado es null, undefined o string vacio -> toma -1.
    let lastProductId = localStorage.getItem("lastProductId") || "-1";
    let newProductId = JSON.parse(lastProductId) + 1 ;
    localStorage.setItem("lastProductId", JSON.stringify(newProductId));
    return newProductId;
}
//Funcion para convertir datos a objeto
function DateToObject (ProductFormData){
    //almaceno los valores obtenidos del formulario en variables
    let ProductCost = ProductFormData.get("ProductCost");
    let ProductUtility = ProductFormData.get("ProductUtility");

    //aplico funciones para los datos que me faltan
    let ProductId = getNewProductId();
    let ProductNetSale = VentaNeta(ProductCost,ProductUtility).toFixed(4);
    let ProductFinalSale = Iva(ProductNetSale).toFixed(4);
    return{//retorno un OBJETO
        "ProductName": ProductFormData.get("ProductName"),
        "ProductCost": ProductCost,
        "ProductPresentation" : ProductFormData.get("ProductPresentation"),
        "ProductUtility" : ProductUtility,
        "ProductNetSale" : ProductNetSale,
        "ProductFinalSale" : ProductFinalSale,
        "ProductId" : ProductId,
    }
}
//Funcion para añadir Celdas a la tabla
function insertRowInTable(ProductObj){ 
    let num = 1;
    let tableListRef = document.getElementById("tableList"); 
    // -1 inserta al final - Creo un tr
    let newProductRowRef = tableListRef.insertRow(-1); 
    //cuando inserto una fila le agrego un atributo personalizado
    newProductRowRef.setAttribute("data-product-id", ProductObj["ProductId"]);
    // Creo un td en la posicion [i], de la última fila
    let newProductRowCell = newProductRowRef.insertCell(0); 
    newProductRowCell.textContent = num++; // para cuando recargue la numeracion vuelva a cero

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

    //Button Delette
    let newDeleteButton = newProductRowRef.insertCell(7);  //creo la celda para contener al button
    let deleteButton = document.createElement("button"); //creo un boton 
    deleteButton.textContent = "ELIMINAR";   //inserto un texto
    newDeleteButton.appendChild(deleteButton); //le digo al programa que es hijo de newDelteButton

    //escucho el evento de clickear eliminar
    deleteButton.addEventListener("click", (event) => {  
        
        let productRow =  event.target.parentNode.parentNode; //padre td -> padre th
        let productId = productRow.getAttribute("data-product-id");
        productRow.remove(); //elimino del HTML
        deleteProductObj(productId); //elimino del Objeto
        location.reload(); //recargo para que la numeracion vuelva a 1.
    
    });
}
//Funcion borrar datos de la tabla
function deleteProductObj (ProductId){
    //cargo los datos del localStore y genero un objeto
    let productObjArr = JSON.parse(sessionStorage.getItem("Producto"));
    //busco el indice/posicion del producto que quiero eliminar
    let ProductIndexInArry = productObjArr.findIndex(element => element.ProductId === ProductId);
    //elimino el elemento de la posicion
    productObjArr.splice(ProductIndexInArry, 1);
    //Guardo nuevamente mi objeto sin el elemento
    let productArrayJSON = JSON.stringify(productObjArr); 
    //guardo en el localStorage
    sessionStorage.setItem("Producto", productArrayJSON);
}
// Funcion Almacenamiento en el sessionStorage
function saveProductObj (ProductObj){   
    /*Funcionamiento: Mi programa lee lo que se encuentra almcaenado en el localStorage y el añade un nuevo objeto, en el caso de que el usuario vaya iterando en el formulario */  
    
    //si mi sessionStorage está vacio --> que guarde un array vacio (evito guardar "null" y que se rompa el codigo)
    let productArray = JSON.parse(sessionStorage.getItem("ListaVolatil")) || [];
    //ingreso los nuevos objetos al array
    productArray.push(ProductObj);
    // Paso my array a JSON para poder almacenarlo
    let productArrayJSON = JSON.stringify(productArray); //transformo el objeto a string
    // guardo en el localStorage
    sessionStorage.setItem("ListaVolatil", productArrayJSON);
    
    /* En el futuro quier que:
    - La llave del array sea el nombre del proveedor
    - Crear una opcion de guardar, para almacenar proveedores distintos
    */
}
// Guardar Proveedor localStorage
function saveProveedor(){
    let proveedorArray = JSON.parse(sessionStorage.getItem("ListaVolatil"))
    //cuando selecciono otro proveedor se debe refrescar la pagina
    let ProductFormData = new FormData(formLista); 
    let nombreProveedor = ProductFormData.get("ListaName")

    let llaveProveedor = nombreProveedor; //extraigo 
    let proveedorArrayJSON = JSON.stringify(proveedorArray); //transformo el objeto a string
    // guardo en el localStorage
    localStorage.setItem(llaveProveedor, proveedorArrayJSON);
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Lista Guardada',
        showConfirmButton: false,
        timer: 1500
    })
}
//limpiar sessionStorage Lista  
function reload(clear){
    sessionStorage.removeItem("ListaVolatil");
    location.reload();
}
//Agregar opciones al HTML
function innerOptionHTML (nombres){     
    let opciones = document.createElement('option')
    opciones.innerHTML= nombres

    let contenedor = document.querySelector('#ListaName')
    contenedor.appendChild(opciones)
}
//Entregar los nombres guardados a innerOption
function NombresOpciones(){

    let ProveedorArray = JSON.parse(localStorage.getItem("Proveedores")) || "vacio";

    if(ProveedorArray === "vacio"){
        innerOptionHTML("Generico")
    }else{
        //siempre tenga la opcion de trabajar con un proveedor generico
        innerOptionHTML("Generico")
        //creo un array con los nombres de los proveedores guardados
        const nombres = ProveedorArray.map((el) => el.ProveedorName);
        nombres.forEach(
            //la funcion guarda los elementos del array en "arrayElement" y los inserta en la tabla
            function(arrayElement){
                innerOptionHTML(arrayElement)
            }
        );
    }
}

