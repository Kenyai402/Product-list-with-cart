import "./style.css";
import products from "./data.json";

const app = document.querySelector<HTMLDivElement>("#app");

function createProductCard(product: any): HTMLElement {
  const card = document.createElement("div");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = product.image.desktop;
  img.alt = product.name;
  card.appendChild(img);

  const category = document.createElement("p");
  category.textContent = `${product.category}`;
  card.appendChild(category);

  const name = document.createElement("h3");
  name.textContent = product.name;
  card.appendChild(name);

  const price = document.createElement("p");
  price.textContent = ` $${product.price.toFixed(2)}`;
  card.appendChild(price);

  // --- Add to Cart Button with Icon and Design ---
  const cartButton = document.createElement("button");
  cartButton.className = "add-to-cart";

  const cartIcon = document.createElement("img");
  cartIcon.src = "/public/assets/images/icon-add-to-cart.svg"; 
  cartIcon.alt = "Add to cart";
  cartIcon.className = "cart-icon";

  const cartSpan = document.createElement("span");
  cartSpan.innerText = "Add to cart";

  cartButton.appendChild(cartIcon);
  cartButton.appendChild(cartSpan);

  const cartProducts = JSON.parse(localStorage.getItem("cartProducts") || "[]");
  const isInCart = cartProducts.includes(product.name);

  if (isInCart) {
    cartButton.classList.add("in-cart");
    cartSpan.innerText = "In cart";
    cartButton.disabled = true;
  }

  cartButton.addEventListener("click", () => {
    if (!cartProducts.includes(product.name)) {
      const updatedCart = [...cartProducts, product.name];
      localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
      cartButton.classList.add("in-cart");
      cartSpan.innerText = "In cart";
      cartButton.disabled = true;
    }
  });

  card.appendChild(cartButton);

  return card;
}

function displayProductCards(products: any[]) {
  const container = document.getElementById("product-list");

  products.forEach((product) =>
    container?.appendChild(createProductCard(product))
  );
  app?.appendChild(container!);
}

document.addEventListener("DOMContentLoaded", () => {
  displayProductCards(products);
});
