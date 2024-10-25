// Cargar productos de la API
let products = []; // Cambiado para almacenar productos globalmente

fetch('https://fakestoreapi.com/products')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error de red al cargar productos');
    }
    return response.json();
  })
  .then(data => {
    products = data; // Asignar productos a la variable global
    displayProducts(products);
    populateFilter(products); // Llenar el filtro después de cargar los productos
  })
  .catch(error => {
    console.error('Hubo un problema con la operación de fetch:', error);
    alert('Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.');
  });

// Función para mostrar los productos
function displayProducts(productsToDisplay) {
  const productContainer = document.getElementById('productRow');
  productContainer.innerHTML = ''; // Limpiar el contenedor antes de mostrar los productos

  productsToDisplay.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'mb-4', 'product-card'); // Utiliza col-md-4 para 3 cards por fila
    card.innerHTML = `
      <div class="card h-100 d-flex flex-column"> <!-- 'h-100' y 'd-flex flex-column' para igualar alturas -->
        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column justify-content-between"> <!-- 'justify-content-between' para espaciado -->
          <h5 class="card-title text-center">${product.title}</h5> <!-- 'text-center' para centrar el texto -->
          <p class="card-text text-center">Precio: $${product.price.toFixed(2)}</p> <!-- 'text-center' para centrar el precio -->
          <div class="mt-auto"> <!-- Mueve los botones al final -->
            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Agregar al carrito</button>
            <button class="btn btn-secondary view-details" data-product-id="${product.id}">Ver detalles</button>
          </div>
        </div>
      </div>
    `;
    productContainer.appendChild(card); // Agregar cada card al contenedor
  });
}

// Delegación de eventos para los botones
const productContainer = document.getElementById('productRow');
productContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('add-to-cart')) {
    const productId = event.target.dataset.productId;
    const product = products.find(p => p.id == productId);
    addToCart(product);
  } else if (event.target.classList.contains('view-details')) {
    const productId = event.target.dataset.productId;
    const product = products.find(p => p.id == productId);
    showProductDetails(product);
  }
});

// Carrito de compras (usando localStorage para persistencia)
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCountElement = document.getElementById('cartCount');

function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  cartCountElement.textContent = cart.length;
}

// Filtrar productos
const productFilter = document.getElementById('productFilter');
productFilter.addEventListener('change', () => {
  const selectedFilter = productFilter.value;
  if (selectedFilter === 'all') {
    displayProducts(products); // Mostrar todos los productos
  } else {
    // Filtra el producto seleccionado
    const filteredProduct = products.filter(product => product.id == selectedFilter);
    displayProducts(filteredProduct); // Mostrar solo el producto filtrado
  }
});

// Función para llenar el filtro
function populateFilter(products) {
  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.title;
    productFilter.appendChild(option);
  });
}

// Función para filtrar productos por búsqueda
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
});
