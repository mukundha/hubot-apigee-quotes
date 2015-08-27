// Description
//   Search for Apigee Quotes by customers
//
// Configuration:
//   HUBOT_APIGEE_QUOTES_URL - API url
// 	 HUBOT_APIGEE_QUOTES_KEY - API Key
//
// Commands:
//	 hubot quote - gives a random Customer quote
//   hubot quote <customer> - gives quote by this customer
//   hubot quote list  - gives list of customer quotes available
//
// Author:
//   mukundha@apigee.com <mukundha@apigee.com>
//
var request = require('request')

var url = process.env.HUBOT_APIGEE_QUOTES_URL
var key = process.env.HUBOT_APIGEE_QUOTES_KEY

module.exports = function(robot) {
	
	robot.respond(/quote list/i, function(msg){           	
        getCustomers(msg)
    })

	robot.respond(/quote (.*)/i, function(msg){           	
        var account = msg.match[1]
        getQuote(account,msg)
    })
}

function getQuote(account,msg){
	
	var ql = 'select * where customer contains \'' + account + '*\''
	request({
        url:url + '?ql=' + ql + '&apikey=' + key
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

function getCustomers(msg)
{
	var ql = 'select customer'
	request({
        url:url + '?ql=' + ql + '&apikey=' + key + '&limit=100'
    },function(error,response,body){
		var b = JSON.parse(body)
		var customers = []
		b.list.forEach(function(l){
			if(customers.indexOf(l[0]) < 0)
				customers.push(l[0])		  	
		})
		msg.send('```' + customers + '```')
	})
}