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
        switch($_GET['completeType']) {
            case "value";
                switch($_GET['tagName']) {
                    case "p":
                        $out = array(
                            array("value" => "This is an autocompleted sentence.", 
                                "caption" => "This is an autocompleted sentence.", 
                                "meta" => "mytag", "score" => 1000), 
                            array("value" => "Why do you want to autocomplete this silly sentence.", 
                                "caption" => "Why do you want to autocomplete this silly sentence.", 
                                "meta" => "mytag", "score" => 900));
                        break;
                    case "h1":
                        $out = array(
                            array("value" => "The Best Title", 
                                "caption" => "The Best Title", 
                                "meta" => "mytag", "score" => 1000), 
                            array("value" => "Titles Are Cool", 
                                "caption" => "Titles Are Cool", 
                                "meta" => "mytag", "score" => 1000), 
                            array("value" => "One More Title", 
                                "caption" => "One More Title", 
                                "meta" => "mytag", "score" => 900));
                        break;
                    default:
                        $out = array(array());
                        break;
                }
                break;
            case "attribute";
                switch($_GET['attributeName']) {
                    case "class":
                        // Here we just autocomplete for any tag but you can use
                        // $_GET['tagName'] to restrict these button classes to
                        // particular button tags.
                        $out = array(
                            array("value" => "btn", 
                                "caption" => "btn", 
                                "meta" => "mytag", "score" => 1000), 
                            array("value" => "btn-success", 
                                "caption" => "btn-success", 
                                "meta" => "mytag", "score" => 1000), 
                            array("value" => "btn-danger", 
                                "caption" => "btn-danger", 
                                "meta" => "mytag", "score" => 1000), 
                            array("value" => "btn-info", 
                                "caption" => "btn-info", 
                                "meta" => "mytag", "score" => 1000), 
                            array("value" => "btn-primary", 
                                "caption" => "btn-primary", 
                                "meta" => "mytag", "score" => 900));
                        break;
                    case "id":
                        $out = array(
                            array("value" => "myid1", 
                                "caption" => "myid1", 
                                "meta" => "mytag", "score" => 1000), 
                            array("value" => "anotherid", 
                                "caption" => "anotherid", 
                                "meta" => "mytag", "score" => 900));
                        break;
                    default:
                        $out = array(array());
                        break;
                }
                break;
            default:
                $out = array(array());
                break;
        }
        print(json_encode($out));
        break;

    default:
        die();
}
