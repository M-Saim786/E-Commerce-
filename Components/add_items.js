var dish_name = document.getElementById("dish");
var dish_price = document.getElementById("price");
var dish_qty = document.getElementById("quantity");
var desc =document.getElementById("desc")
var uploadImg = document.getElementById("upload");
var imgInp = document.getElementById("imgInp");
var submit = document.getElementById("submit");

// console.log(dish_name , dish_price, dish_qty , uploadImg, submit);

imgInp.addEventListener("click", function () {
  // console.log('click')
  imgInp.onchange = (e) => {
    imgFile = e.target.files;
    var imgreader = new FileReader();
    // console.log(imgreader.result)
    imgreader.onload = function () {};
    imgreader.readAsDataURL(imgFile[0]);
    // console.log(imgreader.result)
    console.log(imgFile);
    console.log(imgFile[0]);
    console.log(imgFile[0].name);
  };
});

uploadImg.addEventListener("click", function () {
  var imgUpload = firebase
    .storage()
    .ref("Images/")
    .child(imgFile[0].name)
    .put(imgFile[0]);

  imgUpload.on("statechanged", (snapshot) => {
    var  progB=document.getElementById("progB");

    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if (progress >0) {
    progB.style.display = 'block'
    progB.value =progress
      
    }
    if (progress < 100) {
      console.log(progress);
      uploadImg.innerText = "Uploading image";
      uploadImg.classList.add("btn-success");
    }
    if (progress == 100) {
    //   alert("Upload complete");
      uploadImg.innerText = "Uploaded image";
      uploadImg.classList.remove("btn-success");
    }
  });
  imgUpload.snapshot.ref.getDownloadURL().then((getUrl) => {
     imgUrl = getUrl;
  });
});

// getting uid from localStorage
var user_uid = localStorage.getItem("uid");
console.log(user_uid);
// Dish ko add krny ka function
submit.onclick = async () => {
  console.log(dish_name);
  var db = firebase.database();
  // generating random uid
  var key = db.ref("Dishes").push().getKey();
  console.log(key);
  console.log(imgUrl);

 await db.ref("Dishes").child(key).set({
    Dish_Name: dish_name.value,
    Dish_Pirce: dish_price.value,
    Dish_Quantity: dish_qty.value,
    Product_Desc :desc.value,
    User_ID: user_uid,
    Dish_Id: key,
    Img_Url:imgUrl
  });

  window.location  ='product.html'
};
