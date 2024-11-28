<?php
function taodonhang($madh, $tongdonhang, $phuongthuctt, $hoten, $email, $diachi, $sdt)
{
    $ngaymua = date('Y-m-d H:i:s'); // Lấy ngày và giờ hiện tại
    $conn = pdo_get_connection();
    $sql = "INSERT INTO donhang (madh,tongdonhang,phuongthuctt,hoten,email,diachi,sdt,ngaymua) VALUES ('" . $madh . "','" . $tongdonhang . "','" . $phuongthuctt . "','" . $hoten . "','" . $email . "','" . $diachi . "','" . $sdt . "','" . $ngaymua . "')";
    $conn->exec($sql);
    $last_id = $conn->lastInsertId();
    return $last_id;
}

function  addcart($id_donhang, $id_sp, $tensp, $anhsp, $dongia, $slsp)
{
    $conn = pdo_get_connection();
    $sql = "INSERT INTO giohang (id_donhang,id_sp,tensp,anhsp,dongia,slsp) VALUES ('" . $id_donhang . "','" . $id_sp . "','" . $tensp . "','" . $anhsp . "','" . $dongia . "','" . $slsp . "')";
    $conn->exec($sql);
}

function getshowdonhang($id_donhang)
{
    $conn = pdo_get_connection();
    $sql = "SELECT * FROM giohang WHERE id_donhang =" . $id_donhang;

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return $stmt->fetchAll();
}

function getorderinfo($id_donhang)
{
    $conn = pdo_get_connection();
    $sql = "SELECT * FROM donhang WHERE id_donhang =" . $id_donhang;

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return $stmt->fetchAll();
}
