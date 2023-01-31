var showdata = document.getElementById("showdata");
// console.log(showdata)
firebase
  .database()
  .ref("Dishes")
  .once("value", (data) => {
    var parseData = Object.values(data.toJSON());
    console.log(parseData);
    parseData.forEach((getdata) => {
      showdata.innerHTML += `
        <div class="col col-sm-6 col-md-4 col-lg-3 col-12 m-2">
        <div class="card" style="width: 18rem;" >
  <img src="${getdata.Img_Url}" class="card-img-top" alt="..." >
  <div class="card-body">
    <h5 class="card-title">${getdata.Dish_Name}</h5>
    <p class="card-text">Price of One ${getdata.Dish_Name} is ${getdata.Dish_Pirce}</p>
    <p class="card-text">Available ${getdata.Dish_Name} quantity is ${getdata.Dish_Quantity}</p>
    <p class="card-text"> <h6>Product Description</h6> ${getdata.Product_Desc}</p>  
    <a href="#" class="btn btn-primary" onclick='order(this)' id=${getdata.Dish_Id}>Order</a>
  </div>
</div>
</div>`;
    });
  });

const order = (e) => {
  var db = firebase.database();
  console.log("Order");

  var get_qty = parseInt(prompt("Enter quantity Your order"));
  console.log(get_qty);

  // Getting Key 1.Random Key  2.User_UID  3.Product_ID
  var randomKey = firebase.database().ref("Order").push().getKey();
  console.log(randomKey);
  var get_UserId = localStorage.getItem("uid");
  console.log(get_UserId);
  console.log(e.id);

  db.ref("Dishes")
    .child(e.id)
    .once("value", async (dishData) => {
      data = Object.values(dishData.toJSON());
      console.log(data);

      await db.ref("Order").child(randomKey).set({
        Dish_Name: data[1],
        Dish_Price: data[2],
        Dish_Quantity: get_qty,
        Img_Url: data[4],
        User_ID: data[6],
        Product_ID: data[0],
        Order_ID: randomKey,
        Order_Status: "Ordered",
      });

      await db
        .ref("User")
        .child(get_UserId)
        .child("MyOrder")
        .child(randomKey)
        .set({
          Dish_Name: data[1],
          Dish_Price: data[2],
          Dish_Quantity: get_qty,
          Img_Url: data[4],
          User_ID: data[6],
          Product_ID: data[0],
          Order_ID: randomKey,
          Order_Status: "Ordered",
        });
    });
  // window.location = 'User_Order.html'
};
