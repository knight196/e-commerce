//hamburger menu
var bars = document.querySelector('.burgermenu')

bars.addEventListener('click', () => {
document.querySelector('.mobilebar').classList.toggle('mobilebarshow');
})

//slideshow

var slideIndex = 1;
showSlides(slideIndex)

var timer = null;

function plusSlides(n){
   showSlides(slideIndex += n)
   clearTimeout(timer);
}

function currentSlide(n){
   showSlides(slideIndex = n)
   clearTimeout(timer);
}


function showSlides(n) {
   var i;
   var slides = document.getElementsByClassName("mySlides");
   var fills = document.getElementsByClassName("fill")
   if(n==undefined)
   {
       n= ++slideIndex
   }
   if (n > slides.length) {slideIndex = 1}
   if (n < 1) {slideIndex = slides.length}
   for (i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";
   }
   for (i = 0; i < fills.length; i++) {
       fills[i].className = fills[i].className.replace(" active", "");
   }
   slides[slideIndex-1].style.display = "block";
   fills[slideIndex-1].className += " active";
   timer = setTimeout(showSlides, 4000);
 } 

 //tabcontent
 function tabchange(evt, tabweb){
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for(i=0; i<tabcontent.length; i++){
       tabcontent[i].style.display="none";
    }


    tablinks = document.getElementsByClassName('tablinks')
    for(i=0; i<tablinks.length; i++){
       tablinks.className = tablinks[i].className.replace('active', '')
    }

    document.getElementById(tabweb).style.display="block";
    evt.currentTarget.className += 'active';
 }

 document.getElementById("defaultOpen").click();

fetch('data.json')
.then(res => res.json())
.then(data => {
  
   var mobileinfo = document.querySelector('.mobileinfo')

   function display(){

      mobileinfo.innerHTML = "";

      data.forEach(itemdata => {

         
         var card = `

         <div class="tabcontent" id="${itemdata.tabname}">

         <div class="mobiledetails"> 

         <h1 class="itemtitle">${itemdata.name}</h1>

         <img class="itemimg" src="${itemdata.images}">

         <p class="itemprice">${itemdata.price}</p>

         <button class="cartbtn">Add Cart</button>


         <p>${itemdata.details}</p>


        <h1>Product Specification</h1>
         <table>
         <tr>
           <td>Operating System</td>
           <td>${itemdata.operating}</td>
         </tr>
         <tr>
           <td>Screen Size</td>
           <td>${itemdata.screensize}</td>
         </tr>
         <tr>
         <td>Connectivity</td>
         <td>${itemdata.connectivity}</td>
       </tr>
       <tr>
       <td>Camera</td>
       <td>${itemdata.camera}</td>
     </tr>
     <tr>
     <td>Processor</td>
     <td>${itemdata.processor}</td>
   </tr>
   <tr>
   <td>Sim Size</td>
   <td>${itemdata.simsize}</td>
 </tr>
 <tr>
 <td>Memory Card Slot</td>
 <td>${itemdata.memorycardslot}</td>
</tr>
       </table> 

       </div>
         
      </div>
         
         `
         
         mobileinfo.innerHTML += card;

         var count = 0;

         var removecart = document.getElementsByClassName('remove');
         for(var i=0; i< removecart.length; i++){
            var button = removecart[i];
            button.addEventListener('click', removeCartItem);
         }

         function removeCartItem(event){
            var buttonClicked = event.target;
            buttonClicked.parentElement.parentElement.remove();
            var countless = document.querySelector('.count').innerHTML = --count;
            if(countless ==  0){
               location.href="phoneshop.html";
            }
            updateCartTotal();
         }

         function quantityChanged(event){
            var input = event.target;
            if(isNaN(input.value) || input.value <= 0){
               input.value = 1;
            }
            updateCartTotal();
         }
         

         var cartbtn = document.getElementsByClassName('cartbtn')
for(var i=0; i<cartbtn.length; i++){
   var button = cartbtn[i];
   button.addEventListener('click', addToCartClicked)
}

         function addToCartClicked(event){
   var button = event.target;
   var shopItem = button.parentElement;
   var title = shopItem.getElementsByClassName('itemtitle')[0].innerText;
   var price = shopItem.getElementsByClassName('itemprice')[0].innerText;
   var imageSrc = shopItem.getElementsByClassName('itemimg')[0].src;
   addItemToCart(title,price,imageSrc);
   document.querySelector('.count').innerHTML = ++count;
   updateCartTotal();
}

function addItemToCart(title,price,imageSrc){
   var cartRow = document.createElement('div')
   cartRow.classList.add('cartitem');
   cartRow.innerText = title;
   var cartItems = document.getElementsByClassName('shoppingcartitem')[0];
   var cartItemNames = cartItems.getElementsByClassName('carttitle');

   for(var i=0; i<cartItemNames.length; i++){
      if(cartItemNames[i].innerText == title){
         document.querySelector('.count').innerHTML = --count;
         alert('This item is already added to the cart')
         return 
      }
   }
   var cartRowContents =`
<div class="item">
  <img class="cartimg" src="${imageSrc}">
<p class="carttitle">${title}</p>
</div>
<h1 class="cartprice">${price}</h1>
<div class="removecart">
  <input type="number" value="1" class="cartquantity">
  <button class="remove">Remove</button>
</div>
`

cartRow.innerHTML = cartRowContents;
cartItems.append(cartRow);


cartRow.getElementsByClassName('remove')[0].addEventListener('click', removeCartItem);
cartRow.getElementsByClassName('cartquantity')[0].addEventListener('change', quantityChanged);
}
      })
         
      }
   display(data)

})

function updateCartTotal(){
   var cartItemContainer = document.getElementsByClassName('shoppingcartitem')[0];
   var cartitem = cartItemContainer.getElementsByClassName('cartitem');
   var total = 0;
   for(var i=0; i<cartitem.length; i++){
      var cartitems = cartitem[i];
      var priceElement = cartitems.getElementsByClassName('cartprice')[0];
      var quantityElement = cartitems.getElementsByClassName('cartquantity')[0];
      var price = parseFloat(priceElement.innerText.replace('£', ''))
      var quantity = quantityElement.value;
      total = total + (price * quantity);
   }
   total = Math.round(total * 100) / 100;
   document.getElementsByClassName('carttotal')[0].innerText = '£' + total;
}


//phones search filter
const search = document.getElementById('searchbar')
const phonessearch = document.getElementById('phonessearchfilter')

//search states.json and filter it
const searchStates = async searchText => {
   const res = await fetch('data.json');//requesting the json data
   const states = await res.json();//grabbing and showing all the items

   //Get matches to current text input
let matches = states.filter(state => {
   const regex = new RegExp(`^${searchText}`, 'gi');
   return state.name.match(regex);
})

//if the words are equal to 0 then the whole item won't show
if(searchText.length === 0){
   matches = [];
   phonessearch.innerHTML = "";
   document.querySelector('.filteroption').style.display="grid";
}

outputHtml(matches)

}

//show results in HTML
const outputHtml = matches => {
   if(matches.length > 0){
      const html = matches.map(match => `
      
      <div class="phonesearch">
      <h2>${match.name}</h2>
      <img src="${match.images}">
      <button class="tablinks" onclick="tabchange(event,'${match.tabname}')">Buy Now</button>
      </div>
      
      `).join('');
phonessearch.innerHTML = html;
   }
}

search.addEventListener('input', () => searchStates(search.value))


//phones pages

fetch('data.json')
.then(res => res.json())
.then(data => {

var filteringphone = document.querySelector('.filteringphone')

function displayshow(){

filteringphone.innerHTML = "";

data.forEach(itemdata => {

var card = `

<div class="${itemdata.filtername}" id="filteringgrid">
<img src="${itemdata.images}">
<br>
<button onclick="tabchange(event, '${itemdata.tabname}')">Buy Now</button>

</div>

`

filteringphone.innerHTML += card;

})

}

displayshow(data)
});



function change(){
   let results = Array.from(document.querySelectorAll('.filteringphone > div'))
   modelsChecked = document.querySelectorAll('.filterbox input.models:checked')


results.forEach(function(result){
   result.style.display="none";
});


filterModels(modelsChecked)

function filterModels(models){
   results = Array.from(models).reduce(function(sum, input) {
      const attrib = input.getAttribute('rel');
      return sum.concat(results.filter(function(result) {
          return result.classList.contains(attrib);
      }))
   },[])
}

results.forEach(function(result){
   result.style.display='block';
})
}
change();

//take the user back to homepage after the final payment
var finalconfirm = document.querySelector('.finalconfirm')

finalconfirm.addEventListener('click', () => {

location.href="index.html";

})

//login and sign up

var signup = document.querySelector('#signup');

signup.addEventListener('click', () => {

  var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var passwordcheck = document.getElementById("passwordcheck").value;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(email =='')
    {
      alert("please enter email.");
    }
    else if(password=='')
    {
          alert("enter the password");
    }
    else if(!filter.test(email))
    {
      alert("Enter valid email id.");
    }
    else if(password.length < 6)
    {
      alert("Password min is 6.");
    }
    else if (password !== passwordcheck){
      alert('Check the password again');
    }
    else{
   alert('Thank you for Sign Up');

 if(email && password){
   localStorage.setItem(email,password);
 }
      }

    });

    var login = document.querySelector('#login');

login.addEventListener('click', () => {

  var email2 = document.getElementById("email2").value;
    var password2 = document.getElementById("password2").value;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(email2 =='')
    {
      alert("please enter email.");
    }
    else if(password2 =='')
    {
          alert("enter the password");
    }
    else if(!filter.test(email2))
    {
      alert("Enter valid email id.");
    }
    else if(password2.length < 6)
    {
      alert("Password min is 6.");
    }
    else{
   alert('Thank you for Login');

 if(email2 && password2){
   localStorage.setItem(email2,password2);
 }
      }

    });

   
    

    function pwdcheck() {
      var x = document.querySelectorAll(".pwd");
      for(var i=0; i< x.length; i++){
      if (x[i].type === "password") {
        x[i].type = "text";
      } else {
        x[i].type = "password";
      }
    }
    }
    
    function pwdcheck1() {
      var x = document.querySelector(".pwd1");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }
    
    
    
var createac = document.querySelector('#createnewpage');
var loginpage = document.querySelector('#loginpage');

createac.addEventListener('click', () => {
 
      document.querySelector('.createac').style.display="block";
      document.querySelector('.login').style.display="none";
  
});

loginpage.addEventListener('click', () => {

      document.querySelector('.createac').style.display="none";
      document.querySelector('.login').style.display="block";

});


document.getElementById('pay').addEventListener('click', payment)

function payment(){
   
}






