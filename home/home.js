
/* =============== navbar================= */
function myMenuFunction() {
    var i = document.getElementById("navMenu");
    if(i.className === "nav-menu") {
        i.className += " responsive";
    } else {
        i.className = "nav-menu";
    }
}

/* =============== slider================= */
var sliderImages = document.querySelectorAll(".slides_image");
var dots = document.querySelectorAll(".dot");
var currentIndex = 0;
var interval;

function showSlide(index) {
    sliderImages.forEach((img, i) => {
        img.style.display = i === index ? "block" : "none";
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });

    currentIndex = index;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % sliderImages.length;
    showSlide(currentIndex);
}

function currentSlide(index) {
    clearInterval(interval);
    showSlide(index);
}

function startSlider() {
    showSlide(currentIndex);
    interval = setInterval(nextSlide, 2000); 
}

/* =============== product================= */
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.cart-count');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

const addDataToHTML = () => {
    if(products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
})

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((item) => item.product_id == product_id);
    
    if (positionThisProductInCart === -1) {
        cart.push({ product_id: product_id, quantity: 1 });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }

    addCartToMemory();
    addCartToHTML();
};


const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            let product = products.find(p => p.id == item.product_id);
            if (!product) return;

            totalQuantity += item.quantity;

            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            newItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span class="quantity-value">${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newItem);
        });


        document.querySelectorAll(".plus").forEach(button => {
            button.addEventListener("click", function() {
                let productId = this.closest(".item").dataset.id;
                updateQuantity(productId, "increase");
            });
        });

        document.querySelectorAll(".minus").forEach(button => {
            button.addEventListener("click", function() {
                let productId = this.closest(".item").dataset.id;
                updateQuantity(productId, "decrease");
            });
        });
    }

    iconCartSpan.innerText = totalQuantity;
};

const updateQuantity = (product_id, action) => {
    let productIndex = cart.findIndex(item => item.product_id == product_id);
    
    if (productIndex !== -1) {
        if (action === "increase") {
            cart[productIndex].quantity += 1;
        } else if (action === "decrease") {
            if (cart[productIndex].quantity > 1) {
                cart[productIndex].quantity -= 1;
            } else {
                cart.splice(productIndex, 1); 
            }
        }
    }

    addCartToMemory(); 
    addCartToHTML(); 
};



const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        displayProducts(products); 

       
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
    .catch(error => console.error(" error in loading product", error));
};



window.onload = () => {
    let userData = JSON.parse(localStorage.getItem('loggedInUser'));
    let navbarUser = document.getElementById("navbar-user");

    navbarUser.textContent = userData && userData.fname ? `👤 ${userData.fname}` : "👤 Guest";

    startSlider();
    initApp();
};

    setTimeout(() => {
        document.querySelectorAll(".filter-btn").forEach(button => {
            button.addEventListener("click", function() {
                let category = this.getAttribute("data-category"); 

                if (category === "all") {
                    displayProducts(products); 
                } else {
                    let filteredProducts = products.filter(product => product.category === category);
                    displayProducts(filteredProducts);
                }
            });
        });
    }, 1000); 

    function displayProducts(filteredProducts) {
        const productContainer = document.querySelector(".products-container");
        productContainer.innerHTML = ""; 
    
        if (!filteredProducts || filteredProducts.length === 0) {
            console.warn("⚠ No products to display!");
            productContainer.innerHTML = "<p>No products available</p>";
            return;
        }
    
        filteredProducts.forEach(product => {
            let productHTML = `
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <button class="addCart">Add To Cart</button>
                </div>
            `;
            productContainer.innerHTML += productHTML;
        });
    
        document.querySelectorAll(".product-card").forEach(card => {
            card.addEventListener("click", function() {
                let productId = this.getAttribute("data-id");
                showProductDetails(productId);
            });
        });
    
        document.querySelectorAll(".addCart").forEach(button => {
            button.addEventListener("click", function(event) {
                event.stopPropagation(); // منع فتح التفاصيل عند النقر على زر السلة
                let productId = this.parentElement.getAttribute("data-id");
                addToCart(productId);
            });
        });
    }
    
    function showProductDetails(productId) {
        let product = products.find(p => p.id == productId);
    
        if (product) {
            document.getElementById("modal-product-image").src = product.image;
            document.getElementById("modal-product-name").innerText = product.name;
            document.getElementById("modal-product-price").innerText = `Price: $${product.price}`;
            document.getElementById("modal-product-description").innerText = `Category: ${product.category}`;
            
            document.getElementById("modal-add-to-cart").onclick = function() {
                addToCart(productId);
            };
    
            document.getElementById("productModal").style.display = "flex";
        }
    }
    
    // إغلاق النافذة عند النقر على زر الإغلاق
    document.addEventListener("DOMContentLoaded", function () {
        let modal = document.getElementById("productModal");
        let closeButton = document.querySelector(".Close");
    
        // عند الضغط على زر الإغلاق ❌
        closeButton.addEventListener("click", function () {
            modal.style.display = "none";
        });
    
        // عند الضغط خارج المودال، يتم إغلاقه
        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
    
    
    
document.querySelector(".checkout").addEventListener("click", function() {

    if (cart.length === 0) {
        alert("🛒 Your cart is empty! Please add some products first.");
    } else {
        let totalPrice = cart.reduce((sum, item) => {
            let product = products.find(p => p.id === Number(item.product_id)); 
    
            if (!product) {
                console.warn(`⚠ Product not found in the product list! (product_id: ${item.product_id})`);
                return sum; 
            }
    
            return sum + (product.price * item.quantity);
        }, 0).toFixed(2);
    
        alert(`✅ Order confirmed!\n💰 Total: $${totalPrice}\nThank you for shopping with us! 😊`);

        localStorage.removeItem("cart");
        cart = [];
        addCartToHTML();
        window.location.href = "/order-confirmation.html";
    }
    
});

function logout() {
    localStorage.removeItem("loggedInUser"); 
    localStorage.removeItem("cart"); 
    window.location.href = "/login/login.html"; 
}

document.addEventListener("DOMContentLoaded", function () {
    let scrollToTopBtn = document.getElementById("scrollToTop");

    // إظهار السهم عند التمرير للأسفل
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) { // يظهر بعد النزول 300px
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });

    // عند الضغط على السهم يصعد للأعلى بسلاسة
    scrollToTopBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});


