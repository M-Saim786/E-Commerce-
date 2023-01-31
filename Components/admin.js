var show_admin =document.getElementById("show_admin")
console.log(show_admin)
var get_UID = localStorage.getItem("uid")
firebase.database().ref('Admin').child(get_UID).once('value',(snapshot) => {
 var data = Object.values(snapshot.toJSON())   
 console.log(data)

     show_admin.innerHTML = `
     <tr>
     <th>User name</th>
     <td> ${data[3]}</td>
     </tr>
     <tr>
     <th>Admin Email</th>
     <td> ${data[0]}</td>
     </tr>
     <tr>
     <th>Admin Password</th>
     <td> ${data[4]}</td>
     </tr>
    

     `


})