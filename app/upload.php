<?php
// header('Content-Type: application/json');
//
// $uploaded = [];
// $allowed = ['mp4', 'jpg', 'png'];
//
// $succeeded = [];
// $failed = [];
//
// if (!empty($_FILES['file'])) {
//   foreach($_FILES['upload']['name'] as $key => $name) {
//     if($_FILES['file']['error'][$key] === 0) {
//       $temp = $_FILES['file']['tmp_name'][$key];
//
//       $ext = explode('.', $name);
//       $ext = strtolower(end($ext));
//
//       $file = md5_file($temp) . time() . '.' . $ext;
//
//       if(in_array($ext, $allowed) === true && move_uploaded_file($temp, "uploadedFiles/{$file}") === true) {
//         $succeedeed[] = array(
//           'name' => $name,
//           'file' => $file
//         );
//       } else {
//         $failed[] = array(
//           'name' => $name
//         );
//       }
//
//     }
//   }
//
//   if(!empty($_POST['ajax'])) {
//     echo json_encode(array(
//       'succeeded' => $succeeded,
//       'failed' => $failed
//     ));
//   }
//
//   echo json_encode(array(
//     'succeeded' => $succeeded,
//     'failed' => $failed
//   ));
// }







// // Count # of uploaded files in array
// $total = count($_FILES['upload']['name']);
//
// // Loop through each file
// for($i=0; $i<$total; $i++) {
//   //Get the temp file path
//   $tmpFilePath = $_FILES['upload']['tmp_name'][$i];
//
//   //Make sure we have a filepath
//   if ($tmpFilePath != ""){
//     //Setup our new file path
//     $newFilePath = "./uploadFiles/" . $_FILES['upload']['name'][$i];
//
//     //Upload the file into the temp dir
//     if(move_uploaded_file($tmpFilePath, $newFilePath)) {
//
//       //Handle other code here
//
//     }
//   }
// }
//
$images_arr = array();
   foreach($_FILES['upload']['name'] as $key=>$val){
       //upload and stored upload
       $target_dir = "uploadedFiles/";
       $target_file = $target_dir.$_FILES['upload']['name'][$key];
       if(move_uploaded_file($_FILES['upload']['tmp_name'][$key],$target_file)){
           $images_arr[] = $target_file;
       }
   }


//    foreach ($_FILES["upload[]"]["error"] as $key => $error) {
//   if ($error == UPLOAD_ERR_OK) {
//     $name = $_FILES["upload[]"]["name"][$key];
//     move_uploaded_file( $_FILES["upload[]"]["tmp_name"][$key], "uploads/" . $_FILES['upload[]']['name'][$key]);
//   }
// }
//
// echo "<h2>Successfully Uploaded Images</h2>";
?>
