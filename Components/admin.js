var show_Prod = document.getElementById("show_Prod");
firebase
  .database()
  .ref("Dishes")
  .once("value", (snap) => {
    var dishes = Object.values(snap.toJSON());
    console.log(dishes);
    dishes.forEach((dishval) => {
      show_Prod.innerHTML += `
    <tr>
    <td>${dishval.Dish_Name}</td>
    <td>${dishval.Dish_Pirce}</td>
    <td>${dishval.Dish_Quantity}</td>
    <td>${dishval.Dish_Id}</td>
    <td><img src=${dishval.Img_Url} height= '100px'></td>
    <td><button class='btn btn-info' onclick='edit_dish(this)' id=${dishval.Dish_Id} >Edit Product</button></td>
    <td><button class='btn btn-danger' id=${dishval.Dish_Id} onclick='delete_dish(this)'>Delete Product</button></td>
    </tr>
    `;
    });
  });
const delete_dish = (e) => {
  console.log("delete_dish");
  console.log(e.id);
  firebase.database().ref("Dishes").child(e.id).remove();
  window.location.reload();
};



// ................Editing Dish Function Code..........................
var upload = document.getElementById("upload");

// Getting Image
var image = document.getElementById("image");
image.addEventListener("click", () => {
  image.onchange = (e) => {
    img_file = e.target.files;
    img_reader = new FileReader();
    img_reader.onload = () => {};
    img_reader.readAsDataURL(img_file[0]);
    // console.log(img_reader.result);
    console.log(img_file[0]);
    // console.log(img_file);
  };

});

//....................... Uploading Image
imgurl = "";
upload.addEventListener("click", (e) => {
    // Uploading to Server
  var uploaded_Img = firebase
    .storage()
    .ref("Images")
    .child(img_file[0].name)
    .put(img_file[0]);

// Taking snapshot of Image
uploaded_Img.on('statechange', (snap_Img) => {
    var prog_bar  =document.getElementById('progress');
// console.log(prog_div)
    var progress = (snap_Img.bytesTransferred / snap_Img.totalBytes)*100
    // console.log(progress)
    if(progress >0){
        prog_bar.style.display = 'block';
        prog_bar.value  =progress

    }
//  prog_div.style.animationDuration = '15s'   
})

// Geting Image FROM Server
  uploaded_Img.snapshot.ref.getDownloadURL().then((url) => {
    console.log(url);
    imgurl = url;
    console.log(imgurl);
  });
});
// .................................Main Editing Function
const edit_dish = async (e) => {
  //   console.log(e.id);
  var edit_form = document.getElementById("edit_form");
  edit_form.style.display = "block";

  // .....................Editing Dish Process..................
  var dishname = document.getElementById("Productname");
  var price = document.getElementById("price");
  var quantity = document.getElementById("quantity");
  var old_url;
  console.log(dishname)
  // getting object from database
await  firebase
    .database()
    .ref("Dishes")
    .child(e.id)
    .once("value", function (data_snap) {
      var data = Object.values(data_snap.toJSON());
      console.log(data);
      console.log(data[2]);
      dishname.value = data[1];
      price.value = data[2];
      quantity.value = data[3];
      old_url = data[4];
    });

  // Saving changes to database
  var save = document.getElementById("save");
  save.addEventListener("click",async () => {
    console.log("save");
  await  firebase
      .database()
      .ref("Dishes")
      .child(e.id)
      .update({
        Dish_Name: dishname.value,
        Dish_Pirce: price.value,
        Dish_Quantity: quantity.value,
        Img_Url: imgurl == "" ? old_url : imgurl,
      });
      window.location.reload()
  });
};
