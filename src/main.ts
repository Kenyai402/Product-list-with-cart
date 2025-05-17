import "./style.css";
import products from "./data.json";



//in data.json:
// Image
// name
// cateory
// price

const app = document.querySelector<HTMLDivElement>("#app")!;

// Helper: Get cart as { [name: string]: count }
function getCart() {
  return JSON.parse(localStorage.getItem("cartProducts") || "{}");
}
function setCart(cart: Record<string, number>) {
  localStorage.setItem("cartProducts", JSON.stringify(cart));
}

// Update cart icon count
function updateCartDisplay() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((a, b) => (a as number) + (b as number), 0);
  cartContainer.innerHTML = `
    <img src="./images/icon-cart.svg" alt="Cart" style="width:28px;height:28px;">
    <span style="position:absolute;top:2px;right:2px;background:#ff6f61;color:#fff;border-radius:50%;padding:2px 7px;font-size:0.9rem;">
      ${count}
    </span>
  `;
}

// Show cart modal
function showCartModal() {
  const modal = document.getElementById("cart-modal") as HTMLDivElement;
  const itemsContainer = document.getElementById("cart-items")!;
  const cart = getCart();
  itemsContainer.innerHTML = "";

  if (Object.keys(cart).length === 0) {
    itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    Object.entries(cart).forEach(([name, qty]) => {
      const product = products.find((p: any) => p.name === name);
      if (!product) return;
      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <span>${product.name}</span>
        <div class="cart-item-controls">
          <button class="decrease" aria-label="Decrease quantity">-</button>
          <span>${qty}</span>
          <button class="increase" aria-label="Increase quantity">+</button>
          <button class="remove" aria-label="Remove item">&times;</button>
        </div>
      `;
      // Button handlers
      item.querySelector(".increase")!.addEventListener("click", () => {
        cart[name]++;
        setCart(cart);
        showCartModal();
        updateCartDisplay();
      });
      item.querySelector(".decrease")!.addEventListener("click", () => {
        if (cart[name] > 1) {
          cart[name]--;
        } else {
          delete cart[name];
        }
        setCart(cart);
        showCartModal();
        updateCartDisplay();
      });
      item.querySelector(".remove")!.addEventListener("click", () => {
        delete cart[name];
        setCart(cart);
        showCartModal();
        updateCartDisplay();
      });
      itemsContainer.appendChild(item);
    });
  }
  modal.hidden = false;
  modal.focus();
}

// Hide cart modal
function hideCartModal() {
  const modal = document.getElementById("cart-modal") as HTMLDivElement;
  modal.hidden = true;
}

// Show order confirmation
// (removed unused function showOrderConfirmation)

// Hide order confirmation
function hideOrderConfirmation() {
  document.getElementById("order-confirmation")!.hidden = true;
}

// Cart icon click opens modal
document.getElementById("cart-container")?.addEventListener("click", showCartModal);

// Modal close button
document.getElementById("close-cart")?.addEventListener("click", hideCartModal);

// Confirm order button
document.getElementById("confirm-order")?.addEventListener("click", () => {
  localStorage.removeItem("cartProducts");
  updateCartDisplay();
  document.getElementById("order-confirmation")!.hidden = false;
  hideCartModal();
});

// Reset order button
document.getElementById("reset-order")?.addEventListener("click", () => {
  localStorage.removeItem("cartProducts");
  updateCartDisplay();
  hideCartModal();
});

// Confirmation modal close
document.getElementById("close-confirmation")?.addEventListener("click", hideOrderConfirmation);

// Keyboard accessibility for modal
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("cart-modal") as HTMLDivElement;
  const confirmation = document.getElementById("order-confirmation") as HTMLDivElement;
  if (!modal.hidden && e.key === "Escape") {
    hideCartModal();
  }
  if (!confirmation.hidden && e.key === "Escape") {
    hideOrderConfirmation();
  }
});

// Update createProductCard to use cart as object with counts
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

  // --- Add to Cart Controls ---
  const controls = document.createElement("div");
  controls.className = "add-to-cart-controls";

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  minusBtn.className = "cart-minus";
  minusBtn.setAttribute("aria-label", "Decrease quantity");

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  plusBtn.className = "cart-plus";
  plusBtn.setAttribute("aria-label", "Increase quantity");

  const qtySpan = document.createElement("span");
  qtySpan.className = "cart-qty";

  // Get cart and set initial quantity
  let cart = getCart();
  let qty = cart[product.name] || 0;
  qtySpan.textContent = qty.toString();

  // Disable minus if qty is 0
  minusBtn.disabled = qty === 0;

  // Add to cart logic
  plusBtn.addEventListener("click", () => {
    cart = getCart();
    cart[product.name] = (cart[product.name] || 0) + 1;
    setCart(cart);
    qty = cart[product.name];
    qtySpan.textContent = qty.toString();
    minusBtn.disabled = false;
    updateCartDisplay();
  });

  minusBtn.addEventListener("click", () => {
    cart = getCart();
    if (cart[product.name] > 1) {
      cart[product.name]--;
    } else {
      delete cart[product.name];
    }
    setCart(cart);
    qty = cart[product.name] || 0;
    qtySpan.textContent = qty.toString();
    minusBtn.disabled = qty === 0;
    updateCartDisplay();
  });

  controls.appendChild(minusBtn);
  controls.appendChild(qtySpan);
  controls.appendChild(plusBtn);

  card.appendChild(controls);

  return card;
}

function displayProductCards(products: any[])  {
  const container = document.getElementById("product-list");

  products.forEach((product) =>
    container?.appendChild(createProductCard(product))
  );
  app?.appendChild(container!);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("order-confirmation")!.hidden = true;
  displayProductCards(products);
  updateCartDisplay();
});
