
const products = [
  {id:1,name:"The Everyday Tee",category:"Clothing",price:32,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",badge:"Bestseller",description:"Soft organic cotton"},
  {id:2,name:"Relaxed Linen Shirt",category:"Clothing",price:68,image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85",badge:"New",description:"Airy linen blend"},
  {id:3,name:"Everywhere Tote",category:"Accessories",price:38,image:"https://images.unsplash.com/photo-1590879372815-4c4e9a8e4f5f?auto=format&fit=crop&w=900&q=85",badge:"",description:"Room for the essentials"},
  {id:4,name:"The Daily Knit",category:"Clothing",price:84,image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",badge:"Limited",description:"A layer for every season"},
  {id:5,name:"Weekend Sneaker",category:"Accessories",price:92,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",badge:"",description:"Comfort meets clean lines"},
  {id:6,name:"Sculpted Shoulder Bag",category:"Accessories",price:76,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",badge:"New",description:"Your everyday companion"},
  {id:7,name:"Easy Straight Jean",category:"Clothing",price:89,image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",badge:"",description:"An effortless fit"},
  {id:8,name:"Classic Sunglasses",category:"Accessories",price:45,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",badge:"",description:"A little shade, a lot of style"}
];

const state = { filter: "All", search: "", sort: "featured", cart: [] };
const productGrid = document.querySelector("#productGrid");
const emptyState = document.querySelector("#emptyState");
const cartDrawer = document.querySelector("#cartDrawer");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartFooter = document.querySelector("#cartFooter");
const toast = document.querySelector("#toast");
let toastTimer;

const money = value => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
}).format(value);

function renderProducts() {
  let visible = products.filter(product => {
    const matchesFilter =
      state.filter === "All" || product.category === state.filter;
    const query = state.search.trim().toLowerCase();
    const matchesSearch = !query ||
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  if (state.sort === "low") visible.sort((a, b) => a.price - b.price);
  if (state.sort === "high") visible.sort((a, b) => b.price - a.price);
  if (state.sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to bag">
          <span>Quick add</span><span>＋</span>
        </button>
      </div>
      <div class="product-info">
        <div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-category">${product.category} · ${product.description}</p>
        </div>
        <span class="product-price">${money(product.price)}</span>
      </div>
    </article>`).join("");

  emptyState.hidden = visible.length > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;

  const existing = state.cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else state.cart.push({ ...product, quantity: 1 });

  renderCart();
  showToast(`${product.name} added to your bag`);
}

function changeQuantity(id, delta) {
  const item = state.cart.find(product => product.id === Number(id));
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(product => product.id !== Number(id));
  }
  renderCart();
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
  document.querySelector("#drawerCount").textContent = `(${count})`;
  document.querySelector("#cartSubtotal").textContent = money(subtotal);
  cartEmpty.hidden = count > 0;
  cartFooter.hidden = count === 0;

  cartItems.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="">
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price)}</p>
        <div class="quantity-control">
          <button data-quantity="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button data-quantity="${item.id}" data-delta="1" aria-label="Increase quantity">＋</button>
          <button class="remove-item" data-remove="${item.id}" aria-label="Remove ${item.name}">Remove</button>
        </div>
      </div>
      <span class="cart-item-price">${money(item.price * item.quantity)}</span>
    </div>`).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.querySelector(".close-cart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".filter-btn").forEach(button =>
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(btn =>
      btn.classList.toggle("active", btn === button)
    );
    renderProducts();
  })
);

document.querySelector("#productSearch").addEventListener("input", event => {
  state.search = event.target.value;
  renderProducts();
});

document.querySelector("#sortProducts").addEventListener("change", event => {
  state.sort = event.target.value;
  renderProducts();
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      quantityButton.dataset.quantity,
      Number(quantityButton.dataset.delta)
    );
  }

  if (removeButton) {
    state.cart = state.cart.filter(
      item => item.id !== Number(removeButton.dataset.remove)
    );
    renderCart();
  }
});

document.querySelector(".cart-toggle").addEventListener("click", openCart);
document.querySelector(".close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.querySelector(".continue-shopping").addEventListener("click", () => {
  closeCart();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".checkout-btn").addEventListener("click", () =>
  showToast("Demo checkout only — connect a secure payment provider to accept payments.")
);

document.querySelector(".search-toggle").addEventListener("click", () => {
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#productSearch").focus({ preventScroll: true });
});

document.querySelector(".menu-toggle").addEventListener("click", event => {
  const nav = document.querySelector("#mainNav");
  const isOpen = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("[data-filter-link]").forEach(link =>
  link.addEventListener("click", () => {
    state.filter = link.dataset.filterLink;
    document.querySelectorAll(".filter-btn").forEach(btn =>
      btn.classList.toggle("active", btn.dataset.filter === state.filter)
    );
    renderProducts();
    document.querySelector("#mainNav").classList.remove("open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  })
);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

document.querySelector("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.querySelector("#emailInput");

  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }

  document.querySelector("#newsletterMessage").textContent =
    "Thanks for joining us — this demo form doesn't store email addresses.";
  email.value = "";
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
