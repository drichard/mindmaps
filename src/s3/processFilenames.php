 <?php
 
 $url = $_POST["url"];
 
 $exists = file_exists('.//mm' . $url . '.json' );
 
 if(!$exists)
 {
 header('HTTP/1.1 413 Error');
 header('Content-Type: text/xml');
 echo " ";
}
else
{
 header('HTTP/1.1 200 OK');
 header('Content-Type: text/plain');
 
 $doc = file_get_contents('.//mm' . $url . '.json' );
 echo $doc;
 }

?>