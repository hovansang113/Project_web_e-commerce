// ==== Lấy các phần tử ====
const loginBox = document.getElementById("login-box");
const registerBox = document.getElementById("register-box");
const logoutBox = document.getElementById("logout-box");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const currentUser = document.getElementById("currentUser");

// ==== Hiện / Ẩn form ====
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginBox.classList.add("hidden");
  registerBox.classList.remove("hidden");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

// ==== Lấy danh sách user trong localStorage ====
let users = JSON.parse(localStorage.getItem("users")) || [];

// ==== Đăng ký ====
registerBtn.addEventListener("click", () => {
  const username = document.getElementById("regUsername").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password1 = document.getElementById("regPassword1").value.trim();
  const password2 = document.getElementById("regPassword").value.trim();

  if (!username || !phone || !password1 || !password2) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  if (password1 !== password2) {
    alert(" Mật khẩu nhập lại không khớp!");
    return;
  }

  if (password1.length < 8) {
    alert(" Mật khẩu phải có ít nhất 8 ký tự!");
    return;
  }

  // Kiểm tra trùng tên đăng nhập
  const existUser = users.find((u) => u.username === username);
  if (existUser) {
    alert(" Tên đăng nhập đã tồn tại!");
    return;
  }

  const user = { username, phone, password: password1 };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert(" Đăng ký thành công! Vui lòng đăng nhập.");
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

// xử lý phần Đăng nhập 
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if(username == "admin123" && password == "123456"){
    alert("đăng nhập trang quản trị thành công");
    window.location.href = "admin.html";
    return;
  }

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    alert("Sai tên đăng nhập hoặc mật khẩu!");
    return;
  }

  alert(" Đăng nhập thành công!");
  window.location.href = "../index.html";
  loginBox.classList.add("hidden");
  logoutBox.classList.remove("hidden");
  currentUser.textContent = username;
  localStorage.setItem("currentUser", username);
});

// Đăng xuất
logoutBtn.addEventListener("click", () => {
  const username = localStorage.getItem("currentUser");
  if (username) {
    alert(` Đã đăng xuất tài khoản ${username}`);
    localStorage.removeItem("currentUser");
  }

  logoutBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

//  Kiểm tra trạng thái 
window.addEventListener("load", () => {
  const username = localStorage.getItem("currentUser");
  if (username) {
    currentUser.textContent = username;
    loginBox.classList.add("hidden");
    logoutBox.classList.remove("hidden");
  }
});
