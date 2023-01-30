var seeOrder = document.getElementById("seeOrder");
console.log(seeOrder);

firebase
  .database()
  .ref("Order")
  .once("value", (snap) => {
    var data = Object.values(snap.toJSON());
    console.log(data);
    data.map((dataval) => {
      // console.log('value')
      seeOrder.innerHTML += `
    <tr>
    <td>${dataval.Dish_Name}</td>
    <td>${dataval.Dish_Price}</td>
    <td>${dataval.Dish_Quantity}</td>
    <td><img src=${dataval.Img_Url} height='100px'></td>
    <td>${dataval.Order_ID}</td>
    <td>${dataval.Product_ID}</td>
    <td>${dataval.Order_Status}</td>
  <td id=${dataval.User_ID}>
  <select name="" id="${dataval.Order_ID}" onchange='orderstat(this)'>
  <option selected disabled>Select Status</option>
  <option value="Delete">Delete</option>
  <option value="Reject">Reject</option>
  <option value="Process">Process</option>
  <option value="Picked">Picked</option>
  <option value="Delivered">Delivered</option>
</select>
</td>
</tr>`;
    });
  });

const orderstat = async (e) => {
  console.log(e.id);
  console.log(e.value);
  await firebase.database().ref("Order").child(e.id).update({
    Order_Status: e.value,
  });

  await firebase
    .database()
    .ref("User")
    .child(e.parentNode.id)
    .child("MyOrder")
    .child(e.id)
    .update({
      Order_Status: e.value,
    });
  console.log(e.parentNode.id);
};
