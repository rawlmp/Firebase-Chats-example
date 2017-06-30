$.getJSON('nysl-sheet.json', function(data){
    createTable(data);
})



document.getElementById("login").addEventListener("click", login);
document.getElementById("create-post").addEventListener("click", function() {
    writeNewPost(getCurrentUser(), "yujuu");
});

function writeNewPost(user, body, chat) {
    // A post entry.
    var postData = {
        // uid: user.uid,
        name: user.displayName,
        body: body,
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child(chat).push().key;

    var updates = {};
    updates['/'+chat+'/' + newPostKey] = postData;

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

function getPosts(chat) {

    firebase.database().ref(chat).on('value',function(snapshot) {
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
        var $messages = $('<div/>').attr('id', 'cont_' + element.shortName).addClass('messages');
        var $postMessage = $('<input/>').attr('id', element.shortName).addClass('postMessage'); 
        var $button = $('<button/>').attr('data-match', element.shortName).addClass('sendButton').html('Go ' + element.shortName + '!!!');

        $logoContainer.append($logo);
        $chat.append($chatName, $logoContainer, $messages, $postMessage, $button);
        chats.append($chat);
    }

    $('.sendButton').on('click', function(){
        var team = $(this).attr('data-match');
        var newpost = $('#' + team).val();
        var postContainer = $('#cont_' + team);

        writeNewPost(getCurrentUser(), newpost, team);
        refreshChats(team, postContainer);

    })
}


function refreshChats(team, container){
    //TODO: Acabar de completar el retorno de los post de firebase
    firebase.database().ref(team).on('value',function(snapshot) {
        console.log(snapshot.val());
    });

    // for (var i = 0; i < content.length; i++) {
    //     var element = content[i];
    //     console.log(element);    
    // }

}