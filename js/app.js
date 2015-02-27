/*
* UI effects and template init
*/
$('#tofocus').on('click', function(){ $('#console-input').focus()})
$('#console-input').focus()  
new WOW().init();

//Init mustache template for our user messages
var temp = $('#message-template').html();
Mustache.parse(temp); 
var urlRegExp = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)




/*
* Init user
* https://github.com/Stamplay/stamplay-js-sdk#user
*/
var user = new Stamplay.User().Model;
user.currentUser()
.then(function(){
  //let's check if the user is logged
  (user.instance._id) ? $('#console-message').html('$hackLondon : whassup?') : $('.guest-content').show();
})




/*
* Listeners
*/
$('#login-button').on('click',function(){
  //Start Github Login OAuth flow
	user.login('github')
})

$('#console-input').keyup(function(e){
  if(e.keyCode == 13){
    if(!$('#console-input').val()==''){
      
      //stamplay sdk create custom obj
      var comment = $('#console-input').val();
      var message = new Stamplay.Cobject('message').Model
      message.set('comment', comment);      
      message.set('pictureOwner', User.profileImg);
      message.set('username', User.identities.github._json.login);
      message.save();

      //clean console content
      $('#console-input').val('');
    }
  }
});




/*
* Fetch messages created so far 
*/
var feed = new Stamplay.Cobject('message').Collection;
  feed.fetch({page:1, per_page:100, sort: '-dt_create'}).then(function(){
  	feed.instance.forEach(function(elem){    		
  		var d = new Date(elem.instance.dt_create)
			elem.instance.date = d.toLocaleString('en-EN');

      if(urlRegExp.test(elem.instance.comment))
          addHref(elem.instance);    

		  var rendered = Mustache.render(temp, elem.instance);
			$('#feed-stream').append(rendered);
		})    		
});




/*
* Pusher listeners
*/
var pusher = new Pusher('ea9c279021aed93c3c28');
var channel = pusher.subscribe('public');
channel.bind('message', function(data) {
	
  var d = new Date(data.dt_create)
  data.date = d.toLocaleString('en-EN');
  data.comment = data.comment.replace('&quot;', '"').replace('&#x27;',"'").replace('&lt;','<').replace('&gt;','>')
  
  if(urlRegExp.test(data.comment))
    addHref(data);    

	var rendered = Mustache.render(temp, data);
	$('#feed-stream').prepend(rendered)
});



/*
* Utility function to look for url in a message and write an <a> HTML tag
*/
function addHref(data) {
    var replace = data.comment.match(urlRegExp);
    for(var i=0;i<replace.length;i++){
      var parseUrl = '<a href="'+replace[i]+'" target="blank">'+replace[i]+'</a>'
      data.comment = data.comment.replace(replace[i],parseUrl)
    }
  }