//LOCALSTORAGE-------------------------------------------------------
const cart = JSON.parse(localStorage.getItem("cart") || "[]"); 


//ELEMENTS-----------------------------------------------------------
const container_section_cart = document.querySelector("#cart")
const sectionCart = document.querySelector(".container_cart")
const formulario = document.querySelector("#form")
const form_nombre = document.querySelector("#nombre")
const form_email = document.querySelector("#email")
const form_tel = document.querySelector("#telefono")
const form_direc = document.querySelector("#direccion")
const form_submit = document.querySelector("#submit")

//FMT FUNCTIONS------------------------------------------------------
function fmt_price(nro) {
    if (isNaN(nro) || Number(nro) === 0) {
      return "--";
    }
  
    var p = Number(nro)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
        .split("."),
      d = p.pop();
  
    return p.join("."); // + ',' + d;
  }

//-------------------------------------------------------------------

// function getCartFromLS() {
//   const cart = parseFloat(localStorage.getItem("cart"));
//   console.log({ time: new Date().toLocaleTimeString(), cart });

//   return cart;
// }

// // return id to cancel
// const intervalID = setInterval(getCartFromLS, 3000);

//-------------------------------------------------------------------

renderProductsDetails()

//-------------------------------------------------------------------
function renderProductsDetails() {
    const products = cart;
  
    if (!products) {
      return;
    }
  console.log(products);
    const tabla = products
      .map((product) => {

        if(!product.cantidad) {
          product.cantidad || (product.cantidad = "1")
        }

        if(product.cantidad.length > 0) {
          product.precio = (product.cantidad * product.precio)
        }

        const price_fmt = fmt_price(product.precio);
        
        console.log(product)

        let lista_gustos = product.sabores_seleccionados?.map(function(sabor) {
    
          return  '<ul>' +
                      '<li>'+
                          '<span>' + sabor + '</span>' +
                      '</li>'
                  '</ul>' 
        }).join("")

        if(!product.gustos){
          lista_gustos = "";
        }

        if(!product.sabores_seleccionados){
          lista_gustos = "";
        }
  
        return (
            '<li class="cart-items">'+
                '<div class="cart-item-card">' +
                    '<div class="cart-item-card-header">' +
                        '<span>' + '<span>' + product.cantidad + 'x</span> '+ product.nombre + '</span>' +
                    '</div>' +
                    lista_gustos +
                    '<div class="cart-item-card-footer">' +
                        '<strong> &dollar; ' + price_fmt + '</strong>' +
                    '</div>' +
                    '<div>' +
                        '<a href="#" data-borrar="'+ product._id +'">Borrar</a>' +
                    '</div>' +
                '</div>' +
            '</li>' 
        );
      })
      .join(""); 
    sectionCart.innerHTML +=  "<ul>" + 
                                tabla +
                              "</ul>";

    let total = 0;

    cart.forEach((product) => {
      total += product.precio;
    });

    const total_round = Math.round(total * 1000) / 1000,
          total_fmt = fmt_price(total_round);
    
    document.querySelector('#total').innerHTML += "Total: &dollar; " + total_fmt;

    sectionCart.querySelectorAll("[data-borrar]")
               .forEach(function (btn) {
                const delete_id = btn.dataset.borrar;
                console.log(delete_id);
                btn.addEventListener("click", function (evt) {
                  evt.preventDefault();
                  const index_cart = cart.findIndex(item => {
                    return item._id == delete_id;
                  });
                  console.log(index_cart);
                  if(index_cart >= 0) {
                    cart.splice(index_cart, 1);
                  }
                  localStorage.setItem("cart", JSON.stringify(cart));
                  location.reload();
                })
               })

}

//CLEAR-ALL CART-------------------------------------------------------------------

const btnClear = container_section_cart.querySelector("[data-clear]")

clearLS()

function clearLS(){
  if(cart.length <= 0){
    btnClear.classList.add("disabled");
  }
  btnClear.addEventListener("click", function(evt){
    evt.preventDefault();
    btnClear.classList.remove("disabled")
    localStorage.clear();
    sectionCart.innerHTML = "<span style='color: white;'>No hay productos en el carrito</span>";
  })
}

//-------------------------------------------------------------------

function sendForm(evt){
  evt.preventDefault();

  if(cart.length <= 0) {
    alert("no hay productos en el carrito")
    return;
  }

  const formulario = {
    nombre: form_nombre.value,
    email: form_email.value,
    telefono: form_tel.value,
    direccion: form_direc.value,
    total: document.querySelector('#total').innerHTML
  }

  // Formatear el número de teléfono eliminando caracteres no numéricos
  let numero = '+542346520154';
  numero = numero.replace(/\D/g, '');

  cart.forEach((item) => {
    if(!item.sabores_seleccionados){
      item.sabores_seleccionados || (item.sabores_seleccionados = ["Producto sin gustos"]);
    }
  })

  // Construir el mensaje
  const mensaje = `Bienvenido/a a nuestra *HELADERIA* 
                  
Dirección de envío: *${formulario.direccion}*

A nombre de: *${formulario.nombre}*
Número de telefono: *${formulario.telefono}*

Detalle del pedido:
${cart.map(function(prod){

  return `
  ($ ${fmt_price(prod.precio)}) - ${prod.cantidad}x ${prod.nombre} 
  Gustos: 
  ${prod.sabores_seleccionados.map(function(gusto) {
      return ` - ${gusto}`

  }).join("")} 
`
}).join("")}

*${formulario.total}*`

  // Construir la URL de WhatsApp con el número y el mensaje
  let url = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje);

  formulario.nombre = ""
  formulario.email = ""
  formulario.telefono = ""
  // Abrir la URL en una nueva ventana o pestaña
  return window.open(url);
}

//-------------------------------------------------------------------

formulario.addEventListener("submit", sendForm)

//-------------------------------------------------------------------