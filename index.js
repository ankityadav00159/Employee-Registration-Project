// Start for control coding

let addBtn = document.querySelector("#add-btn");
let modal = document.querySelector(".modal");
let closeBtn = document.querySelector(".close-icon");

addBtn.onclick = function(){
    modal.classList.add("active");
    registerForm.reset();
    // Display default avatar image
    profile_pic.src = "Image/Avatar.jpg";
};

closeBtn.addEventListener("click", ()=>{
    modal.classList.remove("active");
});

// Start all global variable

let userData = [];
let profile_pic = document.querySelector("#profile-pic");
let uploadPic = document.querySelector("#upload-field");
let registerBtn = document.querySelector("#register-btn");
let updateBtn = document.querySelector("#update-btn");
let registerForm = document.querySelector("#registerform");
let imgUrl;

// End global variable

//Start register coding

registerBtn.onclick = function(e){
    e.preventDefault();
    registrationData();
    getDataformLocal();
    registerForm.reset();
    closeBtn.click();
}

// Add this function to handle updates
updateBtn.onclick = function(e){
    e.preventDefault();
    let id = document.querySelector("#id").value;
    let index = parseInt(localStorage.getItem("updateIndex"));
    
    // Update the userData array with new values
    userData[index] = {
        id: id,
        firstname: document.querySelector("#name").value,
        lastName: document.querySelector("#lname").value,
        officeCode: document.querySelector("#officecode").value,
        jobtitle: document.querySelector("#jobtitle").value,
        email: document.querySelector("#email").value,
        profilePic: imgUrl == undefined ? "Image/Avatar.jpg" : imgUrl
    };

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Refresh the table
    getDataformLocal();

    // Reset the form and close modal
    registerForm.reset();
    closeBtn.click();
}

if(localStorage.getItem("user") != null){
    userData = JSON.parse(localStorage.getItem('user'));
}

const registrationData = ()=>{
    let idEl  = document.querySelector("#id").value;
    let fnameEl = document.querySelector("#name").value;
    let lastNameEl = document.querySelector("#lname").value;
    let officeCodeEl = document.querySelector("#officecode").value;
    let jobTitleEl = document.querySelector("#jobtitle").value;
    let emailEl = document.querySelector("#email").value;

    userData.push({
        id: idEl,
        firstname: fnameEl,
        lastName: lastNameEl,
        officeCode: officeCodeEl,
        jobtitle: jobTitleEl,
        email: emailEl,
        profilePic: imgUrl == undefined ? "Image/Avatar.jpg" :imgUrl
    });

    let userString = JSON.stringify(userData);
    localStorage.setItem("user", userString);
    swal("Good job!", "Registration Success!", "success");
};

//start returning data on page from localstorage

let tableData = document.querySelector("#table-data");
const getDataformLocal = ()=>{
    tableData.innerHTML = "";
    userData.forEach((data,index)=>{
        tableData.innerHTML += `<tr index='${index}'>
        <td>${index+1}</td>
        <td><img src="${data.profilePic}" width="40" height="40"></td>
        <td>${data.id}</td>
        <td>${data.firstname}</td>
        <td>${data.lastName}</td>
        <td>${data.email}</td>
        <td>${data.officeCode}</td>
        <td>${data.jobtitle}</td>
        <td>
            <button class="edit-btn"><i class="fa fa-eye"></i></button>
            <button class="del-btn" style="background-color: #EE534F;"><i class="fa fa-trash"></i></button>
        </td>
    </tr>`;
    });

    //  start delete coding in table data
    let i;
    let allDelBtn = document.querySelectorAll(".del-btn");
    for(i=0; i<allDelBtn.length; i++){
        allDelBtn[i].onclick = function(){
            let tr = this.parentElement.parentElement;
            let id = tr.getAttribute("index");
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this imaginary file!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    userData.splice(id,1);
                    localStorage.setItem("user", JSON.stringify(userData));
                    tr.remove();
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("Your imaginary file is safe!");
                }
            });
        };
    }

    //start coding for update data in table

    let allEdit = document.querySelectorAll(".edit-btn");
    for (let i = 0; i < allEdit.length; i++) {
        allEdit[i].onclick = function () {
            let tr = this.parentElement.parentElement;
            let td = tr.getElementsByTagName("TD");
            let index = tr.getAttribute("index");
            let imgTag = td[1].getElementsByTagName("IMG");
            let profilePic = imgTag[0].src;
            let id = td[2].innerHTML;
            let name = td[3].innerHTML;
            let l_name = td[4].innerHTML;
            let email = td[5].innerHTML;
            let officeCode = td[6].innerHTML;
            let jobTitle = td[7].innerHTML;

            let currentEmployee = {
                id: id,
                firstname: name,
                lastName: l_name,
                officeCode: officeCode,
                jobtitle: jobTitle,
                email: email,
                profilePic: profilePic
            };
    
            // Store the current employee's data in localStorage temporarily
            localStorage.setItem("currentEmployee", JSON.stringify(currentEmployee));
    
            document.getElementById("id").value = id;
            document.getElementById("name").value = name;
            document.getElementById("lname").value = l_name;
            document.getElementById("officecode").value = officeCode;
            document.getElementById("jobtitle").value = jobTitle;
            document.getElementById("email").value = email;

            // Set profile picture
            if (currentEmployee.profilePic !== "Image/Avatar.jpg") {
                profile_pic.src = currentEmployee.profilePic;
            } else {
                // Display default avatar image
                profile_pic.src = "Image/Avatar.jpg";
            }
    
            modal.classList.add("active");
    
            // Set the update index
            localStorage.setItem("updateIndex", index);
    
            registerBtn.disabled = true;
            updateBtn.disabled = false;            
        };
    }

    closeBtn.addEventListener("click", () => {
        localStorage.removeItem("currentEmployee");
    });
    
};

getDataformLocal();

//profile image processing

uploadPic.onchange = function(){
    if(uploadPic.files[0].size < 1000000){

        let freader = new FileReader();
        freader.onload = function(e){
            imgUrl = e.target.result;
            profile_pic.src = e.target.result;
        };
        freader.readAsDataURL(uploadPic.files[0]);

    }else{
        alert("Image size should be less than 1 mb");
    }
};

// start search coding

let searchEl = document.querySelector("#empid")
searchEl.oninput = function(){
    searchFuc();
}

function searchFuc() {
    let tr = tableData.querySelectorAll("TR");
    let filter = searchEl.value.toLowerCase();
    let i;
    for (i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("TD");
        let rowText = "";
        for (let j = 0; j < td.length; j++) {
            rowText += td[j].textContent.toLowerCase() + " ";
        }
        if (rowText.indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

// start clear all data

let delAllBtn = document.querySelector("#del-all-btn")
let delAllbox = document.querySelector("#del-all-box")

delAllBtn.addEventListener("click", ()=>{
    if(delAllbox.checked == true){
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                localStorage.removeItem("user")
                window.location = location.href
                swal("Poof! Your imaginary file has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your imaginary file is safe!");
            }
        });
    }else{
        swal("Check the box", "Please check the box to delete data", "warning");
    }
})
