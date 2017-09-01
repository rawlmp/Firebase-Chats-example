firebase.auth().onAuthStateChanged(function(user) {
if (user) {
    $('#login').hide();
    $('#logout').show();
    $('#welcome').hide();
    $('#welcome2').hide();
    $('#info').show();
    $('.container').show(); 
    $.getJSON('nysl-sheet.json', function(data){
    
        var chats = $('.chats');
        // chats.empty();
        createTable(data);
    })
}else{
    $('#login').show();
    $('#logout').hide();
    $('#welcome').show();
    $('#welcome2').show();
    $('#info').hide();
    $('.container').hide();       
}
});

//Enable notifications on Chrome
// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); 
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    });

    function notifyMe(msg) {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('Notification title', {
        icon: 'https://pbs.twimg.com/media/C1Uv6r0WQAAOHCO.jpg',
        body: msg,
        });

        notification.onclick = function () {
        // window.location.reload();
        this.close();    
        };

    }

}


document.getElementById("login").addEventListener("click", login);
document.getElementById("logout").addEventListener("click", logout);


function writeNewPost(user, body, chat) {
    // A post entry.
    var postData = {
        // uid: user.uid,
        name: user.displayName,
        time: moment().format(),
        body: body,
        thumbnail: user.photoURL
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child(chat).push().key;

    var updates = {};
    updates['/'+chat+'/' + newPostKey] = postData;

    firebase.database().ref().update(updates);
}

function getCurrentUser() {
    // console.log(firebase.auth().currentUser);
    return firebase.auth().currentUser;
}


function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}
function logout(){
    firebase.auth().signOut().then(function() {
    });
}
function getPosts(chat) {
    firebase.database().ref(chat).on('value',function(snapshot) {
        // console.log(snapshot.val());
    });
}

function createTable(data){
    // console.log(data.Teams[0].logo);
    var chats = $('.chats');
    for (var i = 0; i < data.Teams.length; i++) {
        var element = data.Teams[i];
        var $flipContainer = $('<div/>').addClass('flip-container').attr('data-parent', element.shortName);
        var $flipper = $('<div/>').addClass('flipper');
        var $front = $('<div/>').addClass('front').addClass("disabled");
        var $back = $('<div/>').addClass('back');

        var $chat = $('<div/>').addClass('chat');
        var $nameAndLogo = $('<div/>').attr('data-nal', element.shortName).hide();
        var $chatName = $('<h4/>').addClass('chatName').html(element.name);
        var $logoContainer = $('<div/>').addClass('logoContainer');
        var $budget = $('<div/>').addClass('budget').attr('data-budget', element.shortName).html('New!').hide();
        var $logo = $('<img>').addClass('logo').attr('src', 'icons/' + element.logo);
        var $logo2 = $('<img>').addClass('logo2').attr('src', 'icons/' + element.logo).css('pointer-events','none');        
        var $messages = $('<div/>').attr('id', 'cont_' + element.shortName).attr('data-messages', element.shortName).addClass('messages').hide();
        var $loader = $('<div/>').addClass('loader').attr('data-loader', element.shortName).hide();
        var $postAndButton = $('<div/>').addClass('postAndButton').attr('data-pab', element.shortName).hide();
        var $postMessage = $('<input/>').attr('id', element.shortName).attr('placeholder','write your post...').addClass('postMessage'); 
        var $button = $('<button/>').attr('data-match', element.shortName).addClass('btn btn-sm btn-default').addClass('glyphicon glyphicon-play').addClass('sendButton');
        var $button2 = $('<button/>').attr('data-match', element.shortName).addClass('btn btn-md btn-success').addClass('showButton').html('Subscribe to chat');
        var $fakeButton = $('<button/>').attr('data-fake', element.shortName).addClass('btn btn-sm btn-info').addClass('fakeButton').html('Send Fake Message').hide();
        

        $logoContainer.append($logo);
        $nameAndLogo.append($chatName, $logoContainer);
        $postAndButton.append($postMessage, $button);
        $messages.append($loader);
        $chat.append($nameAndLogo, $messages, $postAndButton, $button2);
        $back.append($chat);
        $front.append($logo2, $budget, $fakeButton);
        $flipper.append($front, $back);
        $flipContainer.append($flipper);
        chats.append($flipContainer);

        var container_width = parseFloat($chat.css('width')) + parseFloat($chat.css('margin')) *2;
        var container_final_width = container_width * data.Teams.length

    }
        $('.container').slideDown('slow');
        console.log(container_final_width);
        chats.css("width", container_final_width);
    

    $('.sendButton').on('click', function(event){
        var team = $(this).attr('data-match');
        var newpost = $('#' + team).val();

        if($('#' + team).val().length == 0){
            return;
        }

        writeNewPost(getCurrentUser(), newpost, team);
        // refreshChats(team, event, );
    })

    $('.showButton').on('click', function(event){
        var card = $(this.parentElement.parentElement.parentElement.childNodes["0"]);
        card.removeClass("disabled");
        var team = $(this).attr('data-match');
        $('.back').find('[data-pab="' + team + '"]').show();
        $('.front').find('[data-fake="' + team + '"]').show();
        $(this).hide();
        var nameAndLogo = $('.back').find('[data-nal="' + team + '"]');
        console.log(nameAndLogo);
        nameAndLogo.slideDown('slow');
        var messages = $('.back').find('[data-messages="' + team + '"]');
        messages.slideDown('slow', function(){
            $('.back').find('[data-loader="' + team + '"]').show();            
            refreshChats(team, event);      
        });
        
        
    })

    $('.front').click(function(event){
        var parent = event.target.parentNode.parentNode;
        parent.classList.toggle("flip");
        var team = parent.getAttribute('data-parent')
        $('.flip-container').not(parent).removeClass('flip');
        var budget = $('.front').find('[data-budget="' + team + '"]');
        budget.hide();
    })

    $('.fakeButton').on('click', function(event){
        var team = $(this).attr('data-fake');
        fakeMessage(team);
    })
    
}

function fakeMessage(chat){
    var postData = {
        // uid: user.uid,
        name: 'Faker',
        time: moment().format(),
        body: 'this is a fake message',
    };

    var newPostKey = firebase.database().ref().child(chat).push().key;

    var updates = {};
    updates['/'+chat+'/' + newPostKey] = postData;

    firebase.database().ref().update(updates);
}


function refreshChats(team, event){
    // var parent = event.target.offsetParent.offsetParent.offsetParent;
    // console.log(event);
    firebase.database().ref(team).on('value',function(snapshot) {
        // console.log(team);
        var postContainer = $('#cont_' + team);
        var input = $('#' + team);
        var object = snapshot.val();
        var me = getCurrentUser().displayName;
        postContainer.empty();
        input.val('');
        console.log(object == null);
        if(object != null){
            var parent2 = $('.chats').find('[data-parent="' + team + '"]');
            var budget = $('.front').find('[data-budget="' + team + '"]');
            if(!parent2.hasClass('flip')){
                budget.show();
                var msg = 'New message in ' + team + ' group';
                notifyMe(msg);
            }else{
                budget.hide();
            }

            for (var key in object) {
                var element = object[key];
                var isMe = me == element.name ? true : false;
                if(!isMe){
                    var everyPost = $('<div/>').addClass('bubble me');
                    var postText = $('<div/>').addClass('postText');                
                }else{
                    var everyPost = $('<div/>').addClass('bubble you');
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
        }else{
                postContainer.html('No messages yet...');
            }

        postContainer.animate({ scrollTop: postContainer.prop("scrollHeight")}, 1000);
        
    });
}