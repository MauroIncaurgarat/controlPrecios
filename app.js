//Eliminar funcionamiento por defecto del formulario

const form = document.getElementById("FormIngresos");
let ProductFormData;
let tableListRef;
let newProductRowRef;
let newProductRowCell;

//Agrega elementos del formulario a la tabla 
form.addEventListener("submit", function(event) {
    event.preventDefault(); //cancelo el envio al servidor pero sigo tomando datos
    ProductFormData = new FormData(form);
    tableListRef = document.getElementById("tableList"); //Referencia de la tabla
    newProductRowRef = tableListRef.insertRow(-1); // -1 inserta al final Creo tr

    newProductRowCell = newProductRowRef.insertCell(0);
    newProductRowCell.textContent = "x"

    newProductRowCell = newProductRowRef.insertCell(1);
    newProductRowCell.textContent = ProductFormData.get("ProductName")
    
    newProductRowCell = newProductRowRef.insertCell(2);
    newProductRowCell.textContent = ProductFormData.get("ProductPresentation")
    
    newProductRowCell = newProductRowRef.insertCell(3);
    newProductRowCell.textContent = ProductFormData.get("ProductCost")

    newProductRowCell = newProductRowRef.insertCell(4);
    newProductRowCell.textContent = ProductFormData.get("ProductUtility")

    newProductRowCell = newProductRowRef.insertCell(5);
    newProductRowCell.textContent = "function return"

    newProductRowCell = newProductRowRef.insertCell(6);
    newProductRowCell.textContent = "fuction return"

}); //Escuche el evento submit


