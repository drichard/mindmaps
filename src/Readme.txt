If you have any doubt, feel free to contact me at cvazeem@gmail.com

Requirements
--
A simple webserver and PHP (Version 5 or above) if you want to save public mindmaps. Otherwise PHP is not needed.

Extract the files and place it in the root directory of your website.

'S3' folder is used to save the public mindmap files. If you are in linux, make that folder writable, ie, chmod 666

i. Google Drive

Note: This sign-in will not work after February 6, 2023. Google is making changes. Goto the link below to know more about it.
https://developers.googleblog.com/2021/06/upcoming-security-changes-to-googles-oauth-2.0-authorization-endpoint.html

How to setup Google Drive:
a. Setup apiKey, clientId, appId from Google Cloud console. Use your website name. Goto https://console.cloud.google.com/
b. Open js/GoogleDrive.js
c. Fill in 'apiKey, clientId, appId' which you obtained from the step, a.

ii. S3 storage (public storage)
Make sure there is 'S3' folder in the root path. Make sure it contains two php files, process.php and processFilenames.php . Make 'S3' folder writable. If you are in linux, make that folder writable, ie, chmod 666
Edit 'js/Config.js' and replace 'yourwebsite.com' with your website url.

iii. Sharemap.js
To share your public map via Facebook, do the following changes.

a. Create an App in facebook. Make sure your website is allowed as origin.

Open Sharemap.js and make the following changes.
a. Locate this line (number 28) and change https://www.facebook.com/dialog/feed?app_id=11111111&'
to app_id='With your facebook app id'

b. Change http://mindmapmaker.org/mind-map-maker.png (on line number 32) to your website
c. Change https://app.mindmapmaker.org (on line number 34) to your website

iv. UrlShortener.js
To share map via 'bit.ly' make changes in js/UrlShortener.js
//Register for an account at bit.ly/a/sign_up
Change 'var username="";' (on line number 12) with your username from bit.ly
Change 'var actoken="";' (on line number 13) with your actoken from bit.ly

v. googledrive.php
googledrive.php file is used to open a file from Google Drive where you previously saved. 
Open 'googledrive.php' file and change https://yourwebsite.com/ to your website.


Use the following nginx configuration too. My webserver is 'nginx'. This configuration works for nginx. If you use apache, you need to change the configuration.

//////
	if ($arg_state) {
	  set $test  P;
	}
	
	if ($uri !~ /googledrive\.php$) {
		set $test  "${test}C";
	}

	if ($test = PC) {
	 rewrite ^.*$ googledrive.php permanent;
	}
/////
