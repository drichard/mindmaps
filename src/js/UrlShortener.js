/* URL shortener service from bit.ly to
*	shorten urls.
*
*/

mindmaps.fireShortener = function (navUrl) 
{
	if (document.location.protocol === 'file:') {
		return;
	}
	var url=navUrl;
    var username=""; //Register for an account at bit.ly/a/sign_up
    var actoken="";
    $.ajax({
      url:"https://api-ssl.bitly.com/v3/shorten?access_token="+actoken+"&longUrl="+encodeURIComponent(url),
      dataType:"json",
      success:function(v) {
      	if(v.status_code==200) {
      		var bit_url=v.data.url;
        	mindmaps.currentShortUrl = bit_url;
      	} else{
      		mindmaps.currentShortUrl = "Network Error";
      	}
      }
    });
};
		