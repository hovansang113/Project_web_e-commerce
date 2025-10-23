let cart = JSON.parse(localStorage.getItem("cart")) || [];
const productPay = document.querySelector("#overallProduct");
const totalPriceEl = document.querySelector("#total-payment");
const checkoutContainer = document.querySelector(".checkout"); // toàn bộ khối thanh toán
const backup = document.querySelector("#backup"); 


// hàm xử lý hiển thị sản phẩm cho cửa hàng
function renderProduct() {
  if (cart.length === 0) {
    productPay.innerHTML = `<p>Giỏ hàng của bạn đang trống!</p>`;
    totalPriceEl.textContent = "0 VND";
    return;
  }

  let html = `
    <div class="select-all">
      <input type="checkbox" id="selectAll"> 
      <label for="selectAll">Chọn tất cả</label>
    </div>
  `;

  cart.forEach((data, index) => {
    const price = Number(data.price) || 0;
    const itemTotal = price * data.quantity;

    html += `
      <div class="all">
        <input type="checkbox" class="select-item">
        <div class="product" data-index="${index}">
          <div class="items">
            <img src="${data.img}" alt="${data.name}" class="img">
            <div class="info">
              <div class="name">${data.name}</div>  
              <div class="price">${price.toLocaleString("vi-VN")} VND</div>
            </div>
          </div>
          <div class="total">
            <div class="coast">
              <div>Số lượng:</div>
              <div>${data.quantity}</div>
            </div>
            <div class="totalPrice">
              <div>Tổng:</div>
              <div>${itemTotal.toLocaleString("vi-VN")} VND</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  productPay.innerHTML = html;
  attachEvents();
  updateTotal();
}


// tạo sự kiện check box cho cửa hảng để khi có thể chọn sản phẩm thanh toán 
function attachEvents() {
  const selectAll = document.querySelector("#selectAll");
  const checkboxes = document.querySelectorAll(".select-item");

  selectAll.addEventListener("change", () => {
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
    updateTotal();
  });

  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const allChecked = [...checkboxes].every(c => c.checked);
      selectAll.checked = allChecked;
      updateTotal();
    });
  });
}

// hàm caappj nhật tổng tiền đã bán được 
function updateTotal() {
  const checkboxes = document.querySelectorAll(".select-item");
  let total = 0;

  checkboxes.forEach((cb, index) => {
    if (cb.checked) {
      const product = cart[index];
      total += product.price * product.quantity;
    }
  });

  totalPriceEl.textContent = total.toLocaleString("vi-VN") + " VND";
}

// sự kiên thanh toán để cho khách hàng
const payBtn = document.querySelector(".order");

if (payBtn) {
  payBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".select-item");
    const selected = [];

    checkboxes.forEach((cb, index) => {
      if (cb.checked) selected.push(cart[index]);
    });

    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    // Lấy thông tin người mua
    const name = document.querySelector("#namePay").value.trim();
    const phone = document.querySelector("#phonePay").value.trim();
    const address = document.querySelector("#addressPay").value.trim();
    const note = document.querySelector("#notePay").value.trim();

    if (!name || !phone || !address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    // Tính tổng tiền
    const total = selected.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Lưu đơn hàng
    const order = {
      id: Date.now(),
      customer: { name, phone, address, note },
      items: selected,
      total,
      date: new Date().toLocaleString("vi-VN"),
      status: "preparing"    
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Xoá sản phẩm đã thanh toán khỏi giỏ hàng
    cart = cart.filter((item, i) => !checkboxes[i].checked);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Ẩn phần thanh toán
    checkoutContainer.style.display = "none";

    // Hiện phần thanh toán thành công trong #backup
    backup.style.display = "flex";
    backup.innerHTML = `
      <div class="success-box">
        <h3>Thanh toán thành công</h3>
        <p><strong>Người mua:</strong> ${name}</p>
        <p><strong>Địa chỉ:</strong> ${address}</p>
        <p><strong>Sản phẩm đã mua:</strong></p>
        ${selected.map(item => `
          <div>
            <img src="${item.img}" alt="${item.name}" width="60" height="60" style="object-fit:cover; border-radius:6px;">
            <span>${item.name} - ${item.price.toLocaleString("vi-VN")} VND x ${item.quantity}</span>
          </div>
        `).join("")}
        <p><strong>Tổng tiền:</strong> ${total.toLocaleString("vi-VN")} VND</p>
        <button class="ok-btn">OK</button>
      </div>
    `;

    // Khi bấm OK → quay về trang chủ
    backup.querySelector(".ok-btn").addEventListener("click", () => {
      window.location.href = "/public/index.html";
    });
  });
}


// Khi load trang
document.addEventListener("DOMContentLoaded", renderProduct);
