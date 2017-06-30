$.getJSON('nysl-sheet.json', function(data){
    createTable(data);
})



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
/*  <div class="chats">
      <div class="chat">
        <h3 class="chatName">Nombre Chat</h3>
        <div class="logoContainer">
          <img class='logo' src="icons/escudo1.png" alt="thumbnail">
        </div>
        <div class="messages"></div>
        <div class="postMessage"></div>
        <button class="sendButton" value='Post'>Post Message</button>
      </div>*/

function createTable(data){
    console.log(data.Teams[0].logo);
    var chats = $('.chats');
    for (var i = 0; i < data.Teams.length; i++) {
        var element = data.Teams[i];
        var $chat = $('<div/>').addClass('chat');
        var $chatName = $('<h4/>').addClass('chatName').html(element.name);
        var $logoContainer = $('<div/>').addClass('logoContainer');
        var $logoContainer = $('<div/>').addClass('logoContainer');
        var $logo = $('<img>').addClass('logo').attr('src', 'icons/' + element.logo);
        var $messages = $('<div/>').addClass('messages');
        var $postMessage = $('<input/>').addClass('postMessage'); 
        var $button = $('<button/>').attr('data-match', element.shortName).addClass('sendButton').html('Go ' + element.shortName + '!!!');

        $logoContainer.append($logo);
        $chat.append($chatName, $logoContainer, $messages, $postMessage, $button);
        chats.append($chat);
    }
}