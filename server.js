var express = require('express');
var app = express();


var urldb = require('./urldb.js')();



dblen = Object.keys(urldb).length;
dbkeys = Object.keys(urldb).slice(0);
//baseURL = 'http://10.7.64.182:3000'
baseURL = 'http://10.0.0.12:3000'
assetURL = 'https://s3-us-west-2.amazonaws.com/onesec/sein/'



app.get('/', function (req, res) {
  var reshtml = '<html><head><title>onesecond.tv</title><style>#controls{height:40px;width:auto;text-align:center;color:#FFF;}#controls a{color:#fff;margin-left:20px;margin-right:20px;}#about {position: absolute;top: 10px;right: 0px; width: 100px; height: 50px; color: #ffffff;}#about a{color: #FFF;}#cont{width:900px;height: 675px;position:absolute;top: 10%; left:10%;}body{background-color: #000000;}</style></head><body><div id="cont"><div id="controls"><a href="javascript: (function(){for(var e=document.getElementsByTagName(\'video\'),n=0;n<e.length;n++)e[n].play()})();">PLAY ALL (mobile)</a> <a href="javascript: (function(){for(var e=document.getElementsByTagName(\'video\'),n=0;n<e.length;n++)e[n].pause()})();">PAUSE ALL</a> <a href="javascript: (function(){location.reload();})()">NEW BATCH</a></div>';
  reshtml += getHTML();
  reshtml += '</div></div><div id="about"><a href="'+assetURL+'about.html">ABOUT</a></div><script>'+
  'function playtimer(){for(var e=0;e<v.length;e++)v[e].play();c++>2&&clearInterval(t)}var t=setInterval(function(){playtimer()},1e3),c=0,v=document.getElementsByTagName("video");'+
  '</script></body></head>'
  res.send(reshtml);
});

app.get('/i/:name/:text*?', function(req, res) {
	var txt = undefined;
	if (req.params.text) {
		console.log(req.params.text);
		txt = new Buffer(req.params.text, 'base64').toString();
	}
    res.send(getFS(req.params.name,txt));
});



app.use(express.static('public'));

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});

function getFS(id,text) {
msg = text ? text : '';
//pfx = text ? '../../' : '../'
pfx = assetURL;
src = assetURL + urldb[id];


return '<html><head> <title>onesecond.tv</title> <link rel="stylesheet" href="https://s3-us-west-2.amazonaws.com/onesec/sein/css/bootstrap.min.css"> <link rel="stylesheet" href="https://s3-us-west-2.amazonaws.com/onesec/sein/css/featherlight.min.css"> <link rel="stylesheet" href="https://s3-us-west-2.amazonaws.com/onesec/sein/css/styles.css"> <script src="https://s3-us-west-2.amazonaws.com/onesec/sein/js/jquery.js"></script> <script src="https://s3-us-west-2.amazonaws.com/onesec/sein/js/bootstrap.min.js"></script> <script src="https://s3-us-west-2.amazonaws.com/onesec/sein/js/featherlight.min.js"></script> <script src="https://s3-us-west-2.amazonaws.com/onesec/sein/js/b64.js"></script> <script src="https://s3-us-west-2.amazonaws.com/onesec/sein/js/app.js"></script> </head><body> <div id="caption"> <p id="ctxt">'+msg+'</p></div><div id="bb" style="background-color: #000000;"> <video width="281" height="211" autoplay="autoplay" loop="true" id="bgvid" > <source type="video/webm" src="' + src + '.webm"> <source type="video/mp4" src="' + src + '.mp4"></video> </div><div id="sharebox" class="text-center" style="visbility:hidden"> <p class="lead">Send a Costanzagram</p><input type="text" class="form-control" placeholder="Add a caption!" id="cap"> <br><input type="text" class="form-control" id="shareurl"><br><button type="button" class="btn btn-danger btn-sm pull-left" id="btncn">Cancel</button> <button type="button" class="btn btn-warning btn-sm" id="btncl">Clear</button> <button type="button" class="btn btn-success btn-sm" id="btnsa">Select URL</button> </div><script>$(function(){createUI(\'' + baseURL + '\',\'' + id + '\')});</script></body></head>'

}

function getHTML() {
	var rhtml = '';
	var amount = 9;
	var itms = getrand(amount);
	itms.forEach(function(u,i) {
		var src = assetURL + u[0];
		if ((i == 3) || (i == 6)) {
			rhtml+='</div>'
			rhtml+='<div>'
		} else if (i == 0) {
			rhtml += '<div>'
		}

		//rhtml += '\n<video width="281" height="211" autoplay="autoplay" loop="true" onclick="javascript: window.location.replace(\'i/' + u[1] + '\');">'+
		rhtml += '\n<video width="281" height="211" autoplay="autoplay" loop="true" onclick="javascript: window.open(\'' + baseURL + '/i/' + u[1] + '\');">'+
		'\n<source type="video/webm" src="' + src + '.webm">'+
		'<source type="video/mp4" src="' + src + '.mp4">'+
		'</video>'	

		if (i == amount) {
			rhtml+= '</div>'
		}
	});
	return rhtml;
}

function getrand(amt) {
	var arr = []
	while(arr.length < amt){
		var randomnumber=Math.ceil(Math.random()*dblen)
		var found=false;
		for(var i=0;i<arr.length;i++){
			if(arr[i]==randomnumber){found=true;break}
		}
		if(!found)arr[arr.length]=randomnumber;
	}
	return arr.map(function(i) {
		return [urldb[dbkeys[i]],dbkeys[i]];
	});
}

// (function(){
	// var v = document.getElementsByTagName('video');
	// for (var i = 0; i < v.length; i++) {
	// 	v[i].play();
	// }
// })();




// var t = setInterval(function () {playtimer()}, 1000);
// var c = 0;
// var v = document.getElementsByTagName('video');
// function playtimer() {
// 	console.log('playing');
//  	for (var i = 0; i < v.length; i++) {
//  		v[i].pause();
//  	}
//     if (c++ > 5)
//     	clearInterval(myVar);
// }