// console.log(firebase.auth())

var email = document.getElementById("email");
var password = document.getElementById("password");
var Uname = document.getElementById("name");
var role = document.getElementsByName("role");
var signUp = document.getElementById("signUp");
var login = document.getElementById("login");
// Geeting Alert
var success = document.getElementById("success");
var suc_msg = document.getElementById("suc_msg");

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
        suc_msg.innerText = "Congratulations..! Account created as admin";
        success.classList.remove("hide");
        setTimeout(() => {
          success.classList.add("hide");
        }, 2000);
        firebase.database().ref("Admin/").child(user.user.uid).set(obj);
      } else if (roleval == "user") {
        alert("Account created as User");
        suc_msg.innerText = "Congratulations..! Account created as User";
        success.classList.remove("hide");
        setTimeout(() => {
          success.classList.add("hide");
        }, 2000);
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
        suc_msg.innerText = "Sign In as Admin";
        success.classList.remove("hide");
        setTimeout(() => {
          success.classList.add("hide");
        }, 2000);
        window.location = "Components/admin.html";
        localStorage.setItem("uid", user.user.uid);
      } else if (roleval == "luser") {
        alert("Sign In as User");
        suc_msg.innerText = "Sign In as User";
        success.classList.remove("hide");
        setTimeout(() => {
          success.classList.add("hide");
        }, 2000);
        window.location = "index.html";
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
{/* <p class="card-text"> <h5>Product Description </h5> Available: ${dish.Product_Desc}</p> */}

firebase
  .database()
  .ref("Dishes")
  .once("value", (snapData) => {
    var data = Object.values(snapData.toJSON());
    console.log(data);
    data.forEach((dish) => {
      showcards.innerHTML += `
 <div class="col col-lg-3 col-md-4 col-sm-6 col-12 my-2" ml-1>
 <div class="card" style="width: 18rem;">
  <img src="${dish.Img_Url}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${dish.Dish_Name}</h5>
    <p class="card-text">Price :${dish.Dish_Pirce}</p>
    <p class="card-text">Product Quantity Available: ${dish.Dish_Quantity}</p>
    <a href="#" class="btn btn-primary" onclick='order(this)' id='${dish.Dish_Id}'>Order Now</a>
  </div>
 </div>
 </div>
 `;
    });
  });

const order = async (e) => {
  // getting Dynamic Quantiy
  var qty = parseInt(prompt("Enter Quantiy You want to Order"));
  console.log(qty);

  console.log(e.id);
  var userID = localStorage.getItem("uid");
  console.log(userID);
  var key = firebase.database().ref("Order").push().getKey();
  console.log(key);

  firebase
    .database()
    .ref("Dishes")
    .child(e.id)
    .once("value", async (snapData) => {
      var data = Object.values(snapData.toJSON());
      console.log(data);
      var flag = false;
      await firebase.database().ref("Order").child(key).set({
        Order_ID: key,
        User_ID: userID,
        Product_ID: e.id,
        Order_Name: data[1],
        Order_Price: data[2],
        Order_Quantity: qty,
        Order_Img: data[4],
        Order_Desc: data[5],
        Order_Status: "Ordered",
      });

      await firebase
        .database()
        .ref("User")
        .child(userID)
        .child("MyOrder")
        .child(key)
        .set({
          Order_ID: key,
          User_ID: userID,
          Product_ID: e.id,
          Order_Name: data[1],
          Order_Price: data[2],
          Order_Quantity: qty,
          Order_Img: data[4],
          Order_Desc: data[5],
          Order_Status: "Ordered",
        });
      flag = true;

      if (flag == true) {
        // alert("Order successfully Placed");
        // Show Dynamically Alerts
        suc_msg.innerText = "Order successfully Placed";
        success.classList.remove("hide");
        setTimeout(() => {
          success.classList.add("hide");
        }, 2000);
      }
    });
};
