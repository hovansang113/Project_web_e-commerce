//  GIỎ HÀNG 
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartTotal = document.querySelector("#cart-total");
const checkout = document.querySelector("#checkout");
const product = document.querySelector("#card-items");

function renderCart() {
  product.innerHTML = "";
  let total = 0;

  cart.forEach((data, index) => {
    const price = Number(data.price) || 0;
    const itemTotal = price * data.quantity;
    total += itemTotal;

    product.innerHTML += `
      <tr>
        <td><img src="${data.img}" class="cart-img" alt="${data.name}" /></td>
        <td>${data.name}</td>
        <td>${data.description || ""}</td>
        <td>${price.toLocaleString("vi-VN")} VND</td>
        <td>
          <input 
            type="number" 
            min="1" 
            max="${data.stock}" 
            value="${data.quantity}" 
            data-index="${index}" 
            class="quantity-input"
          >
        </td>
        <td>${itemTotal.toLocaleString("vi-VN")} VND</td>
        <td><button class="btn-delete" data-index="${index}">Xóa</button></td>
      </tr>
    `;
  });

  cartTotal.textContent = total.toLocaleString("vi-VN") + " VND";
  localStorage.setItem("cart", JSON.stringify(cart));

  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("change", e => {
      const index = e.target.dataset.index;
      let newQuantity = parseInt(e.target.value);

      if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
      if (newQuantity > cart[index].stock) {
        alert("Không thể vượt quá số lượng tồn kho!");
        newQuantity = cart[index].stock;
      }

      cart[index].quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

renderCart();

const payments = document.querySelector("#checkout");
payments.addEventListener("click", e => {
  e.preventDefault();
  window.location.href = "payMent.html";
});


// hàm theo dõi đơn hàng
const orderTable = document.querySelector("#cart-order");
const processingBtn = document.querySelector("#processing_btn");
const shippingBtn = document.querySelector("#shipping_btn");
const deliveredBtn = document.querySelector("#delivered_btn");

function renderOrdersByStatus(status) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orderTable.innerHTML = "";

  const filteredOrders = orders.filter(o => o.status === status);

  filteredOrders.forEach(order => {
    const item = order.items[0];
    orderTable.innerHTML += `
      <tr>
        <td><img src="${item.img}" width="80"></td>
        <td>${item.name}</td>
        <td>${item.price} VND</td>
        <td>${item.quantity}</td>
        <td>${item.price * item.quantity} VND</td>
      </tr>
    `;
  });
}

processingBtn.addEventListener("click", () => renderOrdersByStatus("preparing"));
shippingBtn.addEventListener("click", () => renderOrdersByStatus("shipping"));
deliveredBtn.addEventListener("click", () => renderOrdersByStatus("delivered"));

// Mặc định hiển thị "Đang xử lý"
renderOrdersByStatus("preparing");
