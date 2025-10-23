const apiUrl = "https://68dddcedd7b591b4b78db934.mockapi.io/product";

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const product = document.querySelector("#product-best");
    product.innerHTML = "";

    // Lấy 4 sản phẩm best seller
    const productBest = data.slice(0, 4);

    // Tạo container để cuộn
    const scrollContent = document.createElement("div");
    scrollContent.classList.add("scroll-content");

    // Thêm sản phẩm vào danh sách
    productBest.forEach(items => {
      const productCard = `
        <div class="product-card">
          <img src="${items.img}" alt="${items.name}">
        </div>
      `;
      scrollContent.innerHTML += productCard;
    });

    // Lặp lại thêm 1 lần để tạo hiệu ứng cuộn tròn
    productBest.forEach(items => {
      const productCard = `
        <div class="product-card">
          <img src="${items.img}" alt="${items.name}">
          <div>${items.name}</div>
        </div>
      `;
      scrollContent.innerHTML += productCard;
    });

    product.appendChild(scrollContent);
  })
  .catch(error => console.log("Lỗi khi lấy sản phẩm:", error));

  