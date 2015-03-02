# hacklondon-realtime-message-board
A realtime message board powered by Stamplay to demo at http://hacklondon.org

![Hacklondon](https://blog.stamplay.com/wp-content/uploads/2015/02/Schermata-2015-02-27-alle-16.55.13.png "Hacklondon")

At [Stamplay](https://stamplay.com) we love events where the hacker ethos of students spread all over the place. This events cultivate communities where aspiring hackers have the opportunity to learn, build, and share their creations with the world. This is a realtime message board built with Stamplay and Pusher with client-side only code.

In this app users can signup with Github and leave a message on the board that gets updated in realtime. Here is what you will get: [https://hacklondon.stamplayapp.com](http://hacklondon.stamplayapp.com)

-----------------------
# Anatomy

This demo is built around the following building blocks

* [Users](https://www.stamplay.com/docs#user)
* [Custom Objects](https://www.stamplay.com/docs#customobject)
* [Email](https://www.stamplay.com/docs#email)

## Requirements

Go to [your account](http://editor.stamplay.com/apps) and create a new app.

## Configuring the components

After creating a new app on [Stamplay](https://editor.stamplay.com) let's start by picking the component we need in our app. Lets see one-by-one how they are configured:

### User
Since this is something for developers we decided to make our users signup with our last OAuth integration, Github. To get your own credentials go to [https://github.com/settings/applications](https://github.com/settings/applications) and click on "Register a new app". Fill the "Authorized Redirect URIs" with the URL: **https://[appId].stamplayapp.com/auth/v0/github/callback** and you'll have your ClientId and Secret to fill the fields as you can see from the image below. 

![Github OAuth](http://blog.stamplay.com/wp-content/uploads/2014/09/Schermata-2014-09-09-alle-16.27.56.png "Github OAuth")

### Custom Object
Let's define the data model for this app that is called **Message** and is defined as follows:

##### Message

* Name: `comment`, Type: `string`, required, the question’s title
* Name: `avatar`, Type: `string`, required, the question’s body
* Name: `username`, Type: `string`, required, the question’s body
* Name: `img`, Type: `string`, required, the question’s body

After completing this Stamplay will instantly expose REST APIs for our new resources at this URL: `https://APPID.stamplayapp.com/api/cobject/v0/message`
