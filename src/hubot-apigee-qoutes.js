// Description
//   Search for Apigee Quotes by customers
//
// Configuration:
//   HUBOT_APIGEE_QUOTES_URL
//
// Commands:
//   hubot quote <customer> - 
//
//
// Author:
//   mukundha@apigee.com <mukundha@apigee.com>
//
var request = require('request')
module.exports = function(robot) {
	robot.respond(/quote (.*)/i, function(msg){           	
        var account = msg.match[1]
        getQuote(account,msg)
    })
}

function getQuote(account,msg){
	var url = process.env.HUBOT_APIGEE_QUOTES_URL
	var ql = 'select * where customer contains \'' + account + '*\''
	request({
        url:url + '?ql=' + ql 
    },function(error,response,body){
		var b = JSON.parse(body)
		b.entities.forEach(function(e){
			var by = e.by
			if(e.title){
				by+= ', ' + e.title
			}
			if ( e.customer){
				by+= ', ' + e.customer
			}
		  	msg.send('>' + by)
		  	msg.send('> ```' + e.quote + '```')
		})
	})
}