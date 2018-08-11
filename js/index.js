const config = {
    apiKey: "PASTE_YOUR_API_KEY_HERE",
    authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
    databaseURL: "PASET_YOUR_DATABASE_URL_HERE",
    projectId: "PASETE_YOUR_PROJECT_ID_HERE",
    storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE"
  };
  
firebase.initializeApp(config);
const db = firebase.firestore();
const messaging = firebase.messaging();

//INDEX

var hearts = document.querySelectorAll('[data-icon="heart"]');
for(v=0; v< hearts.length; v++){
	hearts[v].style.display="none";
}

function indexLoads(){
	if(localStorage.getItem('loggedin-id') != null){
		if(navigator.onLine){
			db.collection('favorites').where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(res){
		    	localStorage.setItem('favs','[]');
		    	res.forEach((r)=>{
					db.collection('ads').doc(r.data().ad).get().then(function(add){
						var storedFav = JSON.parse(localStorage.getItem('favs'));
						storedFav.push(add.data());
						localStorage.setItem('favs',JSON.stringify(storedFav));
					});       
		    	});
		    });
		}
	}

	if(localStorage.getItem('loggedin-id') != null){
		document.getElementsByClassName('homeLOGINBTNS')[0].style.display="none";
		document.getElementsByClassName('userICON')[0].style.display="block";
	}else{
		document.getElementsByClassName('homeLOGINBTNS')[0].style.display="block";
		document.getElementsByClassName('userICON')[0].style.display="none";
	}
	if(navigator.onLine){
		document.getElementById('loading').style.display="block";
		db.collection("ads").limit(8).get().then(function(res){
			var items = document.getElementById('items');
			res.forEach((r)=>{
				var div = document.createElement('div');
				div.setAttribute('class','ad');
				var a = document.createElement('a');
				a.href="Javascript:void(0)";
				a.setAttribute('data-uid',r.id);
				a.addEventListener('click',gotoSpecificAd);
				var div1 = document.createElement('div');
				div1.setAttribute('class','imageBx');
				var img = document.createElement('img');
				img.src= r.data().picture;
				var div2 = document.createElement('div');
				div2.setAttribute('class','detailBx');
				var div3 = document.createElement('div');
				div3.setAttribute('class','title');
				var center = document.createElement('center');
				var span = document.createElement('span');
				span.innerHTML = r.data().title;
				var div4 = document.createElement('div');
				div4.setAttribute('class','rate');
				var div5 = document.createElement('div');
				div5.innerHTML = "Rs: "+r.data().price;
				var div6 = document.createElement('div');
				db.collection('favorites').where('ad','==',r.id).where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(f){
					if(f.empty){
						div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#000" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
					}else{
						div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#d10d0d" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
					}
				});
				// div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
				div6.addEventListener('click',fvrt);
				div4.appendChild(div5);
				div4.appendChild(div6);
				center.appendChild(span);
				div3.appendChild(center);
				div2.appendChild(div3);
				div2.appendChild(div4);
				div1.appendChild(img);
				a.appendChild(div1);
				div.appendChild(a);
				div.appendChild(div2);
				items.appendChild(div);
				removeHeartsIfInt();
			});
			document.getElementById('loading').style.display="none";
		});
		function gotoSpecificAd(){
			localStorage.setItem('tmp-ad',this.getAttribute('data-uid'));
			window.location.href="layout/ad.html";
		}
	}else{
		var items = document.getElementById('items');
		items.innerHTML += '<p>Content will be shown when you get online again</p>' ;
	}
}
if(document.getElementById('adBTN')){
	document.getElementById('adBTN').addEventListener('click',function(){
		window.location.href="layout/post.html";
	});
}
function openCat(a){
	var name = a.getAttribute('data-name');
	localStorage.setItem('tmpCatName',name);
	window.location.href="layout/category.html";
}
function search(){
	var searchTxt = document.getElementById('searchTxt').value;
	localStorage.setItem('searchTxt',searchTxt);
	window.location.href="layout/search.html";
}


function searchLoads(){
	if(navigator.onLine){
		document.getElementById('loading').style.display="block";
		document.getElementById('searchName').innerHTML += localStorage.getItem('searchTxt');
		db.collection('ads').get().then(function(res){
			var adDiv = document.getElementById('adDiv');
			res.forEach((r)=>{
				if(r.data().title.toLowerCase().indexOf(localStorage.getItem('searchTxt').toLowerCase()) != -1){
					var div = document.createElement('div');
					div.setAttribute('class','ad');
					var a = document.createElement('a');
					a.href="Javascript:void(0)";
					a.setAttribute('data-uid',r.id);
					a.addEventListener('click',gotoSpecificAd);
					var div1 = document.createElement('div');
					div1.setAttribute('class','imageBx');
					var img = document.createElement('img');
					img.src= r.data().picture;
					var div2 = document.createElement('div');
					div2.setAttribute('class','detailBx');
					var div3 = document.createElement('div');
					div3.setAttribute('class','title');
					var center = document.createElement('center');
					var span = document.createElement('span');
					span.innerHTML = r.data().title;
					var div4 = document.createElement('div');
					div4.setAttribute('class','rate');
					var div5 = document.createElement('div');
					div5.innerHTML = "Rs: "+r.data().price;
					var div6 = document.createElement('div');
					db.collection('favorites').where('ad','==',r.id).where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(f){
						if(f.empty){
							div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#000" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
						}else{
							div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#d10d0d" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
						}
					});
					div6.addEventListener('click',fvrt);
					div4.appendChild(div5);
					div4.appendChild(div6);
					center.appendChild(span);
					div3.appendChild(center);
					div2.appendChild(div3);
					div2.appendChild(div4);
					div1.appendChild(img);
					a.appendChild(div1);
					div.appendChild(a);
					div.appendChild(div2);
					adDiv.appendChild(div);
					removeHeartsIfInt();
				}
			});
			document.getElementById('loading').style.display="none";	
		}).catch(function(er){
			console.log('Error while fetching ads');
			console.log(er);
		});
	}else{
		document.getElementById('adDiv').innerHTML = "<h3>No internet connection</h3>";
	}
}
function gotoSpecificAd(){
	localStorage.setItem('tmp-ad',this.getAttribute('data-uid'));
	window.location.href="ad.html";
}
function fvrt(){
	var uid = this.childNodes[0].getAttribute('data-uid');
	if(this.childNodes[0].childNodes[0].getAttribute('fill') == '#d10d0d'){
		this.childNodes[0].childNodes[0].setAttribute('fill','#000');
		var jobskill_query = db.collection('favorites').where('uid','==',localStorage.getItem('loggedin-id')).where('ad','==',uid);
		jobskill_query.get().then(function(querySnapshot) {
		  querySnapshot.forEach(function(doc) {
		    doc.ref.delete();
		  });
		});
	}else{
		this.childNodes[0].childNodes[0].setAttribute('fill','#d10d0d');
		db.collection('favorites').add({
			uid : localStorage.getItem('loggedin-id'),
			ad : uid
		});
		// db.collection('ads').doc(uid).get().then(function(ad){
		// 	var favs = JSON.parse(localStorage.getItem('favs'));
		// 	favs.push(ad.data());
		// 	localStorage.setItem(JSON.stringify('favs'));
		// });
	}
}
//INDEX

//LOGIN
function loginLoads(){
	if(localStorage.getItem('loggedin-id') != null){
		window.location.href="ads.html";
	}
}
function custom_login(){
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var errorbox = document.getElementById('error-box');
	if(email.length< 6){
		errorbox.style.display="block";
		errorbox.innerHTML = "Please write proper email !!!";
		return false;
	}
	else if(password.length < 6){
		errorbox.style.display="block";
		errorbox.innerHTML = "Password must contain atleast 6 characters !!!";
		return false;
	}else{
		document.getElementById('loading').style.display="block";
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(res){
			localStorage.setItem('loggedin-id',res.user.uid);
			localStorage.setItem('favs',JSON.stringify([]));
			messaging.requestPermission().then(function() {
				return messaging.getToken()
			}).then(function(currentToken){
				document.getElementById('loading').style.display="block";	
				db.collection('users').doc(res.user.uid).set({
					token : currentToken
				},{merge: true}).then(function(){
					window.location.href="../index.html";
				});
				document.getElementById('loading').style.display="none";
			}).catch(function(err) {
				window.location.href="../index.html";
				console.log('Unable to get permission to notify.', err);
				document.getElementById('loading').style.display="none";
			});
			
			
		}).catch(function(error){
			  document.getElementById('loading').style.display="none";
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  errorbox.style.display="block";
			  errorbox.innerHTML = errorMessage;
		});
		return false;
	}
}
	
//LOGIN

//REGISTER
function regLoads(){
	if(localStorage.getItem('loggedin-id') != null){
		window.location.href="ads.html";
	}
}
function custom_register(){
	var name = document.getElementById('name').value;
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var repassword = document.getElementById('repassword').value;
	var errorbox = document.getElementById('error-box');

	if(name.length < 3){
		errorbox.style.display="block";
		errorbox.innerHTML = "Please write your full name !!!";
		return false;
	}else if(email.length< 6){
		errorbox.style.display="block";
		errorbox.innerHTML = "Please write proper email !!!";
		return false;
	}
	else if(password.length < 6){
		errorbox.style.display="block";
		errorbox.innerHTML = "Password must contain atleast 6 characters !!!";
		return false;
	}
	else if(password != repassword){
		errorbox.style.display="block";
		errorbox.innerHTML = "Password and re-enter password must be same !!!";
		return false;
	}else{
		document.getElementById('loading').style.display="block";
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(res){
			localStorage.setItem('loggedin-id',res.user.uid);
			db.collection('users').doc(res.user.uid).set({
				name,email
			}).then(function(res){
				document.getElementById('loading').style.display="none";
				window.location.href="ads.html";
			});
		}).catch(function(error) {
			  document.getElementById('loading').style.display="none";
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  errorbox.style.display="block";
			  errorbox.innerHTML = errorMessage;
		});
		return false;
	}

}
	
//REGISTER

//PROFILE
function profileLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="../index.html";
	}
}


if(document.getElementById('logout-btn')){
	document.getElementById('logout-btn').addEventListener('click',function(){
		document.getElementById('loading').style.display="block";
		firebase.auth().signOut().then(function() {
			document.getElementById('loading').style.display="none";
			localStorage.removeItem('loggedin-id');
			window.location.href="../index.html";
		}, function(error) {
			document.getElementById('loading').style.display="none";
			console.log("ERROR WHILE LOGGING OUT "+ error);	
		});
	});
}

if(document.getElementById('message-btn')){
	document.getElementById('message-btn').addEventListener('click',function(){
		window.location.href="inbox.html";
	});
}
//PROFILE


//POST
function postLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="login.html";
	}
	if(navigator.onLine){
		document.getElementById('loading').style.display="block";
		db.collection('categories').get().then(function(res){
			var category = document.getElementById('category');
			res.forEach((r)=>{
				var name = r.data().name;
				var option = document.createElement('option');
				option.value = name; 
				option.innerHTML = name;
				category.appendChild(option);
			});
			document.getElementById('loading').style.display="none";
		});
	}else{
		document.getElementById('postDIV').innerHTML = "<h3>You can't post ad until you are online again !!!</h3>";
	}
	
}

function adFormSubmit(){
	document.getElementById('loading').style.display="block";
	var title = document.getElementById('title').value;
	var category = document.getElementById('category').value;
	var desc = document.getElementById('desc').value;
	var price = document.getElementById('price').value;
	var file = document.querySelector('#picture').files[0];
	var name = document.getElementById('name').value;
	var phone = document.getElementById('phone').value;

	if(title.length < 3){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please write proper title !!!";
		document.getElementById('loading').style.display="none";
	}else if(category.length < 2){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please select any category !!!";
		document.getElementById('loading').style.display="none";

	}else if(desc.length < 10){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Category description must contain atleast 10 characters !!!";
		document.getElementById('loading').style.display="none";
		
	}else if(file == undefined){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please select any picture for item !!!";
		document.getElementById('loading').style.display="none";
		
	}else if(price < 1){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please enter proper price !!!";
		document.getElementById('loading').style.display="none";
		
	}else if(name.length < 2){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please write your name !!!";
		document.getElementById('loading').style.display="none";
		
	}else if(phone.length < 10){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please write your number !!!";
		document.getElementById('loading').style.display="none";
		
	}else{
		document.getElementById('loading').style.display="block";
		var downloadImageURL= "SALMAN";
		var ref = firebase.storage().ref('/prod/'+new Date()+'-'+file.name);
		var uploadTask = ref.put(file);
		uploadTask.on('state_changed', function(snapshot){
		}, function(error) {
		  console.log(' Error while uploading image ', error);
		}, function() {
		  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		    db.collection('ads').add({
		    	uid : localStorage.getItem('loggedin-id'),
		    	title : title,
		    	category : category,
		    	desc : desc,
		    	picture : downloadURL,
		    	name : name,
		    	phone : phone,
		    	price : price,
		    	posted_at : new Date().getTime()
		    }).then(function(res){
		    	localStorage.setItem('tmp-ad',res.id);
		    	window.location.href="ad.html";
				// document.getElementById('loading').style.display="none";
		    }).catch(function(er){
		    	console.log("Error while adding ad to DB "+er);
		    });
		  });
		});
	}
	return false;
}
if(document.getElementById('picture')){
	document.getElementById('picture').addEventListener('change',function(){
		document.getElementById('pictureLBL').innerHTML += '<svg aria-hidden="true" data-prefix="fas" data-icon="check-circle" class="svg-inline--fa fa-check-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="green" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>';
		console.log('Okay');
	})
}
//POST

// My Ads
function adsLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="../index.html";
	}
	if(navigator.onLine){
		document.getElementById('loading').style.display="block";
		db.collection('ads').where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(res){
			var adDiv = document.getElementById('adDiv');
			res.forEach((r)=>{
				var div = document.createElement('div');
				div.setAttribute('class','ad');
				var a = document.createElement('a');
				a.href="Javascript:void(0)";
				a.setAttribute('data-uid',r.id);
				a.addEventListener('click',gotoSpecificAd);
				var div1 = document.createElement('div');
				div1.setAttribute('class','imageBx');
				var img = document.createElement('img');
				img.src= r.data().picture;
				var div2 = document.createElement('div');
				div2.setAttribute('class','detailBx');
				var div3 = document.createElement('div');
				div3.setAttribute('class','title');
				var center = document.createElement('center');
				var span = document.createElement('span');
				span.innerHTML = r.data().title;
				var div4 = document.createElement('div');
				div4.setAttribute('class','rate');
				var div5 = document.createElement('div');
				div5.innerHTML = "Rs: "+r.data().price;
				var div6 = document.createElement('div');
				db.collection('favorites').where('ad','==',r.id).where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(f){
					if(f.empty){
						div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#000" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
					}else{
						div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#d10d0d" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
					}
				});
				div6.addEventListener('click',fvrt);
				div4.appendChild(div5);
				div4.appendChild(div6);
				center.appendChild(span);
				div3.appendChild(center);
				div2.appendChild(div3);
				div2.appendChild(div4);
				div1.appendChild(img);
				a.appendChild(div1);
				div.appendChild(a);
				div.appendChild(div2);
				adDiv.appendChild(div);
				removeHeartsIfInt();
			});
			document.getElementById('loading').style.display="none";	
		}).catch(function(er){
			console.log('Error while fetching ads');
			console.log(er);
		});
	}else{
		document.getElementById('adDiv').innerHTML = "<h3>You're offline<br></h3><p style='margin:10px;'>While you offine you can only watch your <a href='fav.html'>favorite Ads</a></p>";
	}
}
function gotoSpecificAd(){
	localStorage.setItem('tmp-ad',this.getAttribute('data-uid'));
	window.location.href="ad.html";
}

// My Ads
function categoryLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="login.html";	
	}
	if(navigator.onLine){
		document.getElementById('loading').style.display="block";
		document.getElementById('categoryName').innerHTML = localStorage.getItem('tmpCatName');
		db.collection('ads').where('category','==',localStorage.getItem('tmpCatName')).get().then(function(res){
			var adDiv = document.getElementById('adDiv');
			res.forEach((r)=>{
				var div = document.createElement('div');
				div.setAttribute('class','ad');
				var a = document.createElement('a');
				a.href="Javascript:void(0)";
				a.setAttribute('data-uid',r.id);
				a.addEventListener('click',gotoSpecificAd);
				var div1 = document.createElement('div');
				div1.setAttribute('class','imageBx');
				var img = document.createElement('img');
				img.src= r.data().picture;
				var div2 = document.createElement('div');
				div2.setAttribute('class','detailBx');
				var div3 = document.createElement('div');
				div3.setAttribute('class','title');
				var center = document.createElement('center');
				var span = document.createElement('span');
				span.innerHTML = r.data().title;
				var div4 = document.createElement('div');
				div4.setAttribute('class','rate');
				var div5 = document.createElement('div');
				div5.innerHTML = "Rs: "+r.data().price;
				var div6 = document.createElement('div');
				db.collection('favorites').where('ad','==',r.id).where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(f){
					if(f.empty){
						div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#000" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
					}else{
						div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#d10d0d" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
					}
				});
				// div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
				div6.addEventListener('click',fvrt);
				div4.appendChild(div5);
				div4.appendChild(div6);
				center.appendChild(span);
				div3.appendChild(center);
				div2.appendChild(div3);
				div2.appendChild(div4);
				div1.appendChild(img);
				a.appendChild(div1);
				div.appendChild(a);
				div.appendChild(div2);
				adDiv.appendChild(div);
				removeHeartsIfInt();
			});
			document.getElementById('loading').style.display="none";	
		}).catch(function(er){
			console.log('Error while fetching ads');
			console.log(er);
		});
	}else{
			var adDiv = document.getElementById('adDiv').innerHTML += "<h3>No Internet Connection !!!</h3>"
	}
}
function gotoSpecificAd(){
	localStorage.setItem('tmp-ad',this.getAttribute('data-uid'));
	window.location.href="ad.html";
}

// fvt Ads
function favLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="../index.html";
	}
	document.getElementById('loading').style.display="block";
	if(navigator.onLine){
		db.collection('favorites').where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(r){
			var adDiv = document.getElementById('adDiv');
			r.forEach((re)=>{
				db.collection('ads').doc(re.data().ad).get().then(function(r){
						
						var adDiv = document.getElementById('adDiv');
						var div = document.createElement('div');
						div.setAttribute('class','ad');
						var a = document.createElement('a');
						a.href="Javascript:void(0)";
						a.setAttribute('data-uid',r.id);
						a.addEventListener('click',gotoSpecificAd);
						var div1 = document.createElement('div');
						div1.setAttribute('class','imageBx');
						var img = document.createElement('img');
						img.src= r.data().picture;
						var div2 = document.createElement('div');
						div2.setAttribute('class','detailBx');
						var div3 = document.createElement('div');
						div3.setAttribute('class','title');
						var center = document.createElement('center');
						var span = document.createElement('span');
						span.innerHTML = r.data().title;
						var div4 = document.createElement('div');
						div4.setAttribute('class','rate');
						var div5 = document.createElement('div');
						div5.innerHTML = "Rs: "+r.data().price;
						var div6 = document.createElement('div');
						db.collection('favorites').where('ad','==',r.id).where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(f){
							if(f.empty){
								div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#000" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
							}else{
								div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#d10d0d" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
							}
						});
						// div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
						div6.addEventListener('click',fvrt);
						div4.appendChild(div5);
						div4.appendChild(div6);
						center.appendChild(span);
						div3.appendChild(center);
						div2.appendChild(div3);
						div2.appendChild(div4);
						div1.appendChild(img);
						a.appendChild(div1);
						div.appendChild(a);
						div.appendChild(div2);
						adDiv.appendChild(div);
						removeHeartsIfInt();
					document.getElementById('loading').style.display="none";	
				}).catch(function(er){
					console.log('Error while fetching ads');
					console.log(er);
				});
			});
			document.getElementById('loading').style.display="none";	
		}).catch(function(er){
			console.log('Error while fetching ads');
			console.log(er);
		});
	}else{
		var favAds = localStorage.getItem('favs');
		if(favAds == []){
			document.getElementById('adDiv').innerHTML = "<h3>You dont have any ad(s) as favourite ad!!</h3>"
		}else{
			favAds = JSON.parse(favAds);
			for(v=0; v< favAds.length; v++){
				var adDiv = document.getElementById('adDiv');
				var div = document.createElement('div');
				div.setAttribute('class','ad');
				var a = document.createElement('a');
				a.href="Javascript:void(0)";
				a.setAttribute('data-posted_at',favAds[v].posted_at);
				a.addEventListener('click',gotoOfflineAd);
				var div1 = document.createElement('div');
				div1.setAttribute('class','imageBx');
				var img = document.createElement('img');
				img.src= '../images/offline.png';
				img.alt= "Could not fetch image";
				var div2 = document.createElement('div');
				div2.setAttribute('class','detailBx');
				var div3 = document.createElement('div');
				div3.setAttribute('class','title');
				var center = document.createElement('center');
				var span = document.createElement('span');
				span.innerHTML = favAds[v].title;
				var div4 = document.createElement('div');
				div4.setAttribute('class','rate');
				var div5 = document.createElement('div');
				div5.innerHTML = "Rs: "+favAds[v].price;
				var div6 = document.createElement('div');
				div6.innerHTML = '<svg data-uid="#####" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#d10d0d" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
				// div6.addEventListener('click',fvrt);
				div4.appendChild(div5);
				div4.appendChild(div6);
				center.appendChild(span);
				div3.appendChild(center);
				div2.appendChild(div3);
				div2.appendChild(div4);
				div1.appendChild(img);
				a.appendChild(div1);
				div.appendChild(a);
				div.appendChild(div2);
				adDiv.appendChild(div);
			}
		}
		document.getElementById('loading').style.display="none";
	}
}
function gotoOfflineAd(){
	localStorage.setItem('offlineAd',this.getAttribute('data-posted_at'));
	window.location.href="offlineAd.html";
}
function gotoSpecificAd(){
	localStorage.setItem('tmp-ad',this.getAttribute('data-uid'));
	window.location.href="ad.html";
}

//Ad
function adLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="../index.html";
	}
	document.getElementById('loading').style.display="block";
	db.collection('ads').doc(localStorage.getItem('tmp-ad')).get().then(function(res){
		document.getElementById('ad-title').innerHTML = res.data().title;
		document.getElementById('ad-image').src=res.data().picture;
		document.getElementById('ad-desc').innerHTML = res.data().desc;
		document.getElementById('ad-tbl-title').innerHTML = res.data().title;
		document.getElementById('ad-tbl-price').innerHTML = res.data().price;
		document.getElementById('ad-tbl-phone').innerHTML = res.data().phone;
		document.getElementById('ad-tbl-cat').innerHTML = res.data().category;
		document.getElementById('ad-tbl-name').innerHTML = res.data().name;
		document.getElementById('sendMSG').setAttribute('data-ad-id',res.id);
		
		if(res.data().uid == localStorage.getItem('loggedin-id')){
			document.getElementById('visitorDiv').style.display = "none";
			document.getElementById('ownerDiv').style.display = "block";
		}else{
			document.getElementById('visitorDiv').style.display = "block";
			document.getElementById('ownerDiv').style.display = "none";
		}

		document.getElementById('deleteBtn').setAttribute('data-id',res.id);
		document.getElementById('editBtn').setAttribute('data-id',res.id);
		document.getElementById('sendMSG').setAttribute('data-id',res.data().uid);
		db.collection('users').doc(res.data().uid).get().then(function(res){
			document.getElementById('user-name').innerHTML = res.data().name;
			document.getElementById('user-name').setAttribute('data-uid',res.id);
			document.getElementById('usernameLink').setAttribute('data-uid',res.id);
		});

		document.getElementById('deleteBtn').addEventListener('click',function(){
			var uid =  this.getAttribute('data-id');
			db.collection('ads').doc(uid).delete();
			window.location.href="../index.html";
		});
		document.getElementById('editBtn').addEventListener('click',function(){
			var uid =  this.getAttribute('data-id');
			localStorage.setItem('edit-item',uid);
			window.location.href="edit.html";	
		});
		document.getElementById('loading').style.display="none";
	}).catch(function(er){
		console.log(er);
		console.log("Error while fetching spec ad");
	});
}
if(document.getElementById('usernameLink')){
	document.getElementById('usernameLink').addEventListener('click',function(){
		localStorage.setItem('user',this.getAttribute('data-uid'));
		window.location.href="user.html";
	});
}
if(document.getElementById('user-name')){
	document.getElementById('user-name').addEventListener('click',function(){
		localStorage.setItem('user',this.getAttribute('data-uid'));
		window.location.href="user.html";
	});
}
if(document.getElementById('sendMSG')){
	document.getElementById('sendMSG').addEventListener('click',function(){
		localStorage.setItem('reciever-id',this.getAttribute('data-id'));
		localStorage.setItem('chat-ad-id',this.getAttribute('data-ad-id'));
		window.location.href="message.html";
	});
}
//Ad

//USER

function userLoads(){
	var uid = localStorage.getItem('user');		
	document.getElementById('loading').style.display = "block";
	db.collection('users').doc(uid).get().then(res=>{
		document.getElementById('username').innerHTML = res.data().name; 
		document.getElementById('name').innerHTML = res.data().name.toUpperCase(); 
		document.getElementById('email').innerHTML = res.data().email.toUpperCase(); 
		document.getElementById('loading').style.display = "none";
		db.collection('ads').where('uid','==',uid).limit(4).get().then(res=>{
			if(res.size>0){
				document.getElementById('recent_ads').innerHTML = "Recent Ads";
				res.forEach((r)=>{
					var adDiv = document.getElementById('ads');
					var div = document.createElement('div');
					div.setAttribute('class','ad');
					var a = document.createElement('a');
					a.href="Javascript:void(0)";
					a.setAttribute('data-uid',r.id);
					a.addEventListener('click',gotoSpecificAd);
					var div1 = document.createElement('div');
					div1.setAttribute('class','imageBx');
					var img = document.createElement('img');
					img.src= r.data().picture;
					var div2 = document.createElement('div');
					div2.setAttribute('class','detailBx');
					var div3 = document.createElement('div');
					div3.setAttribute('class','title');
					var center = document.createElement('center');
					var span = document.createElement('span');
					span.innerHTML = r.data().title;
					var div4 = document.createElement('div');
					div4.setAttribute('class','rate');
					var div5 = document.createElement('div');
					div5.innerHTML = "Rs: "+r.data().price;
					var div6 = document.createElement('div');
					db.collection('favorites').where('ad','==',r.id).where('uid','==',localStorage.getItem('loggedin-id')).get().then(function(f){
						if(f.empty){
							div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#000" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
						}else{
							div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#d10d0d" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
						}
					});
					// div6.innerHTML = '<svg data-uid="'+r.id+'" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>';
					div6.addEventListener('click',fvrt);
					div4.appendChild(div5);
					div4.appendChild(div6);
					center.appendChild(span);
					div3.appendChild(center);
					div2.appendChild(div3);
					div2.appendChild(div4);
					div1.appendChild(img);
					a.appendChild(div1);
					div.appendChild(a);
					div.appendChild(div2);
					adDiv.appendChild(div);
				}) 
			}
		});
	});
}

//USER

function removeHeartsIfInt(){
	if(!navigator.onLine){
		var hearts = document.querySelectorAll('[data-icon="heart"]');
		for(v=0; v< hearts.length; v++){
			hearts[v].style.display="none";
		}	
	}
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	  }
	  else {
	    var hearts = document.querySelectorAll('[data-icon="heart"]');
		for(v=0; v< hearts.length; v++){
			hearts[v].style.display="none";
		}
	  }
	});
}

//Edit
function editLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="login.html";
	}
	if(navigator.onLine){
		document.getElementById('loading').style.display="block";
		db.collection('categories').get().then(function(res){
			var category = document.getElementById('category');
			res.forEach((r)=>{
				var name = r.data().name;
				var option = document.createElement('option');
				option.value = name; 
				option.innerHTML = name;
				category.appendChild(option);
			});
			db.collection('ads').doc(localStorage.getItem('edit-item')).get().then(function(res){
				var title = document.getElementById('title').value = res.data().title;
				var category = document.getElementById('category').value = res.data().category;
				var desc = document.getElementById('desc').value = res.data().desc;
				var price = document.getElementById('price').value = res.data().price;
				// var file = document.querySelector('#picture').files[0];
				var name = document.getElementById('name').value = res.data().name;
				var phone = document.getElementById('phone').value = res.data().phone;
			});
			document.getElementById('loading').style.display="none";
		});
	}else{
		document.getElementById('postDIV').innerHTML = "<h3>You can't edit ad until you are online again !!!</h3>";
	}
}

function adFormSubmitEdit(){
	document.getElementById('loading').style.display="block";
	var title = document.getElementById('title').value;
	var category = document.getElementById('category').value;
	var desc = document.getElementById('desc').value;
	var price = document.getElementById('price').value;
	var file = document.querySelector('#picture').files[0];
	var name = document.getElementById('name').value;
	var phone = document.getElementById('phone').value;

	if(title.length < 3){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please write proper title !!!";
	}else if(category.length < 2){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please select any category !!!";
	}else if(desc.length < 10){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Category description must contain atleast 10 characters !!!";
	}else if(price < 1){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please enter proper price !!!";
	}else if(name.length < 2){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please write your name !!!";
	}else if(phone.length < 10){
		document.getElementById('error-box').style.display="block";
		document.getElementById('error-box').innerHTML = "Please write your number !!!";
	}else{
		document.getElementById('loading').style.display="block";
		if(file){
			var downloadImageURL= "";
			var ref = firebase.storage().ref('/prod/'+new Date()+'-'+file.name);
			var uploadTask = ref.put(file);
			uploadTask.on('state_changed', function(snapshot){
			}, function(error) {
			  console.log(' Error while uploading image ', error);
			}, function() {
			  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			    db.collection('ads').doc(localStorage.getItem('edit-item')).set({
			    	uid : localStorage.getItem('loggedin-id'),
			    	title : title,
			    	category : category,
			    	desc : desc,
			    	picture : downloadURL,
			    	name : name,
			    	phone : phone,
			    	price : price,
			    	posted_at : new Date().getTime()
			    }).then(function(res){
			    	window.location.href="ad.html";
					document.getElementById('loading').style.display="none";
			    }).catch(function(er){
			    	console.log("Error while adding ad to DB "+er);
			    });
			  });
			});
		}else{
			db.collection('ads').doc(localStorage.getItem('edit-item')).set({
		    	uid : localStorage.getItem('loggedin-id'),
		    	title : title,
		    	category : category,
		    	desc : desc,
		    	name : name,
		    	phone : phone,
		    	price : price
		    },{merge:true}).then(function(res){
		    	window.location.href="ad.html";
				document.getElementById('loading').style.display="none";
		    }).catch(function(er){
		    	console.log("Error while adding ad to DB "+er);
		    });
		}
	}
	document.getElementById('loading').style.display="none";
	return false;
}
//Edit




//Message
function messageLoads(){
	var url_string = window.location.href;
	var url = new URL(url_string);
	var id = url.searchParams.get("id");
	var adid = url.searchParams.get("adid");
	if(id != null){
		localStorage.setItem('reciever-id',id);
		localStorage.setItem('chat-ad-id',adid);
	}
	document.getElementById('loading').style.display="block";
	db.collection('users').doc(localStorage.getItem('reciever-id')).get().then(function(res){
		document.getElementById('reciever-name').innerHTML = "<span>"+res.data().name+"</span>";
		localStorage.setItem('reciever-token',res.data().token);
	});
	db.collection('messages').where('ad_id','==',localStorage.getItem('chat-ad-id')).onSnapshot(function(doc){
		var chatBox = document.getElementsByClassName('chatBox')[0];
		chatBox.innerHTML = "";
		var shmessages = [];
		doc.forEach((d)=>{
			if(d.data().reciever_id == localStorage.getItem('loggedin-id') || d.data().sender_id == localStorage.getItem('reciever-id')){
				shmessages.push(d.data());
			}else if(d.data().sender_id == localStorage.getItem('loggedin-id') || d.data().reciever_id == localStorage.getItem('reciever-id')){
				shmessages.push(d.data());
			}
		});


		function sort_by_key_value(arr, key) {
		  var to_s = Object.prototype.toString;
		  var valid_arr = to_s.call(arr) === '[object Array]';
		  var valid_key = typeof key === 'string';

		  if (!valid_arr || !valid_key) {
		    return;
		  }

		  arr = arr.slice();

		  return arr.sort(function(a, b) {
		    var a_key = String(a[key]);
		    var b_key = String(b[key]);
		    var n = a_key - b_key;
		    return !isNaN(n) ? n : a_key.localeCompare(b_key);
		  });
		}
		var new_arr = sort_by_key_value(shmessages, 'sent_at');
		new_arr.forEach(function(item) {
	  		if(item.reciever_id == localStorage.getItem('reciever-id')){
	    		var div = document.createElement('div');
	    		div.setAttribute('class','right');
	    		div.innerHTML = item.message;
	    		chatBox.appendChild(div);
	    	}else{
	    		var div = document.createElement('div');
	    		div.setAttribute('class','left');
	    		div.innerHTML = item.message;
	    		chatBox.appendChild(div);
	    	}
		});
		var objDiv = document.getElementsByClassName("messageContent")[0];
		objDiv.scrollTop = objDiv.scrollHeight;
		document.getElementById('loading').style.display="none";
	});
}
messaging.onMessage(function(payload){
	console.log('PAYLOAD');
});

if(document.getElementById('sendMessage')){
	document.getElementById('sendMessage').addEventListener('click',function(){
		var message = document.getElementById('message').value;
		document.getElementById('message').value= ""; 
		if(message.length>1){
			db.collection('messages').add({
				reciever_id : localStorage.getItem('reciever-id'),
				sender_id : localStorage.getItem('loggedin-id'),
				message : message,
				ad_id : localStorage.getItem('chat-ad-id'),
				sent_at : (new Date()).getTime()
			}).then(function(){
				document.getElementById('message').value= "";
				var objDiv = document.getElementsByClassName("messageContent")[0];
				objDiv.scrollTop = objDiv.scrollHeight; 
			});
		}
	});
}
//Message

//Inbox
function inboxLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="../index.html";
	}
	
	var loader = document.getElementById('loading');
	var inboxBox = document.getElementsByClassName('inboxBox')[0];
	loader.style.display="block";
	var messages = [];
	db.collection('messages').where('sender_id','==',localStorage.getItem('loggedin-id')).get().then(function(res){
		res.forEach((r)=>{
			messages.push(r.data());
		});
	});
	db.collection('messages').where('reciever_id','==',localStorage.getItem('loggedin-id')).get().then(function(res){
		res.forEach((r)=>{
			messages.push(r.data());
		});
		messages = Object.values(messages.reduce((acc,cur)=>Object.assign(acc,{[cur.sender_id]:cur}),{}));
		chats = Object.values(messages.reduce((acc,cur)=>Object.assign(acc,{[cur.ad_id]:cur}),{}));
		chats.forEach((chat)=>{
			var date = new Date(chat.sent_at);
			date = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
			if(chat.sender_id == localStorage.getItem('loggedin-id')){
				db.collection('users').doc(chat.reciever_id).get().then(function(res){
					inboxBox.innerHTML += '<div class="chatDiv"><a href="Javascript:void(0)" onclick="gotoChat(this)" data-reciever-id="'+chat.reciever_id+'" data-ad-id="'+chat.ad_id+'"><div><svg aria-hidden="true" data-prefix="fas" data-icon="user-circle" class="svg-inline--fa fa-user-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="#000" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg></div><div class="rname"><span> '+res.data().name+' </span></div></a><a href="Javascript:void(0)" onclick="gotoSpAd(this)" data-uid="'+chat.ad_id+'"><div class="inboxAd"><span>Visit Ad</span></div></a><div class="date"><span>'+date+'</span></div></div>';
				});
			}else{
				db.collection('users').doc(chat.sender_id).get().then(function(res){
					inboxBox.innerHTML += '<div class="chatDiv"><a href="Javascript:void(0)" onclick="gotoChat(this)" data-reciever-id="'+chat.sender_id+'" data-ad-id="'+chat.ad_id+'"><div><svg aria-hidden="true" data-prefix="fas" data-icon="user-circle" class="svg-inline--fa fa-user-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="#000" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg></div><div class="rname"><span> '+res.data().name+' </span></div></a><a href="Javascript:void(0)" onclick="gotoSpAd(this)" data-uid="'+chat.ad_id+'"><div class="inboxAd"><span>Visit Ad</span></div></a><div class="date"><span>'+date+'</span></div></div>';
				});
			}
		});
		loader.style.display="none";
	});
}

function gotoChat(a){
	localStorage.setItem('reciever-id',a.getAttribute('data-reciever-id'));
	localStorage.setItem('chat-ad-id',a.getAttribute('data-ad-id'));
	window.location.href="message.html";
}
function gotoSpAd(a){
	localStorage.setItem('tmp-ad',a.getAttribute('data-uid'));
	window.location.href="ad.html";
}
	
//Inbox

if(document.getElementById('back-btn')){
	document.getElementById('back-btn').addEventListener('click',function(){
		window.history.back();
	});
}

//OfflineAd
function offlineAdLoads(){
	if(localStorage.getItem('loggedin-id') == null){
		window.location.href="../index.html";
	}
	var favs = JSON.parse(localStorage.getItem('favs'));
	for(var f=0; f< favs.length; f++){
		if(favs[f].posted_at == localStorage.getItem('offlineAd')){
			document.getElementById('ad-title').innerHTML = favs[f].title;
			document.getElementById('ad-image').src= '../images/offline.png';
			document.getElementById('ad-desc').innerHTML = favs[f].desc;
			document.getElementById('ad-tbl-title').innerHTML = favs[f].title;
			document.getElementById('ad-tbl-price').innerHTML = favs[f].price;
			document.getElementById('ad-tbl-phone').innerHTML = favs[f].phone;
			document.getElementById('ad-tbl-cat').innerHTML = favs[f].category;
			document.getElementById('ad-tbl-name').innerHTML = favs[f].name;
		}
	}
}
//OfflineAd


