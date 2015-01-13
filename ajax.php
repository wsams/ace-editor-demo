<?php

session_start();
$sessid = session_id();

if (!file_exists("documents")) {
    mkdir("documents");
}

if (isset($_GET['a'])) {
    $_GET['id'] = preg_match("/getThemes|save|load/", $_GET['id']) ? $_GET['id'] : "";
}

if (isset($_GET['id'])) {
    $_GET['id'] = preg_replace("/[^a-z]/", "", $_GET['id']);
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

    case "getLanguages":

        print(json_encode(array("xml", "html")));
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

    case "completions":
        $content = urldecode($_GET['content']);
        $out = array(array("value" => "cat", "caption" => "cat", "meta" => "mytag", "score" => 1000), 
            array("value" => "dog", "caption" => "dog", "meta" => "mytag", "score" => 900));
        print(json_encode($out));
        break;

    default:
        die();
}
