// ===== canteen app — student template (app.js) =====
// Instructions for students:
// - Implement the TODO functions below using only core JavaScript (arrays, strings, loops, sort, etc.).
// - Use inline `onclick` handlers from the HTML to connect UI buttons to these functions.
// - Do NOT change the element IDs or button text in `index.html` (they are required for automated tests).
// - Keep DOM interaction minimal: read values by getElementById and write with innerHTML/textContent.

// SAMPLE MENU: you can modify items but keep the id, name, price, category fields.
const menu = [
  { id: 1, name: "Masala Dosa", price: 70, category: "Meals" },
  { id: 2, name: "Veg Puff", price: 25, category: "Snacks" },
  { id: 3, name: "Samosa (2 pcs)", price: 30, category: "Snacks" },
  { id: 4, name: "Paneer Wrap", price: 60, category: "Meals" },
  { id: 5, name: "Chai", price: 15, category: "Drinks" }
];

// Tray stores **copies** of items added; implement add/remove using array ops
let tray = [];

// Utility: format currency — tests expect the rupee symbol '₹' and integer amounts
function formatRupee(n) {
  return "₹" + Number(n).toFixed(0);
}

// Renders menu array into #menuGrid — each card MUST contain these classes/structure:
// <div class="card">
//   <div class="name">...name...</div>
//   <div class="meta">...category...</div>
//   <div class="price">₹...price...</div>
//   <button onclick="addToTray(ID)">Add</button>
// </div>
function renderMenu(items) {
  const container = document.getElementById('menuGrid');
  let html = '';
  for (const item of items) {
    html += `<div class="card">
      <div class="name">${escapeHtml(item.name)}</div>
      <div class="meta">${escapeHtml(item.category)}</div>
      <div class="price">${formatRupee(item.price)}</div>
      <button onclick="addToTray(${item.id})">Add</button>
    </div>`;
  }
  container.innerHTML = html;
}

// Renders tray into #trayList and updates #trayTotal
// Tray items should display: name, category, "x QUANTITY" and line total
// Each tray row should include buttons exactly with text: '−', '+', 'Remove'
function renderTray() {
  const trayList = document.getElementById('trayList');
  const trayTotal = document.getElementById('trayTotal');
  if (tray.length === 0) {
    trayList.innerHTML = '<li style="color:var(--muted)">Tray is empty</li>';
    trayTotal.textContent = formatRupee(0);
    return;
  }
  // Group by id
  const grouped = {};
  for (const item of tray) {
    if (!grouped[item.id]) grouped[item.id] = { ...item, qty: 0 };
    grouped[item.id].qty++;
  }
  let html = '';
  let total = 0;
  for (const id in grouped) {
    const g = grouped[id];
    const lineTotal = g.price * g.qty;
    total += lineTotal;
    html += `<li>${escapeHtml(g.name)} <span class="meta">(${escapeHtml(g.category)})</span> x ${g.qty} = ${formatRupee(lineTotal)}
      <button onclick="removeOne(${g.id})">−</button>
      <button onclick="addToTray(${g.id})">+</button>
      <button onclick="removeAll(${g.id})">Remove</button>
    </li>`;
  }
  trayList.innerHTML = html;
  trayTotal.textContent = formatRupee(total);
}

// Add a menu item (by id) to tray
function addToTray(id) {
  const item = menu.find(m => m.id === id);
  if (item) tray.push({ ...item });
  renderTray();
}

// Remove one quantity of item with given id
function removeOne(id) {
  const idx = tray.findIndex(i => i.id === id);
  if (idx !== -1) tray.splice(idx, 1);
  renderTray();
}

// Remove all occurrences of an item
function removeAll(id) {
  tray = tray.filter(i => i.id !== id);
  renderTray();
}

// Clear the tray entirely
function clearTray() {
  tray = [];
  renderTray();
}

// Apply filters: read values from #categorySelect and #sortSelect
// Build a filtered array and sort it if requested, then call renderMenu(filtered)
function applyFilters() {
  const cat = document.getElementById('categorySelect').value;
  const sort = document.getElementById('sortSelect').value;
  let filtered = menu.slice();
  if (cat !== 'ALL') filtered = filtered.filter(i => i.category === cat);
  if (sort === 'PRICE_ASC') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'PRICE_DESC') filtered.sort((a, b) => b.price - a.price);
  renderMenu(filtered);
}

// Reset filters and render full menu
function resetFilters() {
  document.getElementById('categorySelect').value = 'ALL';
  document.getElementById('sortSelect').value = 'NONE';
  renderMenu(menu.slice());
}

// Small helper to escape HTML
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
resetFilters();
renderTray();