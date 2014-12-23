var editor;

function saveDocument() {
    $.getJSON("ajax.php?a=save&id=demo&xml=" + encodeURIComponent(editor.getValue()), function(json) {
        if (json.status === "ok") {
            $(".last-saved").html("Last saved on " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
        } else {
            alert(json.msg);
        }
    });
}

function saveDocumentTimer() {
    saveDocument();
    setTimeout("saveDocumentTimer()", 60000);
}

function find() {
    editor.find($("#find-value").val(), {
        backwards: false,
        wrap: true,
        caseSensitive: $("#case-sensitive").is(":checked"),
        wholeWord: false,
        regExp: true
    });
}

function replace() {
    editor.replace($("#replace-value").val());
    saveDocument();
}

function replaceAll() {
    editor.replaceAll($("#replace-value").val());
    saveDocument();
}

$(document).ready(function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/xml");

    $.getJSON("ajax.php?a=load&id=demo", function(json) {
        if (json.status === "ok") {
            editor.setValue(json.xml);
            editor.clearSelection();
            saveDocumentTimer();
        } else {
            alert(json.msg);
        }
    });

    $.getJSON("ajax.php?a=getThemes", function(json) {
        $.each(json, function(i, theme) {
            $("#themes").append("<option value=\"" + theme + "\">" + theme + "</option>");
        });
        $("#themes").on("change", function() {
            editor.setTheme("ace/theme/" + $(this).val().replace(/^theme-/, "").replace("/.js/", ""));
        });
    });

    prevtime = parseInt(new Date().getTime());
    threshold = 200;
    curval = "";
    t = null;
    $("#editor").on("keyup change keydown input", function() {
        curval = $(this).val();
        curtime = parseInt(new Date() . getTime());
        next = prevtime + threshold;
        prevtime = curtime;
        if(curtime < next) {
            clearTimeout(t);
            t = setTimeout("saveDocument()", threshold);
            return;
        }
    });

    $("#find-value").on("keyup", function() {
        $("#replace").prop("disabled", true);
        $("#replace-all").prop("disabled", true);
    });

    $("#find").on("click", function() {
        find();
        $("#replace").prop("disabled", false);
        $("#replace-all").prop("disabled", false);
    });

    $("#replace").on("click", function() {
        replace();
    });

    $("#replace-all").on("click", function() {
        replaceAll();
    });
});
