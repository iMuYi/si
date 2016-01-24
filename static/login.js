
(function() {
	'use strict';
    var login = document.getElementById("login");

    login.addEventListener("click",
    		function() {
    		    var userid = document.getElementById("userid").value;
                var password = document.getElementById("password").value;
            	$.post("/classify/check/",{"userid" : userid,"password" : password},
               			 function(data,status){
               			 	//var obj = jQuery.parseJSON(data);
               			 	alert('ok');
               			 	//if (obj['data']=='success'){setInterval("blank()",2000);}
               			 	}
						);
           });
       }()

);
function blank(){window.location.href="/classify/blank.html";}