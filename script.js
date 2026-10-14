
const products = [
  {id:1,name:"Pulse Wireless Headphones",category:"Audio",price:129,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",badge:"Bestseller",description:"Immersive sound"},
  {id:2,name:"Studio Sound Buds",category:"Audio",price:79,image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85",badge:"New",description:"Pocket-sized audio"},
  {id:3,name:"Orbit Smart Watch",category:"Wearables",price:189,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",badge:"Popular",description:"Smart everyday style"},
  {id:4,name:"Power Bank",category:"Accessories",price:49,image:"https://images.unsplash.com/photo-1609592806596-b43bada3f6b5?auto=format&fit=crop&w=900&q=85",badge:"",description:"Power on the go"},
  {id:5,name:"Mechanical Keyboard",category:"Accessories",price:99,image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",badge:"Popular",description:"A satisfying click"},
  {id:6,name:"Bluetooth Speaker",category:"Audio",price:109,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",badge:"",description:"Room-filling sound"},
  {id:7,name:"Active Smart Band",category:"Wearables",price:69,image:"https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=85",badge:"New",description:"Track your movement"},
  {id:8,name:"Everyday Tech Pouch",category:"Accessories",price:35,image:"https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=85",badge:"",description:"Organize your essentials"}
];

const $ = selector => document.querySelector(selector);
const money = amount => "$" + amount.toFixed(2);
const state = { category:"All", search:"", sort:"featured", cart:[] };
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;

  let list = products.filter(product =>
    (state.category === "All" || product.category === state.category) &&
    (product.name + " " + product.category + " " + product.description)
      .toLowerCase().includes(state.search.toLowerCase().trim())
  );

  if (state.sort === "low") list.sort((a,b) => a.price-b.price);
  if (state.sort === "high") list.sort((a,b) => b.price-a.price);
  if (state.sort === "name") list.sort((a,b) => a.name.localeCompare(b.name));

  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <button class="quick-add" data-add="${p.id}">
          <span>Quick add</span><span>＋</span>
        </button>
      </div>
      <div class="product-info">
        <div><h3 class="product-name">${p.name}</h3>
        <p class="product-category">${p.category} · ${p.description}</p></div>
        <span class="product-price">${money(p.price)}</span>
      </div>
    </article>
  `).join("");

  const empty = $("#emptyState");
  if (empty) empty.hidden = list.length > 0;
}

function addToCart(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;

  const existing = state.cart.find(p => p.id === product.id);
  if (existing) existing.quantity++;
  else state.cart.push({...product, quantity:1});

  renderCart();
  showToast(product.name + " added to your bag");
}

function renderCart() {
  const count = state.cart.reduce((sum,p) => sum+p.quantity, 0);
  const subtotal = state.cart.reduce((sum,p) => sum+p.price*p.quantity, 0);

  if ($("#bagCount")) $("#bagCount").textContent = count;
  if ($("#drawerCount")) $("#drawerCount").textContent = `(${count})`;
  if ($("#subtotal")) $("#subtotal").textContent = money(subtotal);
  if ($("#cartEmpty")) $("#cartEmpty").hidden = count > 0;
  if ($("#cartFooter")) $("#cartFooter").hidden = count === 0;

  const container = $("#cartItems");
  if (!container) return;

  container.innerHTML = state.cart.map(p => `
    <div class="cart-item">
      <img src="${p.image}" alt="">
      <div><h3>${p.name}</h3><p>${money(p.price)}</p>
        <div class="quantity-control">
          <button data-qty="${p.id}" data-delta="-1">−</button>
          <span>${p.quantity}</span>
          <button data-qty="${p.id}" data-delta="1">＋</button>
          <button class="remove-item" data-remove="${p.id}">Remove</button>
        </div>
      </div>
      <span class="cart-item-price">${money(p.price*p.quantity)}</span>
    </div>
  `).join("");
}

function openCart() {
  $("#cartDrawer")?.classList.add("open");
  $("#overlay")?.classList.add("visible");
  $("#cartDrawer")?.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("#cartDrawer")?.classList.remove("open");
  $("#overlay")?.classList.remove("visible");
  $("#cartDrawer")?.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  $("#filters")?.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.category = button.dataset.filter;
    document.querySelectorAll(".filter").forEach(b =>
      b.classList.toggle("active", b === button)
    );
    renderProducts();
  });

  $("#productGrid")?.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button.dataset.add);
  });

  $("#searchInput")?.addEventListener("input", event => {
    state.search = event.target.value;
    renderProducts();
  });

  $("#sortSelect")?.addEventListener("change", event => {
    state.sort = event.target.value;
    renderProducts();
  });

  $("#cartItems")?.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
      const item = state.cart.find(p => p.id === Number(quantityButton.dataset.qty));
      if (item) item.quantity += Number(quantityButton.dataset.delta);
      state.cart = state.cart.filter(p => p.quantity > 0);
      renderCart();
    }

    if (removeButton) {
      state.cart = state.cart.filter(p => p.id !== Number(removeButton.dataset.remove));
      renderCart();
    }
  });

  $("#openCart")?.addEventListener("click", openCart);
  $("#closeCart")?.addEventListener("click", closeCart);
  $("#overlay")?.addEventListener("click", closeCart);

  $("#continueShopping")?.addEventListener("click", () => {
    closeCart();
    $("#shop")?.scrollIntoView({behavior:"smooth"});
  });

  $("#checkoutBtn")?.addEventListener("click", () =>
    showToast("Demo checkout only. No real payment is taken.")
  );

  $("#resetFilters")?.addEventListener("click", () => {
    state.category = "All";
    state.search = "";
    state.sort = "featured";
    if ($("#searchInput")) $("#searchInput").value = "";
    if ($("#sortSelect")) $("#sortSelect").value = "featured";
    document.querySelectorAll(".filter").forEach(b =>
      b.classList.toggle("active", b.dataset.filter === "All")
    );
    renderProducts();
  });

  document.querySelectorAll("[data-category-link]").forEach(link =>
    link.addEventListener("click", () => {
      state.category = link.dataset.categoryLink;
      document.querySelectorAll(".filter").forEach(b =>
        b.classList.toggle("active", b.dataset.filter === state.category)
      );
      renderProducts();
      $("#nav")?.classList.remove("open");
    })
  );

  $(".search-toggle")?.addEventListener("click", () => {
    $("#shop")?.scrollIntoView({behavior:"smooth"});
    setTimeout(() => $("#searchInput")?.focus({preventScroll:true}), 400);
  });

  $("#menuToggle")?.addEventListener("click", () =>
    $("#nav")?.classList.toggle("open")
  );

  $("#newsletterForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const email = $("#emailInput");
    if (!email?.checkValidity()) {
      email?.reportValidity();
      return;
    }
    $("#newsletterMessage").textContent =
      "Thanks for joining! This demo does not store email addresses.";
    email.value = "";
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
  });

  if ($("#year")) $("#year").textContent = new Date().getFullYear();
});
