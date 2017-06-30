document.getElementById("login").addEventListener("click", login);
document.getElementById("create-post").addEventListener("click", function() {
    writeNewPost(getCurrentUser(), "yujuu");
});

function writeNewPost(user, body) {
    // A post entry.
    var postData = {
        uid: user.uid,
        name: user.displayName,
        body: body,
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;

    var updates = {};
    updates['/posts/derbis/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
}

function getCurrentUser() {
    console.log(firebase.auth().currentUser);
    return firebase.auth().currentUser;
}


function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function getPosts() {

    firebase.database().ref('posts').on('value',function(snapshot) {
        console.log(snapshot.val());
    });

}