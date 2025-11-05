// Lấy các phần tử 
const loginBox = document.getElementById("login-box");
const registerBox = document.getElementById("register-box");
const logoutBox = document.getElementById("logout-box");
const forgetBox = document.getElementById("forget-box");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const showForgetLink = document.getElementById("showforgetEmail");
const backToLogin = document.getElementById("backToLogin");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const forgetSendBtn = document.getElementById("forgetSendBtn");
const currentUser = document.getElementById("currentUser");

//xử lý ẩn hiện form
// Chuyển sang form Đăng ký
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginBox.classList.add("hidden");
  registerBox.classList.remove("hidden");
  forgetBox.classList.add("hidden");
});

// Quay lại form Đăng nhập từ Đăng ký
showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
  forgetBox.classList.add("hidden");
});

// Mở form Quên mật khẩu
showForgetLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginBox.classList.add("hidden");
  registerBox.classList.add("hidden");
  forgetBox.classList.remove("hidden");
});

// Quay lại đăng nhập từ quên mật khẩu
backToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  forgetBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

// ===== Danh sách user =====
let users = JSON.parse(localStorage.getItem("users")) || [];

// xử lý phần Đăng ký
registerBtn.addEventListener("click", () => {
  const username = document.getElementById("regUsername").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password1 = document.getElementById("regPassword1").value.trim();
  const password2 = document.getElementById("regPassword").value.trim();
  const email = document.getElementById("regEmail").value.trim();

  if (!username || !phone || !password1 || !password2 || !email) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  if (password1 !== password2) {
    alert("Mật khẩu nhập lại không khớp!");
    return;
  }

  if (password1.length < 8) {
    alert("Mật khẩu phải có ít nhất 8 ký tự!");
    return;
  }

  const existUser = users.find((u) => u.username === username);
  if (existUser) {
    alert("Tên đăng nhập đã tồn tại!");
    return;
  }

  const user = { username, phone, email, password: password1 };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  // Gửi email bằng EmailJS
  const templateParams = { name: username, email: email };
  console.log(templateParams);
  
  emailjs.send("service_03w9j3g", "template_objk4fc", templateParams)
    .then(response => {
      console.log("Email sent:", response.status, response.text);
      alert("Đăng ký thành công! Vui lòng kiểm tra email.");
    })
    .catch(error => {
      console.error("Email error:", error);
      alert("Đăng ký thành công! Nhưng chưa gửi được email.");
    });

  // Chuyển về đăng nhập
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

// xử lý phần Đăng nhập 
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (username === "admin123" && password === "123456") {
    alert("Đăng nhập trang quản trị thành công!");
    window.location.href = "admin.html";
    return;
  }


  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }



  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    alert("Sai tên đăng nhập hoặc mật khẩu!");
    return;
  }

  if (user.blocked) {
    alert("Tài khoản của bạn đã bị chặn. Vui lòng liên hệ quản trị viên!");
    return;
  }


  alert("Đăng nhập thành công!");
  window.location.href = "../index.html";
  localStorage.setItem("currentUser", username);
});

// xử lý phần Đăng xuất   
logoutBtn.addEventListener("click", () => {
  const username = localStorage.getItem("currentUser");
  if (username) {
    alert(`Đã đăng xuất tài khoản ${username}`);
    localStorage.removeItem("currentUser");
  }
  logoutBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

// xử lý Kiểm tra trạng thái đăng nhập 
window.addEventListener("load", () => {
  const username = localStorage.getItem("currentUser");
  if (username) {
    currentUser.textContent = username;
    loginBox.classList.add("hidden");
    logoutBox.classList.remove("hidden");
  }
});

forgetSendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('forgetEmail').value.trim();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const findUser = users.find((u) => u.email === emailInput);

  if (!findUser) {
    alert("Email không tồn tại trong hệ thống!");
    return;
  }
  const templateParams = {
    name: findUser.username,
    email: findUser.email,
    passcode: findUser.password
  }
    emailjs.send("service_03w9j3g", "template_30orxqp", templateParams)
    .then(response => {
      console.log("Email sent:", response.status, response.text);
      alert("Vui lòng kiểm tra email để lấy lại mật khẩu!");
      forgetBox.classList.add("hidden");
      loginBox.classList.remove("hidden");
    })
    .catch(error => {
      console.error("Email error:", error);
      alert("Gửi email thất bại. Vui lòng thử lại sau!");
    });
});
