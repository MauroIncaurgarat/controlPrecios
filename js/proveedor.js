const formProveedor = document.getElementById("ProveedorForm");
/*Cuando cargue los proveedores, su nombre debe aparecer en las opciones de generar lista*/


formProveedor.addEventListener("submit", function(event){
    //cancelo el envio al servidor
    event.preventDefault();

    let ProveedorFormData = new FormData(formProveedor)
    console.log(ProveedorFormData)
    
    let ProveedorObj = DateToObject(ProveedorFormData);
    console.log(ProveedorObj)
});
function DateToObject (ProveedorFormData){
    return{//retorno un OBJETO
        "ProveedorName": ProveedorFormData.get("ProveedorName"),
        "ProveedorDescription": ProveedorFormData.get("ProveedorDescription"),
        "ProveedorAdress": ProveedorFormData.get("ProveedorAdress"),
        "ProveedorCUIT" : ProveedorFormData.get("ProveedorCUIT"),
        "ProveedorTransporte" : ProveedorFormData.get("ProveedorTransporte"),
        "ProveedorCoin" : ProveedorFormData.get("monedaType"),
    }
}
