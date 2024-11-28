<?php

function showDetailProduct($id)
{
    if ($id > 0) {
        $sql = "SELECT * FROM sanpham WHERE id_sp=" . $id;
        $conn = pdo_get_connection();
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        return $stmt->fetch();
    } else {
        return 0;
    }
}

function showProductCate($id)
{
    $conn = pdo_get_connection();
    $sql = "SELECT * FROM sanpham WHERE id_dm = $id ORDER BY id_sp ASC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return $stmt->fetchAll();
}


function showProductCate1()
{
    $conn = pdo_get_connection();
    $sql = "SELECT * FROM sanpham WHERE id_dm = 1 ORDER BY id_sp ASC";
    // if($id_dm>0){
    //     $sql.="AND id_dm=".$id_dm;
    // }
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return $stmt->fetchAll();
}

function showProductCate2()
{
    $conn = pdo_get_connection();
    $sql = "SELECT * FROM sanpham WHERE id_dm = 2 ORDER BY id_sp ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return $stmt->fetchAll();
}

function showProductCate3()
{
    $conn = pdo_get_connection();
    $sql = "SELECT * FROM sanpham WHERE id_dm = 3 ORDER BY id_sp ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return $stmt->fetchAll();
}
