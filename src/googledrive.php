<?php
	/*
     * Check to see if the 'state' parameter exists, with
     * the mode and specified file IDs (on open) or a folder parentId
     * (on create).
     */

      /*
       * State should always be defined
       */
      if (isset($_GET['state'])) {
        $state = json_decode(stripslashes($_GET['state']));

        if (isset($state->ids))
          header('Location: https://yourwebsite.com/#m:gd' . $state->ids[0]);
        else
          header('Location: https://yourwebsite.com/');

      } else {
      	header('Location: https://yourwebsite.com/');
      }
?>