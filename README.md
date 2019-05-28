# DatabaseWebApp

Check it out at: https://polar-gorge-35520.herokuapp.com/

_Note: Unlike with the Base Web App, you shouldn't fork and clone the code in this repo onto your machine. Instead, try to follow the instructions below, using the code in this repo as a reference._

Today, you’ll learn all about databases. You’ll also get set up with Firebase, a popular database solution. Then, you’ll write some code to get data into and out of your database. You’ll also practice reading a service’s documentation — a crucial skill for building web applications. If you haven’t built a web app using the instructions in the first lesson yet, you’ll want to do that before we get started.

First of all — what is a database? It’s an orderly way of storing all your app’s data. Depending on what you want to store, your data can be structured in any number of ways.

Today you’ll be using Firebase as your database. We’ve chosen Firebase because it’s fast, free for simple apps, and handles user authentication easily. But, there are many database solutions out there. If you’d like to use a different one, search the internet for some tutorials on integrating it with a Node app. While the code you use will likely be different, the core concepts will be the same.

Today, you’ll be building a message stream app as an example. Users will be able to add posts, and those posts will be saved to a database. You’ll then display all the posts in your database on the page.

## Part 1: Get your Firebase database set up

#### 1. Create your account

First, log in to your Google account (or create one) and "Add Project" on Firebase, a database service built by Google, at https://console.firebase.google.com. Name it whatever you like!

When your database is ready, it should take you to an overview page. We'll come back to this.

#### 2. Set up an authentication method

First, you’ll want to make sure that users can sign in to your app before being able to post messages to the database. This provides a layer of protection against spammers. Without it, they might have the ability to submit too many messages for your database to handle, eventually making it crash. To avoid that, you’ll be turning on a sign-in method. 

In the sidebar, select "Develop", then "Authentication", then "Set up sign-in method" in the middle of the page. Select "Google" for now, flip the switch to "Enable", add your email address if required, then save. This will make Google the sign-in method to use your web application.

While still on the sign in method page, scroll down and add your app's base url to the `Authorized domains` list (in my case, I added `https://polar-gorge-35520.herokuapp.com/`). This essentially gives your app permission to use the database.

#### 3. Create your database

In the sidebar, select "Develop", then "Database", and click the “Create Database” button. Change your security rules to “Test Mode” — we want to be able to read and write to our database, after all. After your database is created, select the dropdown that says "Cloud Firestore" in the header, and switch your database to "Realtime Database". The Realtime Database is just a bit simpler to understand, so it’s a better option for beginners.

On this same screen, select the top nav item "Rules". Your rules will say that “read” and “write” are both false. You’ll want to change those rules to allow reading and writing to the database if a user is logged in. Make sure the rules look like the code below, then publish your changes:

```
      {
        "rules": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
```

#### 4. Add Firebase to your app

While still on the Firebase website, go back to “Project Overview” in the left navigation and select the angle brackets under 'Get started by adding Firebase to your app'.
<div style="text-align:center"><img src ="https://d2mxuefqeaa7sj.cloudfront.net/s_0B2FBC1C225F1AB4C2B888C7BB8510368E050ED500396ECDF2923157F2823B9A_1552942056201_image.png" /></div>

Add a name for your app to register it, then you should see a code block pop up on your screen. Copy that code, then head to your `head.ejs` file. Paste the code into your `head.ejs` file before the link to your app’s `main.js` file.

#### 5. Hide your API Key

Next, hook up your API key. Leaving API keys in your code is not a good idea — bots continuously scrape Github looking for API keys to abuse. Let’s walk through how to hide your API key from the code that lives on Github, but still make it accessible to your app. Run the following command in your terminal, substituting `whatever-your-API-key-is` for the string of characters that come after the apiKey variable in that block of code you just copied over. Don’t include the quotation marks:

```
  heroku config:set FIREBASE_API_KEY=whatever-your-API-key-is
```

_Remember that you must stop your server in order to do this. If your server is still running from before, you can press control + c to halt it._

Then run: 

```
  heroku config:get FIREBASE_API_KEY -s >> .env
```

In your `head.ejs` file, replace your API key with the environment variable we just created: `"<%= process.env.FIREBASE_API_KEY %>"`

#### 6. Add in the products you need

Next, return to your `head.ejs` file. See here that there’s a comment instructing you to add the SDKs for the products you want to use. SDK stands for “Software Development Kit.” It’s a useful tool companies put together to help developers build on their platform, involving libraries, relevant documentation, code samples, and other guides that help you build more easily. Copy that URL, then navigate to the page in your browser. 

Scroll to "Step 3: Add Firebase SDKs and initialize Firebase". Click the “From the CDN” option, since you’re going to load the code from Google’s servers. Today, you’re going to be using the “Auth” and “Realtime Database” products. Copy the line that loads the code for the authentication product — it looks like `
<script src="https://www.gstatic.com/firebasejs/6.0.2/firebase-auth.js"></script>` — then head to your `head.ejs` file and paste it under the first Firebase script tag. Then, if you scroll down to the “Available Firebase JS SDKs (from the CDN)” section, you can see that the reference for the “Realtime Database” product is `firebase-database`. Head back to your `head.ejs` file, copy the line you just added, then paste the code and modify `auth` to say `database` instead.

_Note: If you ever need some help figuring out what your code should look like, just check out the code in this repo for reference._

#### 7. Set up the authentication

The pop-up you copied your initial code from has a convenient link to the Firebase documentation. Click the “Getting Started” link, and find the “Authentication” section. You’re doing this on the web, so select that option. Since you’re using Google Sign-In, select that option, too.

Let’s use the Firebase SDK to build the sign-on function. Copy the first line that creates an instance of the Google provider object and head back to your `main.js` file. Paste that code inside of a new function called `handleSignIn()`. You can skip the optional steps for now, and copy the code block down at the bottom that will generate a sign-in pop-up. Paste that into your function as well. And just to make sure that your code is working, add a `console.log` function right after the sign-in portion of your function. In that, we’ll log the `user.email`, or the email returned in the `user` JSON object.
 
Great. Now that your function is written, you’ll need a way to call it. Go to your `index.ejs` page, and create a new button. Give it an `onClick` handler with your new function — `handleSignIn()` — and name it “Log In.”

Save everything, then go to your app in the browser and click the login button to check that it works. You should see a pop up asking you to sign in or select an account. 

If you happen to see an error, follow the link to the “Credentials” page. Add your email under “Support Email” and any other required information if asked, and save your settings. Then, head back to your app and try again.

Now, check your developer console to make sure it worked. To access your console, head to the “View” option, then “Developer,” then “JavaScript Console.” If you’re using a browser other than Chrome, these steps might be different, so just do a search to figure out how to access your console in that browser. You should see your email right there in the console, so you know that your login function is working.

Congratulations! You’ve set up a database, navigated the Firebase documentation, and allowed users to sign in to your app. 

## Part 2: Getting data into the database

_For each of these steps, make sure you reload the page that's running locally to check that it's working._

Now it's time for one of the most important steps in hooking up a database — getting data _into_ the database!

#### 1. Create a form

Users should be able to submit their own posts. For that, you’ll need to create a form. If your HTML skills are a bit rusty, check out the resource on building forms in the “Resources” section below. 

Give your form an `onSubmit` event handler of `handleMessageFormSubmit()`. That’s the function the form will call when the user clicks “Submit.” Give your form an action `action="#"`, since you’ll be handling your form submit using that function rather than something you declare in this action attribute. Giving the form this action will prevent your form from refreshing the page before the code in your `handleMessageFormSubmit()` function has time to run.

Then, create an `input` for your post title. Give it the `id` of `post-title`. Next, create a `textarea` for your post body. Give that the `id` of `post-body`. This way, you can grab the value later using jQuery. Finally, create a button to allow your users to submit the form. 

Finally, you can add a little text to help users know what to type in each field and some spacing to make your form look a little bit nicer. If you'd like to see an example, check out the code in the `index.ejs` page in this repo.

#### 2. Get the data ready to submit

Go into your `main.js` file and create that function — `handleMessageFormSubmit()`. In this function, you first must grab the values from the input fields in your form. Create a variable called `title` to hold your post title. Then, set it equal to the value in your input field. You can target the input field by typing: 

```
$("#post-title").val();
```

This grabs the value from that field. Copy that line, and modify it to work with your textarea.

To make sure that’s working, add a `console.log` of the value for the post title. Put the `title` variable inside the call. Then, save your work and refresh your web app’s page. Type some text in the input fields. Then, click the submit button, and check your developer console to make sure it’s pulling the data correctly.

Now that you know your code is pulling the data from the text fields, it’s time to send it to the database. You can create another function to do this. Inside your `handleMessageFormSubmit()` function, call a function named `addMessage(),` and pass in the two variables you just created — `postTitle` and `postBody`.

#### 3. Create your JSON object

Now it’s time to write the `addMessage()` function — make sure to pass the body and title in as variables. Next, you’ll need to put the data into a format that the database can easily parse and save — JSON. Create a variable called `postData`, then set it equal to some key/value pairs for the body and title, like so: 

```
  var postData = {
    title: postTitle,
    body: postBody
  }
```

This bit of code here sets the `title` key equal to the value in your `postTitle` variable, or the value that you pulled out of the text field, and the same for the `postBody` variable. Make sure to put the JSON object in brackets, and use commas in between the different elements.

#### 4. Read the documentation

Now you’re ready to send that data to the database. Let’s look at the documentation to figure out how to do that. Head back to the documentation, then to “Realtime Database,” which is the tool you’re using, and then “Web,” which is how you’re writing your code. 

Go to “Read and Write Data.” If you look at the first bit of code, it looks like you must first create a reference to your database like this: `var database = firebase.database();`. Copy that line, then paste it in your function. Then, if you look at the [example below](https://firebase.google.com/docs/database/web/read-and-write?authuser=0#basic_write), it looks like a `ref` call lets you put the data in a specific location. To save all the posts in a nice, tidy collection, add a `ref` call to your database reference, and call it `posts`. In the end, it should look like:

```
  var database = firebase.database().ref('posts');
```

Now, let’s look back at the example. It looks like this isn’t quite what you want because you won’t have a pre-existing ID, like a user ID, for each of your posts. So, let’s look around and see if there’s a better solution. 

Let’s check out the “Work with Lists of Data” [page](https://firebase.google.com/docs/database/web/lists-of-data?authuser=0) instead. It looks like this is closer to what you want — you want to append each new post after the last one. Copy the example, and change it to suit your needs. Instead of `postListRef`, the database reference that you made right above is just called `database`. Go ahead and change that. Then, instead of the brackets inside of the `newPostRef.set({...});` call, you should replace them with the JSON object you just created above, so it’ll set the title and body to the data pulled out of the form.

Do that, then test it out. Save your work, then go to your app and refresh. Try submitting a couple of posts to your database using your form. Then, go to your Firebase console and see if the data is in there. Click on “Develop,” then “Database.” Under the “Data” tab, you should see the “posts” reference, and the individual posts you just saved.

#### 5. Clearing out the text fields

Your app should now be successfully saving data to your database. Before you’re done, you need to take care of one last thing — when you hit “Submit,” it doesn’t clear the text out of your text fields. You could accomplish that easily with a page refresh.

You can use a tool called a callback for this. Callbacks are functions that are executed after another function has finished executing. They’re incredibly useful in writing JavaScript, so check out the article in the Resources section below that explains callbacks in more depth. Since you don’t want the page to refresh until you’re sure that the data was pushed to the database successfully, you’ll want to add a callback to your `addMessage()` function to refresh the page once that’s happened.

Let’s look at the Firebase documentation again to see if it has any guidance on writing callbacks. If you go back to the “Read and Write Data” section, you can see here in the table of contents that there’s a section for [Completion Callbacks](https://firebase.google.com/docs/database/web/read-and-write?authuser=0#add_a_completion_callback). It looks like you can add a callback function as another parameter in your “.set()” call. Copy everything after the JSON object in the example, and head back to your code. Paste it after the `postData` variable in your `.set()` call. 

Then, in the `else` case, which is what’s called if there’s no error, add the function that will trigger a page reload manually:

```
  window.location.reload();
```

The benefit of using a callback like this is that you can also write some code to execute if there was an error writing to your database, like code to display an error message on the screen. You can explore that on your own. Go to your app and refresh the page. Test out your new callback by submitting a post to the database. It should save successfully, and if you go to Firebase, you should see that it’s saved there, too. 

## Part 3: Retrieving and displaying data

Now it's time to take the data that’s in your database, retrieve it, and display it on the screen for the world to see. 

#### 1. Create a place in your HTML to display the posts

First, you’ll need to create a place to display that data in your HTML. In your `index.ejs` page, under your form, create a div with an `id` of `postListing`.

#### 2. Retrieve the posts on page load

Next, head to your `main.js` file. Create a function called `getPosts()`. Since the app should show the posts right away on the screen, let’s write a function to call `getPosts()` right when the page loads. You can use jQuery to help with that. At the top of your `main.js` file, write:

```
  $(document).ready(function(){
    getPosts();
  })
```

#### 3. Read the documentation and retrieve the posts

Again, let’s take a look at the Firebase documentation to figure out how to read the data out of our database. Return to the “Read and Write Data” section, and scroll down to [the section](https://firebase.google.com/docs/database/web/read-and-write?authuser=0#read_data_once) on reading data from the database. Since you’ll be displaying all the posts, not just one, you can just copy this second bit of code here:

```
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
  });
```

Paste it into your `getPosts()` function and modify it to fit your needs. Recall from the previous section that you called your collection `posts`, so change the text inside of tje `ref` call to `posts`. It looks like the posts get returned in the variable called `snapshot`, and you can get to that data using this `snapshot.val()` call. To make it clearer, instead create a variable called `posts`, and set it equal to `snapshot.val()`. Finally, `console.log` that variable to make sure it’s returning correctly. 

Save your work, then head to your app and refresh the page. Take a look at your console, and you should see the object returned here. The first part is the post key — every entry in your database will have one, which is like a unique ID. Then, inside of that post, you’ll find the body and title of the posts that you just saved.

#### 4. Display the data on the screen

Now that you know the data is getting returned correctly, you can work on displaying it on the screen. This next part will be familiar to anyone who understands basic coding concepts, even if the syntax is new to you.

You’re going to create a `for` loop to go through each element in this JSON object. Write:

```
  for(var postKey in posts) {
  
  }
```

That says, for each element in our `posts` object, set a variable called `postKey`. Then add brackets to finish out that `for` loop syntax. Then, inside of the loop, create a variable called `post` — that’s what we’re trying to pull out. You can identify each post by its `postKey`, so set that variable equal to `posts[postKey]`. Once again, logging things in your console can be an extremely useful way of understanding what your code is doing and how you can get to the data you want. If you’d like, feel free to add some `console.log`’s to your code to illuminate what’s going on under the hood.

Now that you have an individual post, you can take it and add it to your screen. First, you have to target the `div` in your HTML where you want to display your posts with jQuery. Recall that the div had the ID of `postListing`, so add that in the first part of the function. Then, use the `.append()` function, since you want each post to display after the posts before it. Inside of that function, create the HTML that you want to show on the screen. Add a `div` tag, and inside, add your data, which you can pull out using `post.title` and `post.body.` Separate the HTML, which is in quotes, from the data using plus signs — this helps you cobble together a string that will show the right information for each post. It should look like this:

```
      $("#post-listing").append("<div class='post'>"+post.title+" - "+post.body+"</div>");
```

Once your code is done, save your work, then head to your app and refresh it. You should see the posts show up here right underneath your form.

Congratulations! You’ve built a web app that can store and display user data. There are also other useful things you can do with your database, like updating and deleting entries. If you’d like to do that, check out the Firebase documentation to help you along, and test your code incrementally by logging things in your console to see what the code is doing.

Like we said before, building web apps is about trial and error. If something’s not working for you, Google it. Chances are, other people have run into exactly the same issues that you have, and you can often find solutions to your problems without too much trouble. 

Thank you for joining us to learn how to build your first web app. We wish you the best of luck as you continue to build something amazing. Happy coding!


## Additional resources

- Creating forms in HTML: https://www.w3schools.com/html/html_forms.asp
- Firebase user authentication documentation: https://firebase.google.com/docs/auth/web/google-signin?authuser=0
- A guide to callbacks: https://codeburst.io/javascript-what-the-heck-is-a-callback-aba4da2deced
- Firebase reading and writing documentation: https://firebase.google.com/docs/database/web/read-and-write?authuser=0
