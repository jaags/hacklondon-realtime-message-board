new WOW().init();

var urlRegExp = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)

var user = new Stamplay.User().Model;
user.currentUser()
.then(function(){
  if(user.instance._id){
  	window.User = user.instance
  	$('#logged').show();
  	$('#not-logged').hide();
  }else{
    $('#login-button').show();
  }
})

$('#login-button').on('click',function(){
	user.login('github')
})

$('#tofocus').on('click', function(){ $('#console-input').focus()})
$('#console-input').focus()  

//Prepare mustache template
var temp = $('#message-template').html();
Mustache.parse(temp); 

//collect messages
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


$('#console-input').keyup(function(e){
  if(e.keyCode == 13){
    if(!$('#console-input').val()==''){
    	var message = new Stamplay.Cobject('message').Model
      //stamplay sdk create custom obj
    	message.set('comment', $('#console-input').val());
    	$('#console-input').val('');
    	message.set('pictureOwner', User.profileImg);
    	message.set('username', User.identities.github._json.login);
    	message.save();
    }
  }
});
  

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



function addHref(data) {
    var replace = data.comment.match(urlRegExp);
    for(var i=0;i<replace.length;i++){
      var parseUrl = '<a href="'+replace[i]+'" target="blank">'+replace[i]+'</a>'
      data.comment = data.comment.replace(replace[i],parseUrl)
    }
  }