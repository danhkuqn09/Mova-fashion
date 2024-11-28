<?php

function showCategoriesHome()
{
    $conn = pdo_get_connection();
    $sql = "SELECT * FROM danhmuc ORDER BY id_dm ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return $stmt->fetchAll();
}
function showCategoriesNavBar()
{
    $conn = pdo_get_connection();
    $sql = "SELECT * FROM danhmuc ORDER BY id_dm ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return $stmt->fetchAll();
}
