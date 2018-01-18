<?php

function getMessage($id){
  if(!file_exists('messages/'.$id)){
    return false;
  }
  return file_get_contents('messages/'.$id);
}

function countFolder($dir) {
 return (count(scandir($dir)) - 2);
}

function createMessage($name,$text){
  $fileName = countFolder('messages/');
  $mc = json_encode(['from'=>$name,'text'=>$text]);
  file_put_contents('messages/'.$fileName,$mc);
}

$p = "err";

if(isset($_GET['action'])){
  $p = $_GET['action'];
}

if($p == 'err'){
  echo json_encode(['ack'=>'false']);
}

if($p == 'getMessage'){
  if(!isset($_GET['id'])){
    echo json_encode(['ack'=>false]);
    exit;
  }
  $m = getMessage($_GET['id']);
  if($m != false){
    echo json_encode(['ack'=>'true','contents'=>$m]);
    exit;
  }
  echo json_encode(['ack'=>'false']);
}

if($p == 'newMessage'){
  createMessage($_REQUEST['name'],$_REQUEST['text']);
  return json_encode(['ack'=>true]);
}

if($p == 'startFrom'){
  echo json_encode(['ack'=>'true','val'=>countFolder('messages/')]);
}
