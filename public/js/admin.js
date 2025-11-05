// fetch sản phẩm từ mock api về để xử lý các phương thức (post put delete get)
const apiUrl = 'https://68dddcedd7b591b4b78db934.mockapi.io/product';

// quản lý thêm sửa xóa sản phẩm
// lấy id nút click theo sản phẩm  theo ID addItem
const addItemBtn = document.querySelector("#addItem");
// lý id của form để them sản phẩm quả ID modal body
const modal = document.querySelector("#modal-body");
// lấy id của nut thoát qua ID outForm
const outForm = document.querySelector("#outForm");
// lấy form thêm sản phẩm qua id addproductForm
const form = document.querySelector("#addProductForm");
// lấy xử lý nút khi thêm sản phẩm
const submitBtn = document.querySelector("#submit");

// Đăng xuất
const logOut = document.querySelector("#logout");
logOut.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "../index.html";
});

// Biến lưu id sản phẩm đang sửa (nếu null => đang ở chế độ "thêm")
let editId = null;

// Hiển thị modal thêm sản phẩm
addItemBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.reset();
  submitBtn.textContent = "Thêm";
  editId = null;
  modal.style.display = "flex";
});

outForm.addEventListener("click", () => {
  modal.style.display = "none";
});

//  sửa lỗi cú pháp ở đây (thiếu cặp ngoặc tròn)
function fetchProduct() {
// Hàm gọi API GET để lấy tất cả sản phẩm và hiển thị lên bảng
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const productList = document.querySelector("#productTableBody");
      productList.innerHTML = "";

      data.forEach(item => {
        const row = `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.price}</td>
            <td>${item.stock}</td>
            <td><img src="${item.img}" width="60" alt="ảnh sản phẩm"></td>
            <td>${item.discption || ""}</td>
            <td>
              <button onclick="deleteProduct(${item.id})" class="btn-delete">Xóa</button>
              <button onclick="updateProduct(${item.id})" class="btn-update">Sửa</button>
            </td>
          </tr>
        `;
        productList.innerHTML += row;
      });
    })
    .catch(error => console.log('Error fetching products:', error));
}

// Thêm / sửa sản phẩm
// xử lý sự kiên khi submit form 
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // lấy giá trị từ form 
  const name = document.querySelector("#addProductName").value.trim();
  const category = document.querySelector("#addProductCategory").value.trim();
  const stock = document.querySelector("#addQuantity").value.trim();
  const img = document.querySelector("#addProductImg").value.trim();
  const price = document.querySelector("#addProductPrice").value.trim();
  const discption = document.querySelector("#addDisciption").value.trim();

  const newProduct = { name, category, stock, img, price, discption };

  if (editId) {
    // Sửa sản phẩm
    fetch(`${apiUrl}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    })
      .then(response => response.json())
      .then(() => {
        fetchProduct();
        form.reset();
        modal.style.display = "none";
        editId = null;
        submitBtn.textContent = "Thêm";
      })
      .catch(error => console.log("Error updating product:", error));
  } else {
    // Thêm sản phẩm mới
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    })
      .then(response => response.json())
      .then(() => {
        fetchProduct();
        form.reset();
        modal.style.display = "none";
      })
      .catch(error => console.log("Error adding product:", error));
  }
});

// Xóa sản phẩm
function deleteProduct(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => fetchProduct())
    .catch(error => console.log("Lỗi xóa sản phẩm:", error));
}

// Sửa sản phẩm
function updateProduct(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.querySelector("#addProductName").value = data.name;
      document.querySelector("#addProductCategory").value = data.category;
      document.querySelector("#addQuantity").value = data.stock;
      document.querySelector("#addProductImg").value = data.img;
      document.querySelector("#addProductPrice").value = data.price;
      document.querySelector("#addDisciption").value = data.discption || "";

      editId = id;
      submitBtn.textContent = "Lưu";
      modal.style.display = "flex";
    })
    .catch(error => console.log("Lỗi khi tải sản phẩm để sửa:", error));
}

fetchProduct();

// xử lý phàn quản lý user
const listUser = document.querySelector("#userTableBody");
let users = JSON.parse(localStorage.getItem("users")) || [];

function renderUser() {
  listUser.innerHTML = "";

  users.forEach((data, index) => {
    const isBlocked = data.blocked === true; // kiểm tra trạng thái chặn

    listUser.innerHTML += `
      <tr style="${isBlocked ? 'opacity: 0.6; background: #ff0000ff;' : ''}">
        <td>${index + 1}</td>
        <td>${data.username}</td>
        <td>${data.email}</td>
        <td>${data.phone}</td>
        <td>${data.password}</td>
        <td>
          <button 
            class="btn-toggle-block" 
            data-index="${index}" 
            style="background-color: ${isBlocked ? '#000000ff' : '#070000ff'}; color: white; border: none; padding: 10px 10px; ;">
            ${isBlocked ? 'Mở chặn' : 'Chặn'}
          </button>
        </td>
      </tr>
    `;
  });

  // Xử lý nút chặn / mở chặn
  document.querySelectorAll(".btn-toggle-block").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = e.target.dataset.index;
      // Đảo trạng thái "blocked"
      users[i].blocked = !users[i].blocked;

      // Lưu lại vào localStorage
      localStorage.setItem("users", JSON.stringify(users));

      // Cập nhật lại bảng
      renderUser();
    });
  });
}

renderUser();



//xử lý phàn quảng lý đơn hàng
const orderTableBody = document.querySelector("#orderTableBody");
let order = JSON.parse(localStorage.getItem("orders")) || [];

function renderOrders() {
  orderTableBody.innerHTML = "";

  order.forEach((data, index) => {
    const customerId = data.id;
    const item = data.items && data.items[0];
    const itemId = item ? item.id : "";
    const quantity = item ? item.quantity : 0;
    const status = data.status || "preparing";                                      


    orderTableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${customerId}</td>
        <td>${itemId}</td>
        <td>${quantity}</td>
        <td>
          <select class="order-status" data-index="${index}">
            <option value="preparing" ${status === "preparing" ? "selected" : ""}>Đang chuẩn bị hàng</option>
            <option value="shipping" ${status === "shipping" ? "selected" : ""}>Đang giao</option>
            <option value="delivered" ${status === "delivered" ? "selected" : ""}>Đã giao thành công</option>
          </select>
        </td>
        <td><button class="btn-deleteOrders" data-index="${index}">Xóa</button></td>
      </tr>
    `;
  });

  // Xóa đơn hàng
  document.querySelectorAll(".btn-deleteOrders").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = e.target.dataset.index;
      order.splice(i, 1);
      localStorage.setItem("orders", JSON.stringify(order));
      renderOrders();
    });
  });

  // Thay đổi trạng thái đơn hàng
  document.querySelectorAll(".order-status").forEach(select => {
    select.addEventListener("change", e => {
      const i = e.target.dataset.index;
      order[i].status = e.target.value;
      localStorage.setItem("orders", JSON.stringify(order));
      console.log(`Đơn hàng ${order[i].id} đổi trạng thái thành ${order[i].status}`);
    });
  });
}

renderOrders();
