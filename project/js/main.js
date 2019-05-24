// This function fetches and displays the posts from the database once the page is loaded.
$(document).ready(function(){
  getPosts();
})
  
// This function lets users sign using their Google accounts.
// The user variable can be used to display the user's name, email address, and so on.
function handleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}
  
// This function creates a JSON object from the data retrieved from the text fields.
// Then, it references the database's "posts" collection, creates a new post,
//    and sends the JSON object. If it saves successfully, it triggers a page reload. 
function addMessage(postTitle, postBody) {
  var postData = {
    title: postTitle,
    body: postBody
  }

  // Get a reference to the database service
  var database = firebase.database().ref('posts');

  var newPostRef = database.push();
  newPostRef.set(postData, function(error) {
    if (error) {
      // The write failed...
    } else {
      window.location.reload();
    }
  });

}
  
// This function grabs the values from the text fields using jQuery, then passes them to the 
//    addMessage() function.
function handleMessageFormSubmit() {
  var postTitle = $("#post-title").val();
  var postBody = $("#post-body").val();
  addMessage(postTitle, postBody);
}
  
// This function gets all the posts in the "posts" collection of the database, then returns 
//    them in the "snapshot" variable. 
// Then, it loops through each post, pulling the data out of the object by the post key, then
//    putting it on the page using jQuery. 
function getPosts() {
  return firebase.database().ref('posts').once('value').then(function(snapshot) {
    var posts = snapshot.val();
    
    for(var postKey in posts) {
      var post = posts[postKey];
      $("#post-listing").append("<div class='post'>"+post.title+" - "+post.body+"</div>");
    }

  });
}