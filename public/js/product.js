const apiUrl = "https://68dddcedd7b591b4b78db934.mockapi.io/product";
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Lấy danh sách sản phẩm, bỏ 4 phần tử đầu nếu cần
    const products = data.slice(4);
    // Lưu lại toàn bộ sản phẩm để lọc sau này
    window.allProducts = products;

    // Hiển thị toàn bộ sản phẩm ban đầu
    renderProducts(products);

    // Kiểm tra nếu có từ khóa search trong URL
    filterProductsBySearch();

    // Lọc theo danh mục Tất cả  Áo / Quần)
    $("select").on("change", function () {
      const selected = $(this).val();

      // Dùng .filter() để lọc sản phẩm
      const filteredProducts =
        selected === "Tất cả" || selected === ""
          ? window.allProducts
          : window.allProducts.filter(p => p.category === selected);

      // Hiển thị lại danh sách sau khi lọc
      renderProducts(filteredProducts);
    });
  })
  .catch(error => console.log("Lỗi khi tải dữ liệu:", error));


//  Hàm hiển thị sản phẩm ra giao diện
function renderProducts(products) {
  const shirtList = $("#T-shirts");
  const trouse = $("#trouse");

  // Xóa nội dung cũ
  shirtList.empty();
  trouse.empty();

  // Duyệt qua từng sản phẩm và hiển thị
  products.forEach(item => {
    const html = `
      <div class="product-item">
        <a href="productDetails.html?id=${item.id}">
          <img src="${item.img}" alt="${item.name}">
        </a>
        <div class="product-name">${item.name}</div>
        <div class="product-price">${item.price} VND</div>
      </div>
    `;

    // Thêm sản phẩm vào danh mục tương ứng
    if (item.category === "Áo") {
      shirtList.append(html);
    } else if (item.category === "Quần") {
      trouse.append(html);
    }
  });
}


// Hàm tìm kiếm sản phẩm theo từ khóa trong URL (?search=)
function filterProductsBySearch() {
  const params = new URLSearchParams(window.location.search);
  const searchKeyword = params.get("search")?.toLowerCase();

  if (searchKeyword) {
    const products = document.querySelectorAll(".product-item");
    let matchCount = 0;

    products.forEach(product => {
      const name = product.querySelector(".product-name").textContent.toLowerCase();
      if (!name.includes(searchKeyword)) {
        product.style.display = "none";
      } else {
        matchCount++;
      }
    });

    if (matchCount === 0) {
      const container = document.querySelector("#T-shirts") || document.querySelector("#trouse");
      if (container) {
        container.innerHTML = `<p style="color:red; text-align:center;">Không tìm thấy sản phẩm phù hợp với từ khóa "${searchKeyword}"</p>`;
      }
    }
  }
}
