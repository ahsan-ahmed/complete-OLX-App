// Initialize Firebase
var config = {
  apiKey: "AIzaSyDk6v6fSblQrd1nLw9QGsoGs-1UuzeYzPU",
  authDomain: "readandwritedata-27907.firebaseapp.com",
  databaseURL: "https://readandwritedata-27907.firebaseio.com",
  projectId: "readandwritedata-27907",
  storageBucket: "readandwritedata-27907.appspot.com",
  messagingSenderId: "526759719465"
};
firebase.initializeApp(config);
const db = firebase.firestore();
const messaging = firebase.messaging();

function signUp(){
var firstName=document.querySelector('.firstname').value;
var lastName=document.querySelector('.lastname').value;
var email=document.querySelector('.email').value;
var pass=document.querySelector('.pass').value;
var file = document.querySelector('.imageId').files[0] // use the Blob or File API
emptyErrorFields();
    return new Promise((resolve,reject)=>{
   if(firstName.trim().length>=4 && file){     
   firebase.auth().createUserWithEmailAndPassword(email,pass)
   .then((res)=>{
      resolve(res);
}).catch((error)=>{
 // Handle Errors here.
var errorCode = error.code;
var errorMessage = error.message;
reject(errorMessage);
  // ...
})
}else{
    alert("all fields are required")
}
   })
}

async function signUpInner(){
    var firstName=document.querySelector('.firstname').value;
    var lastName=document.querySelector('.lastname').value;
    var email=document.querySelector('.email').value;
    var pass=document.querySelector('.pass').value;
    await signUp().then((res)=>{
    var storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('users/image_'+ Math.random().toString().substring(2, 6) +'.jpg');
    var file = document.querySelector('.imageId').files[0] // use the Blob or File API
        imageUrl(imagesRef,file).then(userUrl=>{
            console.log("userImage>>>>",userUrl);
    db.collection('users').doc(res.user.uid).set({fullname:`${firstName} ${lastName}`,email,userUrl}).then(chal=>{
        console.log(res);
        location.href=("signin.html");
        })
    });
    }).catch((errorMessage)=>{
       console.log(errorMessage);
    var firebaseRes=document.querySelector('.firebase-res');
    firebaseRes.innerHTML=errorMessage;
    firebaseRes.style.color='red'
   
})
}

function emptyErrorFields()
{
    var firebaseRes=document.querySelector('.firebase-res');
      firebaseRes.innerHTML='';
}

function checkUserSignIn(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        //already signin user
        alert("you already signin \nfirst signout please \nthen login another account");
             userUidSaveInDb();
        }
        else {
          //No user is signed in.
        userUidSaveInDb();
           location.href="templates/signin.html";
        }
     });
}
function  checkUserSignInTemplates(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        //already signin user
       alert("you already signin \nfirst signout please \nthen login another account");
       userUidSaveInDb();
        }
        else {
          // No user is signed in.
         userUidSaveInDb();
           location.href="signin.html";
        }
    });
}
function userUidSaveInDb(){
    var currentUserUidCheck=localStorage.getItem("currentUserUidCheck");
    if(currentUserUidCheck!==""){
        var accountHead=document.getElementById('account-h4');
        accountHead.setAttribute("onclick","");
        accountHead.setAttribute("style","");
    }
}

function signIn(){
    var email=document.querySelector('.email').value;
    var pass=document.querySelector('.pass').value;
    var firebaseRes=document.querySelector('.firebase-res');
    emptyErrorFields();
    firebase.auth().signInWithEmailAndPassword(email,pass)
    .then((res)=>{
        //console.log(res);
      location.href=('../index.html');
      localStorage.setItem("currentUserUidCheck",firebase.auth().currentUser.uid);

    }).catch((error)=>{
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        firebaseRes.innerHTML=errorMessage;
        firebaseRes.style.color='red'
    // ...
    })
}

function signout(){
    firebase.auth().signOut()
    .then((res)=>{
        alert('signout successfully');
        localStorage.setItem("currentUserUidCheck","");
        location.reload();
}).catch(function(error) {
        alert('no login user!!');
        console.log(error.message);
      })
}

function gotoCategoryPage(){
     location.href='templates/insertCate.html';
}

function imageUrl(imagesRef,file){
                return new Promise((resolve, reject) => {
           imagesRef.put(file)
            .then(function(snapshot) {
            //console.log('Uploaded a blob or file!', snapshot);
            imagesRef.getDownloadURL()
            .then(function(url) {
                resolve(url);
                 //console.log('URL *****', url)
              }).catch(function(error) {
                // Handle any errors
              });
        }).catch((error) => {
            console.log('bhai kuch masla hai', error.message)
            errorLogin.innerHTML='bhai pehle login ker -_- <br>phir ad submit ker!';
            errorLogin.style.color='red';

        });
    })
}

function addCategory(){
    var name=document.querySelector('.name').value;
    var categories=document.querySelector('.categories').value;
    var longDescription=document.querySelector('.longDescription').value;
    var price=document.querySelector('.price').value;
    var model=document.querySelector('.model').value;
    var year=document.querySelector('.year').value;
    var file = document.querySelector('.imageId').files[0] // use the Blob or File API
    
    var labelName=document.querySelector('.labelName');
    var labelCategories=document.querySelector('.labelCategories');
    var labelLongDescription=document.querySelector('.labelLongDescription');
    var labelYear=document.querySelector('.labelYear');
    var labelModel=document.querySelector('.labelModel');
    var labelPrice=document.querySelector('.labelPrice');
    var errorLogin=document.querySelector('.errorLogin');
    var pictureError=document.querySelector('.picture');
    if(name==''){
     labelName.style.color='red';
    }
    if( categories==''){
        labelCategories.style.color='red';
    }
    if(longDescription==''){
        labelLongDescription.style.color='red';
       }
       if(price==''){
        labelPrice.style.color='red';
       }
    if(model==''){
     labelModel.style.color='red';
    }
    if(year==''){
     labelYear.style.color='red';
    }
    if(!file){
        pictureError.style.color='red';
       }
       if(name==''||categories==''||longDescription==''||price==''||model==''||year==''||!file){
        alert("all fields are required");
        return;
    }
    window.addEventListener("load", function(event) {
        alert("All resources finished loading!");
      });
    
    var storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('images/ads_'+ Math.random().toString().substring(2, 6) +'.jpg');
           imageUrl(imagesRef,file).then((url) => {
         console.log('addService image url', url)
        db.collection('users').doc(firebase.auth().currentUser.uid).get().then(respond=>{
            
         db.collection('tokens').where("email","==",firebase.auth().currentUser.email)
         .onSnapshot(querySnapshot=>{
            querySnapshot.forEach(doc=>{
        db.collection('adsUsers').add({name, categories,longDescription,price,model,year,url,receiverImgUrl:respond.data().userUrl,
            uid:firebase.auth().currentUser.uid,adUsername:doc.data().name,adId:Math.random().toString().substring(2, 10),token:doc.data().token})
        .then((res)=>{
        localStorage.setItem('categoryClick',name+"s");
        location.href=("newPage.html");
              })
      .catch((error)=>{
       alert(error.message);
      })
    })
}) 
})       
})
}

// TODO add service worker code here
if ('serviceWorker' in navigator) {
    
    console.log('Service Workers is supported');
    // if service worker supported then register my service worker
        navigator.serviceWorker.register('firebase-messaging-sw.js').then(function (reg) {
            console.log('Successfully service worker  for push notification  Register :^)', reg);
        navigator.serviceWorker.register('./service-worker.js').then(function() {
            console.log('./service-worker.js Registered'); });
        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function (subscription) {
            console.log('subscription:', subscription.toJSON());
            // GCM were used this endpoint
            console.log('endpoint:', subscription.endpoint);
        });
  
    }).catch(function (error) {
        console.log('SW Registration Failed: :^(', error);
    });  

}
///////////////////////////////////////////////////
//////////////////////////////////////////////////

function searchCategory(){
  var olxBodyDomImage=document.querySelector('.olx-container-body-dom-image');
    var searchValue=document.querySelector('.olx-container-header-search').value;
  //console.log('search =>',searchValue);
    var body =document.querySelector(".olx-container-body");
    //console.log(olxBodyDomImage.childNodes.length);
    // if(olxBodyDomImage.childNodes.length>=0){

    //     olxBodyDomImage.parentNode.removeChild(olxBodyDomImage);
    // }

    db.collection('adsUsers').where('categories','==',searchValue)
    .onSnapshot((querySnapshot)=>{
        var figList=[];
        var cities = [];
        querySnapshot.forEach((doc)=>{
            var img=document.createElement('img');
            var div=document.createElement('div');
            var figure=document.createElement('figure');
            var figcaption=document.createElement('figcaption');
            figcaption.setAttribute('name',doc.data().name)
            cities.push(doc.data().name);
            console.log(doc.data().categories)

            figcaption.innerHTML='NAME :'+' '+doc.data().name.toUpperCase()+"<br>"+'PRICE :'+' '+doc.data().price.toUpperCase();
            figcaption.style.textAlign='center';
            figcaption.style.cursor="pointer"
            figcaption.style.background="#f8f8f8";
            figcaption.style.display="table-caption";
            figcaption.style.captionSide="bottom";
            figcaption.setAttribute("onmouseover","this.style.color='red'");
            figcaption.setAttribute("onmouseout","this.style.color='black'");

            img.src=doc.data().url;
            img.style.height="20vh";
            img.style.width="18vw";
            img.style.cursor="pointer";
            img.style.display="block";
            img.id="db-image";
            img.style.margin="0";
            img.style.padding="0";

            figure.style.margin="3px";
            figure.style.padding="0px";
            figure.style.marginBottom="12px"
            figure.style.display="table";
            figure.style.border="3px solid #f8f8f8"

            div.style.textAlign="center";
            cities.push(doc.data().name);
            div.style.alignItems="center";
            div.style.flex="1";
            div.style.margin="0";
            div.style.borderRadius="1em";
            div.style.padding="0";
            //div.id='db-div'

            figure.setAttribute('uid',doc.data().uid)
            figure.setAttribute('adId',doc.data().adId);
            figure.setAttribute('class',doc.data().adId);
            figure.setAttribute('onclick','userInfo(className)');
            figList.push(figure);
            figure.appendChild(img);
            figure.appendChild(figcaption);
            div.appendChild(figure);
            searchImageDiv.className='hide';
            olxBodyDomImage.appendChild(div);
     })
            console.log(figList);
        console.log("name", cities.join(", "));
    })
      
}


// function searchCategoryPage(){

// }
function globalCategory(name){
    location.href=("templates/newPage.html");
    localStorage.setItem('categoryClick',name);
}

function loading(){
    var olxBodyDomImage=document.querySelector('.olx-container-body-dom-image');
    var category=localStorage.getItem('categoryClick');
    var searchImageDiv=document.getElementById('search-image-div');
    var olxBodyDomImage=document.querySelector('.olx-container-body-dom-image');
    db.collection('adsUsers').where('categories','==',category.slice(0,length-1))
    .onSnapshot((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
        olxBodyDomImage.innerHTML+=`
        <div class="olxBodyDomDiv" >
        <figure class="olxBodyDomFigure">
        <img src=${doc.data().url} class="olxBodyDomImg" id="db-image" adId=${doc.data().adId} onclick="userInfo(${doc.data().adId})" >
        <input type="button" class="btn btn-danger" id="olxBodyDomBtn" value="Add To Favorite" onclick="offlineMode(${doc.data().adId})" >
        <figcaption class=olxBodyDomFigcaption onmouseover="this.style.color='red'" onmouseout="this.style.color='black'" onclick="userInfo(${doc.data().adId})">
        ${'NAME :'+' '+doc.data().name.toUpperCase()+"<br>"+'PRICE :'+' '+doc.data().price.toUpperCase()}
        </figcaption>
        </figure>
        </div>
        `
        searchImageDiv.className='hide';
        loaderfunc();
        })
    })
}

function offlineMode(number){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            db.collection('adsUsers').where("adId","==",number.toString()).get()
            .then(querySelector=>{
                //.where("uid","==",firebase.auth().currentUser.uid)
                querySelector.forEach(res=>{
                    console.log(res.data().url)
                   
    let adsArr = [];
    if(localStorage.getItem('ads')){
        adsArr = JSON.parse(localStorage.getItem('ads'));
    }
    for(let i=0; i < adsArr.length; i++){
        if(adsArr[i].adId ===res.data().adId ){
            alert('This ad was already save in your offline page');
            return false;
        }
    }
            const dataSnapshot = {
                Uid:res.data().uid,
                downloadURL: res.data().url,
                productCategory: res.data().categories,
                productDescription: res.data().longDescription,
                productModel: res.data().model,
                productName: res.data().name,
                productPrice: res.data().price,
              }         
            console.log(dataSnapshot);
            adsArr.push(dataSnapshot);
            localStorage.setItem('ads',JSON.stringify(adsArr))
            const req = new Request(res.data().url,{ mode: 'no-cors' });
            console.log(req)
            caches.open('v4')
                .then((cache)=>{
                    fetch(req)
                        .then((response)=>{
                            return cache.put(req,response);
                        })
                })
        })
    })
} else {
alert("signout")
            }
      });
}
const adsArr = JSON.parse(localStorage.getItem('ads'));
adsArr.forEach(res=>{
    caches.open('v4')
    .then((cache)=>{
        fetch(res.downloadURL,{mode:'no-cors'})
        .then((response)=>{
            return cache.put(res.downloadURL,response);
        })
    })
})

function renderSaveAds(){
    const mainContainer = document.querySelector('.container');
    const container = document.querySelector('#ads-container');
    if(!localStorage.getItem('ads')){
        alert('Nothing to show');
        mainContainer.innerHTML = `
            <h2 class="jumbotron text-center">Nothing to show</h2>
        `
        return false;
    }
    const adsArr = JSON.parse(localStorage.getItem('ads'));
    adsArr.forEach((ad)=>{
        container.innerHTML += `
        <div class="custom-card">
            <div class="custom-card-body">
                <div class="image-container" style="background-image:url('${ad.downloadURL}')">
                    <div class="price-label bg-primary">Rs.${ad.productPrice}</div>            
                </div>
                <div class="details">
                    <span>Product Category:</span>
                    <span>${ad.productCategory}</span>
                </div>
                <div class="details">
                    <span>Product Name:</span>
                    <span>${ad.productName}</span>
                </div>
                <div class="details">
                    <span>Product Model:</span>
                    <span>${ad.productModel}</span>
                </div>
                <div class="details">
                <span>Product Description:</span>
                <span>${ad.productDescription}</span>
                </div>
             </div>
        </div>
    `    
    })
}

function loaderfunc(){
    var loader=document.querySelector('.loader');
    console.log(loader)
    var searchImageDiv=document.getElementById('search-image-div');
    var body =document.querySelector(".olx-container-body");
    var olxBodyDomImage=document.querySelector('.olx-container-body-dom-image');
    setTimeout(function(){
       loader.className='none';
     },2000);
     searchImageDiv.className='hide';
      setTimeout(function(){
         console.log(olxBodyDomImage.childNodes.length);
        if(olxBodyDomImage.childNodes.length==1){
            searchImageDiv.className='';
            var para=document.createElement('p');
            para.innerHTML='Ooops, No Data Found. write in search bar!!'
            searchImageDiv.appendChild(para) }
    },2000)

}
    
function userInfo(className){
    console.log(className);
    localStorage.setItem("adIdAttribute",className);
    location.href=("../templates/userInfo.html")
}
function userAllInfo(){
     var checkUser=localStorage.getItem("adIdAttribute");
     var olxBody=document.querySelector('.olx-container-body');
     olxBody.textAlign="center";
     var div1=document.querySelector('.div1');
     var div3=document.querySelector('.div3');
     var div30=document.querySelector('.div30');
     var div4=document.querySelector('.div4');
     var div5=document.querySelector('.div5');
     var div6=document.querySelector('.div6');
     var div7=document.querySelector('.div7');

     var p1=document.querySelector('.p1');
     var p2=document.querySelector('.p2');
     var p3=document.querySelector('.p3');
     var p4=document.querySelector('.p4');
     var p5=document.querySelector('.p5');
     var p6=document.querySelector('.p6');
     div1.style.margin="0"
     div1.style.padding="0"
     db.collection('adsUsers').where("adId","==",checkUser)
     .onSnapshot((querySnapshot)=>{
     querySnapshot.forEach((doc)=>{
    var img=document.createElement('img');
    img.src=doc.data().url;
    img.setAttribute("adId",checkUser);
    img.id="userImage";
    img.style.border="1px solid"
    img.style.width='40vw';
    img.style.height="40vh";
    div1.appendChild(img);

    p1.innerHTML="NAME:"+"  "+doc.data().name.toUpperCase();
    p2.innerHTML="CATEGORIES:"+"  "+doc.data().categories.toUpperCase();
    p3.innerHTML="LONG DESCRIPTION:"+"  "+doc.data().longDescription.toUpperCase();
    p4.innerHTML="MODEL:"+"  "+doc.data().model.toUpperCase();
    p5.innerHTML="YEAR:"+"  "+doc.data().year;
    p6.innerHTML="PRICE:"+"  "+doc.data().price;
    p1.style.fontSize="60px;"
         div3.appendChild(p1);
         div30.appendChild(p6);
         div4.appendChild(p2);
         div5.appendChild(p3);
         div6.appendChild(p4);
         div7.appendChild(p5);
         })
    })
}
function chatWithUser(){
    var chatTextArea=document.querySelector(".send-notification-text");
    var chatTextAreaButton=document.querySelector(".send-notification-button");
    var chatTextAreaError=document.querySelector(".send-notification-text-error");
    var div1=document.querySelector('.div1');
    if(!chatTextArea.value){
     chatTextAreaError.innerHTML="This is required field";
     chatTextAreaError.style.color="red";
     chatTextArea.style.borderColor="red";
     chatTextAreaButton.style.marginTop="-10px";
     return
    }                    
    chatTextAreaError.innerHTML="";
    chatTextAreaError.style.color="";
    chatTextArea.style.borderColor="";      
    if(div1.hasChildNodes()==true){
        var adIdImage=document.getElementById('userImage');
        var adIdNum=adIdImage.getAttribute("adId");
        console.log(adIdNum);
    }
    db.collection('adsUsers').where("adId","==",adIdNum)
    .onSnapshot((querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
        firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            let user1=firebase.auth().currentUser.uid;
            let user2=doc.data().uid;
            console.log(user1);
            if(user1!==user2){
            db.collection('rooms').where("users","==",{[user1]:true,[user2]:true}).where("adId","==",adIdNum).get()
            .then((querySnapshot)=>{
            console.log(querySnapshot)
            if(querySnapshot.empty){
                console.log("room did not exist");
                db.collection('users').doc(user1).get()
                .then(mill=>{
                db.collection('rooms').add({users:{[user1]:true,[user2]:true},adId:adIdNum,
                category:doc.data().categories,price:doc.data().price,usersUid:{senderId:user1,receiverId:user2},
                usersName:{senderName:mill.data().fullname,receiverName:doc.data().adUsername},userImgUrls:{receiverImgUrl:doc.data().receiverImgUrl,senderImgUrl:mill.data().userUrl}})
                .then(res=>{
                console.log("roomId =>",res.id);
                db.collection('rooms').doc(res.id).collection('messages').add({message:chatTextArea.value,senderId:user1,receiverId:user2,timestamp:Date.now()});
                chatTabOpen(res.id);          
                })
            })   
        }    
            querySnapshot.forEach((doc)=>{
            chatTabOpen(doc.id);
            db.collection('rooms').doc(doc.id).collection('messages').add({message:chatTextArea.value,senderId:user1,receiverId:user2,timestamp:Date.now()})
                })
            })
        }
        else{
        alert("both user is same, it is not allowed");
        }    
    }
         else {
             console.log(" No user is signed in.") 
            }
        })  
    })
})
}

function chatPermission(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            messaging.requestPermission().then(function () {
                console.log('Notification permission granted.');
                return messaging.getToken();
              }).then(function (token) {
                // Displaying user token
                console.log('token >>>> ', token);
                db.collection('users').doc(firebase.auth().currentUser.uid).get()
                .then(res=>{
                    db.collection('tokens').doc(firebase.auth().currentUser.uid).set({name:res.data().fullname,email:res.data().email,token})
                    .then(respond=>{
                        console.log("suceessfully save in db");
                    })    
                    userImageShow();
            }).catch(function (err) { // Happen if user deney permission
                console.log('Unable to get permission to notify.', err);
              });
            })
               }
        else {
          console.log("No user is signed in."); 
          userImageShow();
        }
      });
}

function userSendText(){
var formControl=document.querySelector('.form-control');
var formControlComp=document.querySelector('.form-control').value;
var roomId=location.href;
var roomNum= roomId.substr(-20)
let currentUser= firebase.auth().currentUser.uid;
 //console.log(roomNum);
if(!formControlComp){
    formControl.style.borderColor="red";
    return false;
}
formControl.style.borderColor=""
 db.collection('rooms').doc(roomNum).get()
 .then(doc=>{
      // console.log(doc.data().userEmails.receiverId);     
        // console.log(firebase.auth().currentUser.email)
        let userIdChange=currentUser!==doc.data().usersUid.receiverId ? doc.data().usersUid.receiverId : doc.data().usersUid.senderId;
        db.collection('users').doc(currentUser).get()
       .then(respond=>{
        console.log(respond.data().fullname)
        db.collection('rooms').doc(roomNum).collection('messages').add({message:formControlComp,senderId:currentUser,
           receiverId:userIdChange,timestamp:Date.now()})
           .then(res=>{      
            formControl.value=""; 
     })
    })
})
return false;
}


function getMessages(){
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let currentUser= firebase.auth().currentUser.uid;
        var roomId=location.href;
        var roomNum= roomId.substr(-20);
        db.collection('rooms').doc(roomNum).get().then(res=>{

        db.collection('rooms').doc(roomNum).collection('messages').orderBy("timestamp","asc")
        .onSnapshot( querySnapshot=>{
            querySnapshot.docChanges().forEach(change=>{ 
                let senderId=change.doc.data().senderId;
                let receiverId=change.doc.data().receiverId;
                let senderImgUrl=res.data().userImgUrls.senderImgUrl;
                let receiverImgUrl=res.data().userImgUrls.receiverImgUrl;
            var chatBody=document.querySelector('.chat-body');
              chatBody.innerHTML += `
                <div class="chat-body-${currentUser===change.doc.data().senderId?"right":"left"}">
                <span class=${currentUser===change.doc.data().senderId?"right":"left"}>
                ${change.doc.data().message}</span>
                <img src=${res.data().usersUid.senderId===senderId && res.data().usersUid.receiverId===receiverId? senderImgUrl:receiverImgUrl} 
                class= avatar-${currentUser===change.doc.data().senderId?"right":"left"}>
                </div>`
            scrollBottom();
            })
    })
    })
} else {
          console.log("no login user")
        }
    });
}

function showDataUsers(){
  var chatroomBody=document.querySelector(".chatroom-body");
  chatroomBody.innerHTML=""
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        db.collection('rooms').where("users."+firebase.auth().currentUser.uid,"==",true).get()
        .then((res)=>{
        if(res.empty){
             chatroomBody.innerHTML=
              `<div class="jumbotron text-center">
              <h1>No contact with other users</h1>
          <p>contact to other user!</p> 
          </div>` 
     }
        res.forEach(doc=>{
        let currentUser= firebase.auth().currentUser.uid;
        let usersUids=currentUser===doc.data().usersUid.senderId ? doc.data().usersUid.receiverId:doc.data().usersUid.senderId;
        db.collection('users').doc(usersUids).get().then(respond=>{
            let userName=currentUser!==doc.data().usersUid.receiverId ? doc.data().usersName.receiverName :doc.data().usersName.senderName;
            console.log(doc.id);
            var div=document.createElement('div');
            var label=document.createElement("label")
            var image=document.createElement("img");
            image.src=respond.data().userUrl;
            image.style.width="50px";
            image.style.height="50px";
            image.style.borderRadius="50px"
            image.style.marginRight="40px";
            image.id="divDataUserImg"
            label.innerHTML=userName;
            label.id="divDataUserLabel";
            div.setAttribute("id","divDataUser");
            div.setAttribute("class",doc.id);
            div.setAttribute("onclick","chatTabOpen(className)");
            div.appendChild(image);
            div.appendChild(label);
            chatroomBody.appendChild(div);
            console.log(chatroomBody.hasChildNodes());
        })
    })
    userImageShow();
})
}
 else {
    chatroomBody.innerHTML=
    `<div class="jumbotron text-center">
    <h1>SignOut successfully!!</h1>
    <p>please login to show your ChatRooms</p> 
    </div>` 
      userImageShow();
    }
  });   
}

function chatTabOpen(className){
    var url =new URL (location.href);
    var index=url.href.lastIndexOf("/");
    var myUrl= url.href.substr(0,index);
    myUrl=myUrl+"/usersChatRoom.html#"+className;
    location.href=myUrl;    
}
function userImageShow(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            db.collection('users').doc(firebase.auth().currentUser.uid).get().then(respy=>{
                var olxAccount=document.querySelector(".olx-account");
                olxAccount.style.marginTop="8px"; 
                olxAccount.id=""
                var imgCircle=document.querySelector(".img-circle");
                imgCircle.src=respy.data().userUrl;
                imgCircle.style.marginLeft="5px";
                var olxUserAccountPara=document.querySelector(".olx-user-account-para");
                olxUserAccountPara.innerHTML=respy.data().fullname;
                olxUserAccountPara.style.margin="0px";
                olxUserAccountPara.style.padding="0px";
                olxUserAccountPara.style.marginLeft="25px"; 
            })
        }
        else{
            var account=document.querySelector(".account");
            console.log("accccount>>",account);
                account.id="" 
        }
})
}
function scrollBottom(){
    window.scroll(0,document.body.scrollHeight);
}


  