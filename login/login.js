
/* =============== form box style================= */
   var a = document.getElementById("loginBtn");
    var b = document.getElementById("registerBtn");
    var x = document.getElementById("login");
    var y = document.getElementById("register");
    function login() {
        document.getElementById("login").style.display = "block";
        document.getElementById("register").style.display = "none";
        x.style.left = "4px";
        y.style.right = "-520px";
        a.className += " white-btn";
        b.className = "btn";
        x.style.opacity = 1;
        y.style.opacity = 0;
    }
    function register() {
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "block";
        x.style.left = "-510px";
        y.style.right = "5px";
        a.className = "btn";
        b.className += " white-btn";
        x.style.opacity = 0;
        y.style.opacity = 1;
    }
/* =============== form box validation================= */
const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const validatePassword = (pwd) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(pwd);

const validateName = (name) => /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/.test(name);

/* =============== Sign Up Function ================= */
/* =============== Sign Up Function ================= */
const signUp = (e) => {
    e.preventDefault();
    let form = document.getElementById('register');
    let fname = form.querySelector('#fname'),
        lname = form.querySelector('#lname'),
        email = form.querySelector('#email'),
        pwd = form.querySelector('#pwd');

    let fnameVal = fname.value.trim(),
        lnameVal = lname.value.trim(),
        emailVal = email.value.trim(),
        pwdVal = pwd.value.trim();

    console.log("Email entered for signup:", emailVal);

    [fname, lname, email, pwd].forEach(field => field.style.border = "");

    if (!validateName(fnameVal) || !validateName(lnameVal)) {
        alert("❌ First name and last name must contain only letters.");
        fname.style.border = lname.style.border = "2px solid red";
        return;
    }

    if (!validateEmail(emailVal)) {
        alert("❌ Please enter a valid email address.");
        email.style.border = "2px solid red";
        return;
    }

    if (!validatePassword(pwdVal)) {
        alert("❌ Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
        pwd.style.border = "2px solid red";
        return;
    }
    let formData = JSON.parse(localStorage.getItem('formData')) || [];

    let exist = formData.some(data => data.email.toLowerCase() === emailVal.toLowerCase());
    
    if (!exist) {
        formData.push({ fname: fnameVal, lname: lnameVal, email: emailVal, pwd: pwdVal });
        localStorage.setItem('formData', JSON.stringify(formData));
    
        // ✅ إزالة التحديد الأحمر من البريد بعد نجاح التسجيل
        email.style.border = "";
        let form = document.querySelector("#register form");
        form.reset();
        alert("✅ Account created successfully! You can now log in.");
    } else {
        alert("⚠️ This email is already registered! Please log in.");
        email.style.border = "2px solid red";
    }
    
};


/* =============== Sign In Function ================= */
const signIn = (event) => {
    event.preventDefault();

    let form = document.getElementById('login');
    let emailOrUsername = form.querySelector('#email'),
        pwd = form.querySelector('#pwd'),
        rememberMe = form.querySelector('#login-check').checked;

    let emailOrUsernameValue = emailOrUsername.value.trim();
    let pwdValue = pwd.value.trim();

    console.log("Email entered for login:", emailOrUsernameValue);

    emailOrUsername.style.border = "";
    pwd.style.border = "";

    if (emailOrUsernameValue === "" || pwdValue === "") {
        alert("❌ Please fill in all fields!");
        if (emailOrUsernameValue === "") emailOrUsername.style.border = "2px solid red";
        if (pwdValue === "") pwd.style.border = "2px solid red";
        return;
    }

    let formData = JSON.parse(localStorage.getItem('formData')) || [];
    let user = formData.find(data => 
        data.email.toLowerCase() === emailOrUsernameValue.toLowerCase() ||
        data.fname.toLowerCase() === emailOrUsernameValue.toLowerCase()
    );

    if (!user) {
        alert("❌ No account found with this email or username.");
        emailOrUsername.style.border = "2px solid red"; 
        return;
    }

    if (user.pwd !== pwdValue) {
        alert("❌ Incorrect password! Please try again.");
        pwd.style.border = "2px solid red"; 
        return;
    }

    // ✅ حفظ اسم المستخدم في localStorage
    localStorage.setItem('loggedInUser', JSON.stringify({ fname: user.fname }));

    alert(`✅ Welcome, ${user.fname}! Redirecting...`);

    if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email: emailOrUsernameValue, password: pwdValue }));
    } else {
        localStorage.removeItem('rememberedUser');
    }

    emailOrUsername.style.border = "";
    pwd.style.border = "";

    setTimeout(() => {
        window.location.href = "/home/home.html";
    }, 1000);     
};

/* =============== remember Function ================= */
window.onload = () => {
    let rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
    if (rememberedUser) {
        document.getElementById('email').value = rememberedUser.email;
        document.getElementById('pwd').value = rememberedUser.password;
        document.getElementById('login-check').checked = true;
    }
};









