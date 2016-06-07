<?php

// call parameter
// email: user email
// pass: password
// id: Object ID
// material: Object Material ID
// name: Object name
// coupon
// size: Object size
// purchase: flag for changing o_purchase. It has value 1 
// return
// none

require_once 'common.php';

$json_value = null;

$data = json_decode(file_get_contents('php://input'), true);
$arr = null;            //this stores results

//connect DB
$dbh = concepea_openDb();
if(!$dbh){
    echo 'DB connection failed.';exit;
}

// Check email and password
$bLogin = isLogin($dbh, $data["email"], $data["pass"]);

// Check user
$sth = $dbh -> prepare("SELECT * FROM user WHERE u_email= :email AND u_enabled = 1");
$sth->bindParam(':email', $data["email"], PDO::PARAM_STR);
$sth->execute();
$resultuser = $sth->fetchAll();

$resultmaterial = null;
if(strlen($data["material"])>0){
    $sth = $dbh -> prepare("SELECT * FROM material WHERE m_id= :material AND m_enabled = 1");
    $sth->bindParam(':material', $data["material"], PDO::PARAM_INT);
    $sth->execute();
    $resultmaterial = $sth->fetchAll();
}

$resultcoupon = null;
if(strlen($data['coupon']) > 0){
    $sth = $dbh->prepare("SELECT * FROM coupon WHERE c_code = :coupon AND c_enabled = 1");
    $sth->bindParam(':coupon', $data['coupon'], PDO::PARAM_STR);
    $sth->execute();
    $resultcoupon = $sth->fetchAll();
}    
if( !$bLogin ){
    $arr = array(
        'result' => 0,
        'message' => 'Please login.'
    );
}else if(strlen($data["material"])>0 && count($resultmaterial)<1){
    $arr = array(
        'result' => 0,
        'message' => 'Material not found.'
    );
}else if(strlen($data["name"]) > 20){
    $arr = array(
        'result' => 0,
        'message' => 'Please name it within 20 letters.'
    );
}else{
    //Change material
    if(strlen($data["material"]) > 0){
        $sth = $dbh -> prepare("UPDATE object SET o_thumbnail=REPLACE(o_thumbnail, CONCAT(lpad(o_material,8,'0'), '.png'), CONCAT(lpad(:material,8,'0'), '.png')), o_material=:material WHERE o_id=:object and o_owner=:user");
        $sth->bindParam(':material', $data["material"], PDO::PARAM_INT);
        $sth->bindParam(':user', $resultuser[0]["u_id"], PDO::PARAM_INT);
        $sth->bindParam(':object', $data["id"], PDO::PARAM_INT);
        $sth->execute();
    }
    if(strlen($data["name"]) > 0){
        $sth = $dbh -> prepare("UPDATE object SET o_name=:name WHERE o_id=:object and o_owner=:user");
        $sth->bindParam(':name', $data["name"], PDO::PARAM_STR);
        $sth->bindParam(':user', $resultuser[0]["u_id"], PDO::PARAM_INT);
        $sth->bindParam(':object', $data["id"], PDO::PARAM_INT);
        $sth->execute();
    }

    if(strlen($data["size"]) > 0){
        $sth = $dbh -> prepare("UPDATE object SET o_size=:size WHERE o_id=:object and o_owner=:user");
        $sth->bindParam(':size', $data['size'], PDO::PARAM_STR);
        $sth->bindParam(':user', $resultuser[0]["u_id"], PDO::PARAM_INT);
        $sth->bindParam(':object', $data["id"], PDO::PARAM_INT);
        $sth->execute();
    }

    $arr = array(
        'result' => 1,
    );
}
if(strlen($data['purchase'])>0){

    $b_validate_error = false; // this is validation result
    //check coupon code
    if(strlen($data["coupon"])>0 && count($resultcoupon)<1){
        $b_validate_error = true;
        $arr = array(
            'result' => 0,
            'message' => 'coupon not found.'
        );
    }else{

        $sth = $dbh->prepare("SELECT * FROM coupon 
            JOIN coupon_material ON coupon.c_id=coupon_material.cm_c_id
            JOIN coupon_product ON coupon.c_id=coupon_product.cp_c_id
            JOIN object ON coupon_material.cm_m_id = object.o_material AND coupon_product.cp_p_id = object.o_product
            WHERE coupon.c_code = :coupon AND object.o_id = :object");
        $sth->bindParam(':coupon', $data['coupon'], PDO::PARAM_STR);
        $sth->bindParam(':object', $data["id"], PDO::PARAM_INT);
        
        if ($sth->execute() && $sth->rowCount() < 1){
            $b_validate_error = true;
            $arr = array(
                'result'=> 0,
                'message'=> 'This material and/or product you chose is not supported by this coupon. Please select a supported one.'
            );
        }
    }
    //update object with o_purchase and address if valdidated
        if(!$b_validate_error){
            
            $dbh->beginTransaction();

            $sth = $dbh -> prepare("UPDATE object SET o_purchased= :purchased WHERE o_id=:object and o_owner=:user");
            $sth->bindParam(':purchased', $data['purchase'], PDO::PARAM_STR);
            $sth->bindParam(':user', $resultuser[0]["u_id"], PDO::PARAM_INT);
            $sth->bindParam(':object', $data["id"], PDO::PARAM_INT);
      
            $sth->execute();
            //copying object addresss from user
            $sth = $dbh -> prepare("UPDATE object JOIN user ON object.o_owner = user.u_id 
                SET object.billto_first_name = user.billto_first_name, object.billto_last_name = user.billto_last_name, object.billto_address_line_1 = user.billto_address_line_1, object.billto_address_line_2 = user.billto_address_line_2,
                object.billto_city = user.billto_city, object.billto_state = user.billto_state,object.billto_zip = user.billto_zip, object.billto_country = user.billto_country, object.billto_company = user.billto_company, object.billto_phone_num = user.billto_phone_num,
                object.shipto_first_name = user.shipto_first_name, object.shipto_last_name = user.shipto_last_name, object.shipto_address_line_1 = user.shipto_address_line_1, object.shipto_address_line_2 = user.shipto_address_line_2,
                object.shipto_city = user.shipto_city, object.shipto_state = user.shipto_state, object.shipto_zip = user.shipto_zip, object.shipto_country = user.shipto_country, object.shipto_company = user.shipto_company,object.shipto_phone_num = user.shipto_phone_num,
                object.o_purchased_date = now()
                WHERE object.o_id = :object AND object.o_owner = :user");
            $sth->bindParam(':user', $resultuser[0]["u_id"], PDO::PARAM_INT);
            $sth->bindParam(':object', $data["id"], PDO::PARAM_INT);
            $sth->execute();
      

            //Set coupon code c_enabled field to 0
            $sth = $dbh->prepare("UPDATE coupon SET c_enabled = 0, c_usedby = :user, c_o_id = :object, c_scan_date = now() WHERE coupon.c_code = :coupon");
            $sth->bindParam(':coupon',$data['coupon'], PDO::PARAM_STR);
            $sth->bindParam(':user', $resultuser[0]["u_id"], PDO::PARAM_INT);
            $sth->bindParaM(':object', $data['id'], PDO::PARAM_INT);    
            $sth->execute();

            $dbh->rollBack();

                $arr = array(
                    'result' => 1,
                    'message'=> 'Your order was sucessfully placed!'                
                );
            
        }
}

$json_value = json_encode($arr);
header( 'Content-Type: text/javascript; charset=utf-8' );
echo $json_value;

