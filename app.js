// console.log(firebase.auth())

var email = document.getElementById("email");
var password = document.getElementById("password");
var Uname = document.getElementById("name");
var role = document.getElementsByName("role");
var signUp = document.getElementById("signUp");
var login = document.getElementById("login");
console.log(role);
var roleval = "";
signUp.addEventListener("click", function () {
  for (var i = 0; i < role.length; i++) {
    console.log(role[i]);
    if (role[i].checked) {
      roleval = role[i].value;
      // console.log(roleval);
      break;
    }
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((user) => {
      console.log(user);
      console.log(user.user.uid);
      var obj = {
        User_Name: Uname.value,
        Email: email.value,
        password: password.value,
        Uid: user.user.uid,
        Role: roleval,
      };

      if (roleval == "") {
        alert("Please select a role");
      } else if (roleval == "admin") {
        alert("Account created as admin");
        firebase.database().ref("Admin/").child(user.user.uid).set(obj);
      } else if (roleval == "user") {
        alert("Account created as User");
        firebase.database().ref("User/").child(user.user.uid).set(obj);
      }
      // for storing uid of Current User in local storage
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then((user) => {
          console.log(user);
          console.log(user.user.uid);
        })
        .catch((err) => {
          console.log(err);
        });
    })

    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
});

login.addEventListener("click", () => {
  var lemail = document.getElementById("lemail");
  var lpassword = document.getElementById("lpassword");
  var lname = document.getElementById("lname");
  for (var i = 0; i < role.length; i++) {
    console.log(role[i]);
    if (role[i].checked) {
      roleval = role[i].value;
      console.log(roleval);
      break;
    }
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(lemail.value, lpassword.value)
    .then((user) => {
      // console.log(user.user.uid);
      // console.log(user);
      // console.log(user.user);

      if (roleval == "") {
        alert("Please select a role");
      } else if (roleval == "ladmin") {
        alert("Sign In as admin");
        window.location = "Components/admin.html";
        localStorage.setItem("uid", user.user.uid);
      } else if (roleval == "luser") {
        alert("Sign In as User");
        window.location = "Components/user.html";
        localStorage.setItem("uid", user.user.uid);
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Sign In failed");
      alert(err.message);
    });
});

var showcards = document.getElementById("showcards");
console.log(showcards);

firebase
  .database()
  .ref("Dishes")
  .once("value", (snapData) => {
    var data = Object.values(snapData.toJSON());
    console.log(data);
    data.forEach((dish) => {
      showcards.innerHTML += `
 <div class="col col-lg-3 col-md-4 col-sm-6 col-12 m-2">
 <div class="card" style="width: 18rem;">
  <img src="${dish.Img_Url}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${dish.Dish_Name}</h5>
    <p class="card-text">Price :${dish.Dish_Pirce}</p>
    <p class="card-text">Product Quantity Available: ${dish.Dish_Quantity}</p>
    <p class="card-text"> <h5>Product Description </h5> Available: ${dish.Product_Desc}</p>
  
    <a href="#" class="btn btn-primary">Order Now</a>
  </div>
 </div>
 </div>
 `;
    });
  });
