
const GITHUB_URL = "https://raw.githubusercontent.com/sohamnaik2007-boop/Kamei/refs/heads/main/products.json";

let products = [];
let cart = [];
let selectedCategory = "All";

async function loadProducts() {
    const productList = document.getElementById("product-list");

    try {
        productList.textContent = "Loading products...";

        const response = await fetch(GITHUB_URL);

        if (!response.ok) {
            throw new Error("Could not load products from GitHub.");
        }

        products = await response.json();

        displayProducts();
        displayCart();

        console.log("Products loaded from GitHub:", products);
    } catch (error) {
        console.error(error);
        productList.textContent =
            "Unable to load products. Please check your internet connection and GitHub JSON file.";
    }
}

function displayProducts() {
    const searchText = document
        .getElementById("search")
        .value.toLowerCase();

    const filteredProducts = products.filter(function(product) {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    if (filteredProducts.length === 0) {
        productList.textContent = "No products found.";
        return;
    }

    filteredProducts.forEach(function(product) {
        const card = document.createElement("div");
        card.className = "product";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.className = "product-photo";

        image.onerror = function() {
            image.alt = "Image unavailable";
        };

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "₹" + product.price;

        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.onclick = function() {
            addToCart(product.id);
        };

        card.append(image, name, price, button);
        productList.appendChild(card);
    });
}

function filterProducts(category) {
    selectedCategory = category;
    displayProducts();
}

function addToCart(productId) {
    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) return;

    cart.push(product);
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(function(item, index) {
        total += Number(item.price);

        const li = document.createElement("li");
        li.appendChild(document.createTextNode(
            item.name + " - ₹" + item.price + " "
        ));

        const button = document.createElement("button");
        button.textContent = "Remove";
        button.onclick = function() {
            removeFromCart(index);
        };

        li.appendChild(button);
        cartItems.appendChild(li);
    });

    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("total").textContent = total;
}

document.getElementById("search").addEventListener(
    "input",
    displayProducts
);

loadProducts();
