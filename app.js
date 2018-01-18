Vue.component('message',{
  props : ['message'],
  template : '<div><strong>{{message.from}}</strong> => <i>{{message.text}}</i></div>',
})

var chattr = new Vue({
  el : '#chattr',
  data : {
    // app info
    title : 'Chattr',
    version : '0.1.0',
    username : 'Set Your Username',
    messages : [
    ],
    waitingFor : 0,
  },
  methods : {
    createNewMessage : function(){
      var mBox = $('#message');
      var newMessage = mBox.val();
      $.post('server.php?action=newMessage',{ name : window.chattr.username, text : newMessage }, function(data){
        console.log('Done');
      });
      mBox.val('').focus();
    },

    setUsername : function() {
      this.username = $('#username').val();
      $('#message').focus();
    }
  }
});

$(document).ready(function(){
  getStartFrom();
});

function getStartFrom(){
  $.ajax({
    url: 'server.php?action=startFrom',
    success : function(data){
      var res = $.parseJSON(data);
      if(res.ack == 'true'){
        window.chattr.waitingFor = res.val - 1;
        awaitNewMessage();
      }
    }
  });
}

function awaitNewMessage(){
  var id = window.chattr.waitingFor;
  $.ajax({
    url : 'server.php?action=getMessage&id='+id,
    success : function(data){
      var res = $.parseJSON(data);
      if(res.ack == 'true'){
        var message = $.parseJSON(res.contents);
        window.chattr.messages.push({from : message.from, text : message.text});
        window.chattr.waitingFor = window.chattr.waitingFor + 1;
      }
    }
  });
  window.setTimeout(function(){awaitNewMessage();},100);
}
