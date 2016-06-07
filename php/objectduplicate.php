<?php

// call parameter
// email: user email
// pass: password
// id: Object ID

// return 1 for success
// return 0 for fail

// sample call for success
// "id": 2

// sample call for fail "Object not found"
// "id": 3

require_once 'common.php';

$json_value = null;
$data = json_decode(file_get_contents('php://input'), true);
$arr = null;

//connect DB
$dbh = concepea_openDb();
if(!$dbh){
    echo 'DB connection failed.';exit;
}

function get_user_id($dbh, $email){
	 $sth = $dbh->prepare("SELECT u_id FROM user WHERE u_email= :email");
	 $sth->bindParam(':email', $email, PDO::PARAM_STR);
	 $sth->execute();
	 $result = $sth->fetchAll();
	 return $result[0]['u_id'];
}

// if($data["id"] == 2){
//     $arr = array(
//         'result' => 1,
//     );
//     $json_value = json_encode($arr);
// }else{
//     $arr = array(
//         'result' => 0,
//         'message' => "Object not found"
//     );
//     $json_value = json_encode($arr);
// }


// Check email and password
$bLogin = isLogin($dbh, $data["email"], $data["pass"]);
if( !$bLogin ){
    $arr = array(
        'result' => 0,
        'message' => 'Please login'
    );
    $json_value = json_encode($arr);
}else{
		$token = get_csrf_token();
		//Get and duplicate object using object id and checking if the owner of the object is the user by matching email
	$sth = $dbh-> prepare("INSERT INTO object (o_id, o_owner, o_thumbnail, o_material, o_size, o_product, o_name, o_enabled, o_duplicated_from, o_token) 
		SELECT (SELECT MAX(o1.o_id)+1 FROM object o1), o2.o_owner, :thumbnail, o2.o_material, o2.o_size, o2.o_product, concat(o2.o_name,' (Copy)'), o2.o_enabled, o2.o_id, :token  
		FROM object o2 
		LEFT JOIN user ON o2.o_owner = u_id WHERE o_id = :o_id AND u_email = :u_email");
	$sth->bindParam(':o_id', $data['id'], PDO::PARAM_INT);
	$sth->bindParam(':thumbnail', concepia_getDefaultObjectThumbnailImagePath(), PDO::PARAM_STR);
	$sth->bindParam(':u_email', $data['email'], PDO::PARAM_STR);
	$sth->bindParam(':token', $token, PDO::PARAM_STR);
	//check if sql statment was executed
	if ($sth->execute() && $sth->rowCount() > 0){

		$arr = array(
			'result'=> 1,
			'message'=> 'success'
		);
		$json_value = json_encode($arr);
	}else{
		$arr = array(
			'result'=> 2,
			'message'=> 'fail'
		);
		$json_value= json_encode($arr);
	}
}

		
  	
header( 'Content-Type: text/javascript; charset=utf-8' );
echo $json_value;

