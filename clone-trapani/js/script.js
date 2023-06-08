
//LOCALSTORAGe-------------------------------------------------------
const cart = JSON.parse(localStorage.getItem("cart") || "[]");
console.log(cart);

//-------------------------------------------------------------------
const categorias = document.querySelector("#categorias");
const container_products = document.querySelector("#productos");
const data_modal = document.querySelector("[data-modal]");
const btnMiPedido = document.querySelector(".header-comer-footer")

//-------------------------------------------------------------------

//FUNCTIONS FMT------------------------------------------------------
function fmt_precio(nro) {
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

getData();
// cartCount();
// renderMiPedido();

//-------------------------------------------------------------------

async function getData() {
  // let res_gustos = await fetch("./jsons/gustos.json");
  // let data_gustos = await res_gustos.json();

  let res_categorias = await fetch("http://localhost:3001/categorias");
  let data_categorias = await res_categorias.json();
  console.log(data_categorias);

  renderCategorias(data_categorias);
  renderProductos(data_categorias);
  renderModal(data_categorias);
}

//-------------------------------------------------------------------

function renderCategorias(categ) {
  const container_categorias = categ
    .map(function (categorias) {
      const { categoria } = categorias;

      return (
        '<a href="#'+categoria+'">' +
          "<li>" +
            '<span id="'+categoria+'">' +
                categoria +
            "</span>" +
          "</li>" +
        "</a>"
      );
    })
    .join("");

  categorias.innerHTML += "<ul>" + container_categorias + "</ul>";

}

//-------------------------------------------------------------------

// function renderMiPedido(){
//   if(cart.length > 0) {
//     btnMiPedido.classList.add("visible");
//   }
// }

//-------------------------------------------------------------------

function renderProductos(product) {
  const listaProductos = product
    .map(function (item) {
      const { categoria, productos } = item;
      console.log(productos);
      return (
        "<li>" +
            "<strong>" +
                categoria +
            "</strong>" +
            "<ul>" +
                productos
                .map(function (prod) {
                    return (
                    '<a href="#" class="myBtn" data-id="'+ prod._id +'">' +
                        "<li>" +
                                "<span>" +
                                    prod.nombre +
                                "</span>" +
                                "<p> &dollar; " +
                                    fmt_precio(prod.precio) +
                                "</p>" +
                        "</li>" +
                    '</a>'
                    );
                })
                .join("") +
            "</ul>" +
        "</li>"
      );
    })
    .join("");

  container_products.innerHTML = "</ul>" + listaProductos + "</ul>";

}

//-------------------------------------------------------------------

function renderModal(categorias){
  container_products.querySelectorAll(".myBtn").forEach(function (btn) {
    
    btn.onclick = function(e){
      e.preventDefault();
      const id_prod = btn.dataset.id;

      let prod_select = categorias.map(function(cat){
        return cat.productos.find(function(prod){
          return prod._id == id_prod;
        })
      })

      prod_select = prod_select.find(x => x !== undefined) 
  
      // console.log(prod_select);

//-------------------------------------------------------------------

      if(prod_select.length <= 0) {return;}

      if(prod_select.gustos?.length <= 0) {
        delete prod_select.gustos;
      }

      let listaGustos = prod_select.gustos?.map(function(sabor) {
          const {gusto} = sabor;
          return  '<li>'+
                    '<label>'+
                      '<span class="sabor">' +gusto+ '</span>' +
                      '<input type="checkbox" name="gusto" value="'+ gusto +'" data-gusto required>' +
                    '</label>' +
                  '</li>' 

      }).join("")

      if(!prod_select.gustos) {
        listaGustos = "";
      }

      data_modal.innerHTML = "</ul>" +
                                '<div class="modal-header">'+
                                  '<div class="modal-title">' +
                                    '<strong>' + prod_select.nombre + '</strong>'+ 
                                    '<p> &dollar;' + fmt_precio(prod_select.precio) + '</p>'+
                                  '</div>' +
                                  '<div class="modal-contenido">' +
                                    '<span>Gustos</span>' +
                                    listaGustos +
                                  '</div>' +
                                  '</div>' +
                                '<div class="unidades">' +
                                  '<span>Unidades</span>' +
                                  '<input type="number" name="cantidad" value="1" data-cantidad min="1">' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                  '<a href="#" style="color: black;" data-comprar>Agregar a Mi Pedido</a>' +
                                '</div>' +
                              "</ul>";


          let target = []
          document.querySelectorAll("[data-modal]").forEach(function(dataModal){
            dataModal.addEventListener("change", function(event){
              const checked = dataModal.querySelectorAll("[data-gusto]:checked")
              
              if(prod_select.nombre == "1 Kg" && checked.length > 5){
                alert("Solo podes seleccionar hasta 5 gustos")
                checked.forEach(function(radio) {
                  radio.checked = false;
                })
                return;
              }

              if(prod_select.nombre == "1/2 Kg" && checked.length > 4){
                alert("Solo podes seleccionar hasta 4 gustos")
                checked.forEach(function(radio) {
                  radio.checked = false;
                })
                return;
              }

              if(prod_select.nombre == "1/4 Kg" && checked.length > 3){
                alert("Solo podes seleccionar hasta 3 gustos")
                checked.forEach(function(radio) {
                  radio.checked = false;
                })
                return;
              }

              console.log(checked.length, checked)
              
              target = Array.from(checked).map(x => x.value)

              if(prod_select.gustos){
                prod_select.sabores_seleccionados = target;
              }
              console.log(prod_select.sabores_seleccionados)
            })
            console.log(prod_select)

            dataModal.addEventListener("change", function(event){
              const cantidad = dataModal.querySelectorAll("[data-cantidad]")
              .forEach(function(cant) {
                prod_select.cantidad = cant.value;  
              })
            })

            dataModal.querySelectorAll("[data-comprar]").forEach(function(dataComprar){
              dataComprar.addEventListener("click", function(e){
                e.preventDefault();
                
                // const checked = dataModal.querySelectorAll("[data-gusto]:checked")
                // console.log(checked)
                // if(checked.length <= 0) {
                //   alert("Por favor seleccione gustos!");
                //   return;
                // }
                

                addProductToCart(prod_select)
                location.href = "./cart.html";
                modal.style.display = "none";
              })
            })
          })

          function addProductToCart(data){
            cart.push(data);
            localStorage.setItem("cart", JSON.stringify(cart));
            // cartCount();
            // renderMiPedido();   
          }

      modal.style.display = "block";
    }
  });

}

//-------------------------------------------------------------------

// function cartCount() {
//   const dataCount = document.querySelector("[data-cart-count]");

//   if(cart.length > 0 && dataCount){
//     dataCount.innerHTML = '(' + cart.length + ')';
//   }

// }

//-------------------------------------------------------------------