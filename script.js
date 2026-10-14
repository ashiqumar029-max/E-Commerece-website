
const products = [
  {
    id: 1,
    name: "Marlow Lounge Chair",
    category: "Seating",
    price: 620,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85",
    tag: "Bestseller",
    note: "Solid oak · Natural linen"
  },
  {
    id: 2,
    name: "Sora Side Table",
    category: "Tables",
    price: 245,
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=900&q=85",
    tag: "New",
    note: "Oak veneer · Matte finish"
  },
  {
    id: 3,
    name: "Mushroom Table Lamp",
    category: "Lighting",
    price: 180,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    tag: "",
    note: "Warm glow · Hand-finished"
  },
  {
    id: 4,
    name: "Forma Ceramic Vase",
    category: "Decor",
    price: 68,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85",
    tag: "Small batch",
    note: "Hand-thrown ceramic"
  },
  {
    id: 5,
    name: "Sunday Three-Seater",
    category: "Seating",
    price: 1890,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
    tag: "Made to order",
    note: "Soft weave · Modular comfort"
  },
  {
    id: 6,
    name: "Gathering Coffee Table",
    category: "Tables",
    price: 480,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=900&q=85",
    tag: "",
    note: "Rounded edges · Ash wood"
  },
  {
    id: 7,
    name: "Pebble Pendant Light",
    category: "Lighting",
    price: 320,
    image: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=900&q=85",
    tag: "Designer pick",
    note: "Soft ambient lighting"
  },
  {
    id: 8,
    name: "Woven Storage Basket",
    category: "Decor",
    price: 54,
    image: "https://images.unsplash.com/photo-1593085260707-5377ba37f868?auto=format&fit=crop&w=900&q=85",
    tag: "",
    note: "Natural fibers · Handwoven"
  }
];

const state = {
  category: "All",
  search: "",
  sort: "featured",
  cart: []
};

const $ = selector => document.querySelector(selector);

const money = amount =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);

let toastTimer;

function notify(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;

  let list = products.filter(product => {
    const matchesCategory =
      state.category === "All" ||
      product.category === state.category;

    const searchableText =
      `${product.name} ${product.category} ${product.note}`.toLowerCase();

    const matchesSearch = searchableText.includes(
      state.search.trim().toLowerCase()
    );

    return matchesCategory && matchesSearch;
  });

  if (state.sort === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (state.sort === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  if (state.sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  grid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        ${
          product.tag
            ? `<span class="product-tag">${product.tag}</span>`
            : ""
        }

        <button class="add-button" data-add="${product.id}">
          <span>Add to bag</span>
          <span>＋</span>
        </button>
      </div>

      <div class="product-details">
        <div>
          <h3>${product.name}</h3>
          <p>${product.note}</p>
        </div>

        <span class="product-price">${money(product.price)}</span>
      </div>
    </article>
  `).join("");

  const emptyState = $("#emptyState");

  if (emptyState) {
    emptyState.hidden = list.length > 0;
  }
}

function addItem(id) {
  const product = products.find(
    item => item.id === Number(id)
  );

  if (!product) return;

  const existingItem = state.cart.find(
    item => item.id === product.id
  );

  if (existingItem) {
    existingItem.qty++;
  } else {
    state.cart.push({
      ...product,
      qty: 1
    });
  }

  renderCart();
  notify(`${product.name} added to your bag`);
}

function renderCart() {
  const count = state.cart.reduce(
    (sum, product) => sum + product.qty,
    0
  );

  const total = state.cart.reduce(
    (sum, product) => sum + product.price * product.qty,
    0
  );

  if ($("#cartCount")) {
    $("#cartCount").textContent = count;
  }

  if ($("#drawerCount")) {
    $("#drawerCount").textContent = `(${count})`;
  }

  if ($("#subtotal")) {
    $("#subtotal").textContent = money(total);
  }

  if ($("#cartEmpty")) {
    $("#cartEmpty").hidden = count > 0;
  }

  if ($("#cartFooter")) {
    $("#cartFooter").hidden = count === 0;
  }

  const cartItems = $("#cartItems");
  if (!cartItems) return;

  cartItems.innerHTML = state.cart.map(product => `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.name}">

      <div>
        <h3>${product.name}</h3>
        <p>${money(product.price)}</p>

        <div class="qty">
          <button
            data-qty="${product.id}"
            data-delta="-1"
            aria-label="Decrease quantity"
          >−</button>

          <span>${product.qty}</span>

          <button
            data-qty="${product.id}"
            data-delta="1"
            aria-label="Increase quantity"
          >＋</button>

          <button
            class="remove"
            data-remove="${product.id}"
          >Remove</button>
        </div>
      </div>

      <span class="cart-item-price">
        ${money(product.price * product.qty)}
      </span>
    </div>
  `).join("");
}

function openCart() {
  $("#cartPanel")?.classList.add("open");
  $("#veil")?.classList.add("show");
  $("#cartPanel")?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("#cartPanel")?.classList.remove("open");
  $("#veil")?.classList.remove("show");
  $("#cartPanel")?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Product category filters
$("#categoryTabs")?.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  state.category = button.dataset.category;

  document.querySelectorAll("[data-category]").forEach(item => {
    item.classList.toggle("active", item === button);
  });

  renderProducts();
});

// Add products to the shopping bag
$("#productGrid")?.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addItem(button.dataset.add);
});

// Search products
$("#searchInput")?.addEventListener("input", event => {
  state.search = event.target.value;
  renderProducts();
});

// Sort products
$("#sortSelect")?.addEventListener("change", event => {
  state.sort = event.target.value;
  renderProducts();
});

// Reset all filters
$("#resetFilters")?.addEventListener("click", () => {
  state.category = "All";
  state.search = "";
  state.sort = "featured";

  if ($("#searchInput")) {
    $("#searchInput").value = "";
  }

  if ($("#sortSelect")) {
    $("#sortSelect").value = "featured";
  }

  document.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === "All"
    );
  });

  renderProducts();
});

// Change quantities or remove products
$("#cartItems")?.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const item = state.cart.find(
      product => product.id === Number(quantityButton.dataset.qty)
    );

    if (item) {
      item.qty += Number(quantityButton.dataset.delta);
    }

    state.cart = state.cart.filter(product => product.qty > 0);

    renderCart();
  }

  if (removeButton) {
    state.cart = state.cart.filter(
      product => product.id !== Number(removeButton.dataset.remove)
    );

    renderCart();
  }
});

// Shopping bag controls
$("#openCart")?.addEventListener("click", openCart);
$("#closeCart")?.addEventListener("click", closeCart);
$("#veil")?.addEventListener("click", closeCart);

$("#continueShopping")?.addEventListener("click", () => {
  closeCart();
  $("#shop")?.scrollIntoView({ behavior: "smooth" });
});

// Demo checkout
$("#checkoutBtn")?.addEventListener("click", () => {
  notify("Demo checkout only — no payment is collected.");
});

// Open search
$("#openSearch")?.addEventListener("click", () => {
  $("#shop")?.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    $("#searchInput")?.focus({ preventScroll: true });
  }, 400);
});

// Mobile navigation
$("#menuToggle")?.addEventListener("click", () => {
  $("#mainNav")?.classList.toggle("open");
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    $("#mainNav")?.classList.remove("open");
  });
});

// Newsletter demo form
$("#newsletterForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const emailInput = $("#emailInput");

  if (!emailInput || !emailInput.checkValidity()) {
    emailInput?.reportValidity();
    return;
  }

  if ($("#newsletterMessage")) {
    $("#newsletterMessage").textContent =
      "Thank you — you're on our demo list. No email was stored.";
  }

  emailInput.value = "";
});

// Close the shopping bag with Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
  }
});

// Set current year in footer
if ($("#year")) {
  $("#year").textContent = new Date().getFullYear();
}

// Initialize the website
renderProducts();
renderCart();
