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
        time: moment().format(),
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
        // console.log(snapshot.val());
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
    // console.log(data.Teams[0].logo);
    var chats = $('.chats');
    for (var i = 0; i < data.Teams.length; i++) {
        var element = data.Teams[i];
        var $chat = $('<div/>').addClass('chat');
        var $chatName = $('<h4/>').addClass('chatName').html(element.name);
        var $logoContainer = $('<div/>').addClass('logoContainer');
        var $logoContainer = $('<div/>').addClass('logoContainer');
        var $logo = $('<img>').addClass('logo').attr('src', 'icons/' + element.logo);
        var $messages = $('<div/>').attr('id', 'cont_' + element.shortName).addClass('messages');
        var $postAndButton = $('<div/>').addClass('postAndButton');
        var $postMessage = $('<input/>').attr('id', element.shortName).attr('placeholder','write your post...').addClass('postMessage'); 
        var $button = $('<button/>').attr('data-match', element.shortName).addClass('sendButton').html('Go');

        $logoContainer.append($logo);
        $postAndButton.append($postMessage, $button);
        $chat.append($chatName, $logoContainer, $messages, $postAndButton);
        chats.append($chat);
    }

    $('.sendButton').on('click', function(){
        var team = $(this).attr('data-match');
        var newpost = $('#' + team).val();

        if($('#' + team).val().length == 0){
            return;
        }
        
        writeNewPost(getCurrentUser(), newpost, team);
        refreshChats(team);

    })
}


function refreshChats(team){
    firebase.database().ref(team).on('value',function(snapshot) {
        var postContainer = $('#cont_' + team);
        var input = $('#' + team);
        var object = snapshot.val();
        postContainer.empty();
        input.val('');

        for (var key in object) {
            var element = object[key];
            var isMe = getCurrentUser().displayName == element.name ? true : false;
            if(!isMe){
                var everyPost = $('<div/>').addClass('everyPost');
                var postText = $('<div/>').addClass('postText');                
            }else{
                var everyPost = $('<div/>').addClass('everyPost2');
                var postText = $('<div/>').addClass('postText2');                
            }
            var nameTime = $('<div/>').addClass('nameTime');
            var name = $('<div/>').addClass('name');
            var time = $('<div/>').addClass('time');
            

            name.append(element.name.split(' ')[0]);
            time.append(moment(element.time, 'YYYY-MM-DDThh:mm:ss+02:00').fromNow());
            nameTime.append(name, time);
            postText.append(element.body);
            everyPost.append(nameTime, postText);
            postContainer.append(everyPost);
        }

        postContainer.animate({ scrollTop: postContainer.prop("scrollHeight")}, 1000);
        
    });
}