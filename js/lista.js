//Variables 
let num = 1;
const formLista = document.getElementById("FormIngresos");
const buttonSave = document.getElementById("save");
const clearList = document.getElementById("reload");
                                //EVENTOS

                            //Cargar lo guardado en el localStorage
document.addEventListener('DOMContentLoaded', () => { 
    //trigo la informacion del sessionStorage, la transformo a objeto y la guardo en productObjArr
    let productObjArr = JSON.parse(localStorage.getItem("Producto")) || []; // para evitar error
     
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
    ProductObj = DateToObject(ProductFormData); 
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
    let ProductNetSale = VentaNeta(ProductFormData.get("ProductCost"),ProductFormData.get("ProductUtility")).toFixed(4);
    let ProductFinalSale = Iva(ProductNetSale).toFixed(4);
    
    return{//retorno un OBJETO
        "ListaName": ProductFormData.get("ListaName"),
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
    let productObjArr = JSON.parse(localStorage.getItem("Producto"));
    //busco el indice/posicion del producto que quiero eliminar
    let ProductIndexInArry = productObjArr.findIndex(element => element.ProductId === ProductId);
    //elimino el elemento de la posicion
    productObjArr.splice(ProductIndexInArry, 1);
    //Guardo nuevamente mi objeto sin el elemento
    let productArrayJSON = JSON.stringify(productObjArr); 
    //guardo en el localStorage
    localStorage.setItem("Producto", productArrayJSON);
}
// Funcion Almacenamiento en el localStorage
function saveProductObj (ProductObj){   
    /*Funcionamiento: Mi programa lee lo que se encuentra almcaenado en el localStorage y el añade un nuevo objeto, en el caso de que el usuario vaya iterando en el formulario */  
    
    //si mi localStorage está vacio --> que guarde un array vacio (evito guardar "null" y que se rompa el codigo)
    let productArray = JSON.parse(localStorage.getItem("Producto")) || [];
    //ingreso los nuevos objetos al array
    productArray.push(ProductObj);
    
    // Paso my array a JSON para poder almacenarlo
    let productArrayJSON = JSON.stringify(productArray); //transformo el objeto a string
    // guardo en el localStorage
    localStorage.setItem("Producto", productArrayJSON);
    
    /* En el futuro quier que:
    - La llave del array sea el nombre del proveedor
    - Crear una opcion de guardar, para almacenar proveedores distintos
    */
}
// Guardar Proveedor
function saveProveedor(){
    let proveedorArray = JSON.parse(localStorage.getItem("Producto"))
    let llaveProveedor = proveedorArray[0].ListaName; //extraigo 
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
//limpiar localStorage Lista  
function reload(clear){
    localStorage.removeItem("Producto");
    location.reload();
}

