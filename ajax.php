<?php

session_start();
$sessid = session_id();

if (!file_exists("documents")) {
    mkdir("documents");
}

switch ($_GET['a']) {
    case "getThemes":

        chdir("js/ace-builds/src-noconflict");
        $themes = glob("theme-*.js");
        foreach ($themes as $k=>$theme) {
            $theme = trim($theme);
            $theme = str_replace("theme-", "", $theme);
            $theme = str_replace(".js", "", $theme);
            $themes[$k] = $theme;
        }
        print(json_encode($themes));
        break;

    case "save":

        if (file_put_contents("documents/{$sessid}.{$_GET['id']}.xml", $_GET['xml'])) {
            print(json_encode(array("status"=>"ok", "msg"=>"Document saved")));
        } else {
            print(json_encode(array("status"=>"error", "msg"=>"Could not save document")));
        }
        break;

    case "load":

        if (!file_exists("documents/{$sessid}.{$_GET['id']}.xml")) {
            copy("demo.xml", "documents/{$sessid}.{$_GET['id']}.xml");
        }

        if (file_exists("documents/{$sessid}.{$_GET['id']}.xml")) {
            print(json_encode(array("status"=>"ok", "msg"=>"Document loaded", 
                    "xml"=>file_get_contents("documents/{$sessid}.{$_GET['id']}.xml"))));
        } else {
            print(json_encode(array("status"=>"error", "msg"=>"Could not load document")));
        }
        break;

    default:
        die();
}
