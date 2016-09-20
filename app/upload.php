<?php

$images_arr = array();
  foreach($_FILES['upload']['name'] as $key=>$val){
      //upload and stored upload
      $target_dir = "q1zEx3KPMg8BoGwVmd/";
      $target_file = preg_replace('/\s+/', '-', $target_dir.$_FILES['upload']['name'][$key]);
      $fileName = $_FILES['upload']['name'][$key];
      $checkStr = "htaccess";
      $fileSize = $_FILES['upload']['size'][$key];
      if(strpos($fileName, $checkStr) !== false || $fileSize >= 10485760) {
        echo('rejected');
      } else {
        if(move_uploaded_file($_FILES['upload']['tmp_name'][$key],$target_file)){
            $images_arr[] = $target_file;
        }
      }
  }

?>
