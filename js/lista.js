// Variable toma al formulario
const form = document.getElementById("FormIngresos");
//Variables para obtener datos del formulario
let ProductFormData;
let newProductRowRef;
let newProductRowCell;
//Variables Objeto ProducData
let ProductObj;
let ProductName;
let ProductPresentation;
let ProductCost;
let ProductUtility;

//FUNCIONAMIENTO - FLOW
form.addEventListener("submit", function(event) {
    //cancelo el envio al servidor
    event.preventDefault();
    //Construir objeto FormData 
    ProductFormData = new FormData(form); 
    //convertir datos a objeto
    ProductObj = convertProductFormDataToProductObj(ProductFormData); 
    //insertar datos a la tabla
    insertRowInTable(ProductObj);
    //guardar en localStorage
    saveProductObj(ProductObj); 
});
//Cargar lo guardado en el localStorage
    document.addEventListener('DOMContentLoaded', (event) => { 
        //trigo la informacion del sessionStorage, la transformo a objeto y la guardo en productObjArr
        let productObjArr = JSON.parse(localStorage.getItem("Producto")) 
        
        //Recorro los elementos del Array y le aplico una funcion
        productObjArr.forEach(
            //la funcion guarda los elementos del array en "arrayElement" y los inserta en la tabla
            function(arrayElement){
                insertRowInTable(arrayElement)
            }
        )
    }); 


                                //FUNCTIONS
//funciones de Calculo
function VentaNeta (x,y){
    return x*((y/100)+1);  //costo por utilidad (utilidad - transformar 50 en 1.5)
}
function Iva(x){
    return x*1.21;
}
//Funcion para convertir datos a objeto
function convertProductFormDataToProductObj (ProductFormData){
    //almaceno los valores obtenidos del formulario en variables
    ProductPresentation = ProductFormData.get("ProductPresentation");

    ProductName = ProductFormData.get("ProductName");

    ProductCost = ProductFormData.get("ProductCost");
    
    ProductUtility = ProductFormData.get("ProductUtility");
    
    //aplico funciones para los datos que me faltan
    ProductNetSale = VentaNeta(ProductFormData.get("ProductCost"),ProductFormData.get("ProductUtility"));
    ProductFinalSale = Iva(ProductNetSale);
    
    return{ //retorno un OBJETO
        "ProductName": ProductName,
        "ProductCost": ProductCost,
        "ProductPresentation" : ProductPresentation,
        "ProductUtility" : ProductUtility,
        "ProductNetSale" : ProductNetSale,
        "ProductFinalSale" : ProductFinalSale,
    }
}
//Funcion para añadir Celdas a la tabla
function insertRowInTable(ProductObj){ 

    let tableListRef = document.getElementById("tableList"); 
    // -1 inserta al final - Creo un tr
    let newProductRowRef = tableListRef.insertRow(-1); 

    // Creo un td en la posicion [i], de la última fila
    let newProductRowCell = newProductRowRef.insertCell(0); 
    newProductRowCell.textContent = "x"

    newProductRowCell = newProductRowRef.insertCell(1);
    newProductRowCell.textContent = ProductObj["ProductName"];
    
    newProductRowCell = newProductRowRef.insertCell(2);
    newProductRowCell.textContent = ProductObj["ProductPresentation"];

    newProductRowCell = newProductRowRef.insertCell(3);
    newProductRowCell.textContent = ProductObj["ProductCost"];

    newProductRowCell = newProductRowRef.insertCell(4);
    newProductRowCell.textContent = ProductObj["ProductUtility"];

    newProductRowCell = newProductRowRef.insertCell(5);
    newProductRowCell.textContent = ProductObj["ProductNetSale"];

    newProductRowCell = newProductRowRef.insertCell(6);
    newProductRowCell.textContent = ProductObj["ProductFinalSale"];
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

