// URL API từ MockAPI
const apiUrl = "https://68dddcedd7b591b4b78db934.mockapi.io/product";

// Lấy ID sản phẩm từ URL (ví dụ: ?id=6)
const params = new URLSearchParams(window.location.search);
const productID = params.get("id");

console.log("Product ID:", productID);

// Gọi API để lấy chi tiết sản phẩm
fetch(`${apiUrl}/${productID}`)
.then((response) => response.json())
.then((data) => {
  // HTML hiển thị chi tiết sản phẩm
  const itemHTML = `
    <div class="detail-container">
      <img src="${data.img}" alt="${data.name}">
      <div class="detail-info">
        <h2>${data.name}</h2>
        <p class="price">${data.price}K</p>
        <p><strong>Loại:</strong> ${data.category}</p>
        <p>${data.discription}</p>

        <!-- Bộ chọn số lượng -->
        <div class="quantity-control">
          <button class="btn-minus">−</button>
          <input type="number" class="quantity-input" value="1" min="1" max="${data.stock}">
          <button class="btn-plus">+</button>
        </div>

        <div class="btn-group">
          <button class="btn-add">Thêm vào giỏ</button>
          <button class="btn-buy">Mua ngay</button>
        </div>
      </div>
    </div>
  `;

  // Chèn HTML vào trang
  document.querySelector("#productDetails").innerHTML = itemHTML;

  //xử lý nút tăng tiamr số lượng 
  const quantityInput = document.querySelector(".quantity-input");
  const btnPlus = document.querySelector(".btn-plus");
  const btnMinus = document.querySelector(".btn-minus");

  btnPlus.addEventListener("click", () => {
    let current = parseInt(quantityInput.value);
    if (current < data.stock) {
      quantityInput.value = current + 1;
    } else {
      alert("Số lượng vượt quá tồn kho!");
    }
  });

  btnMinus.addEventListener("click", () => {
    let current = parseInt(quantityInput.value);
    if (current > 1) {
      quantityInput.value = current - 1;
    }
  });

  //hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === data.id);

    if (existingItem) {
      if (existingItem.quantity + quantity <= data.stock) {
        existingItem.quantity += quantity;
      } else {
        alert("Số lượng trong kho không đủ!");
        return false;
      }
    } else {
      cart.push({
        id: data.id,
        name: data.name,
        img: data.img,
        price: data.price,
        stock: data.stock,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    return true;
  };

  //xử lý nút thêm vào giỏ hàng
  document.querySelector(".btn-add").addEventListener("click", (e) => {
    e.preventDefault();

    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("vui lòng đăng nhập để thêm giỏ hàng");
      return;
    }

    const quantity = parseInt(quantityInput.value);3
    const added = addToCart(quantity);

    if (added) {
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
    }
  });

  // xử lý nút mua ngay
  document.querySelector(".btn-buy").addEventListener("click", (e) => {
    e.preventDefault();

    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("vui lòng đăng nhập để mua hàng")
      return;
    }

    const quantity = parseInt(quantityInput.value);
    const added = addToCart(quantity);
    if (added) {
      // Chuyển sang trang giỏ hàng hoặc thanh toán
      window.location.href = "payMent.html"; // khi bấm thanh toán thì nó chuyển sang trang thanh toán
    }
  });
})
.catch((error) => {
  console.error("Lỗi khi tải chi tiết sản phẩm:", error);
  document.querySelector("#productDetails").innerHTML =
    "<p>Có lỗi xảy ra khi tải sản phẩm!</p>";
});


