let cart = [];

// Function to add product to cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    updateCartCount();
    saveCart();
}

// Function to update cart count in the navbar
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, product) => total + product.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
    renderCart();
}

// Function to render cart items in the cart page
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = '';

    let totalPrice = 0;

    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${product.name}</h3>
                <p class="cart-item-price">$${product.price}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity('${product.name}', -1)">-</button>
                <span>${product.quantity}</span>
                <button onclick="updateQuantity('${product.name}', 1)">+</button>
            </div>
            <p>$${(product.price * product.quantity).toFixed(2)}</p>
            <button class="cart-item-remove" onclick="removeFromCart('${product.name}')">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItem);

        totalPrice += product.price * product.quantity;
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Function to update product quantity in the cart
function updateQuantity(productName, change) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productName);
        } else {
            saveCart();
            renderCart();
            updateCartCount();
        }
    }
}

// Function to remove product from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    renderCart();
    updateCartCount();
}

// Event listener for add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', event => {
        const productElement = event.target.closest('.card');
        const product = {
            name: productElement.dataset.name,
            price: parseFloat(productElement.dataset.price),
            image: productElement.querySelector('img').src
        };
        addToCart(product);
    });
});

// Load cart when the page loads
document.addEventListener('DOMContentLoaded', loadCart);
