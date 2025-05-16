import "./style.css";
import products from "./data.json";

// If using a bundler that supports importing JSON:

// If not, you can fetch the JSON like this:
// fetch('./data.json').then(res => res.json()).then(products => { ... });
const app = document.querySelector<HTMLDivElement>("#app");

const image = document.querySelector<HTMLDivElement>("#image");

function createProductCard(product: any): HTMLElement {
  const card = document.createElement("div");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = product.image.thumbnail;
  img.alt = product.name;
  card.appendChild(img);

  const name = document.createElement("h3");
  name.textContent = product.name;
  card.appendChild(name);

  const category = document.createElement("p");
  category.textContent = `Category: ${product.category}`;
  card.appendChild(category);

  const price = document.createElement("p");
  price.textContent = ` $${product.price.toFixed(2)}`;
  card.appendChild(price);

  return card;
}

function displayProductCards(products: any[]) {
  const container = document.getElementById("product-list");

  products.forEach((product) =>
    container?.appendChild(createProductCard(product))
  );
  app?.appendChild(container!);
}

// Run this after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  displayProductCards(products);
});

