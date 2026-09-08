<?php
$json = file_get_contents('https://pravahnews.com/api/home');
$data = json_decode($json, true);
file_put_contents('c:\\xampp\\htdocs\\pravahnews.com\\new_prevahnews\\api_response_php.json', json_encode(array_keys($data['data']), JSON_PRETTY_PRINT));
echo "Done.";
