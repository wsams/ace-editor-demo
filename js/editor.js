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

function loadEditor() {
    var StatusBar = ace.require("ace/ext/statusbar").StatusBar;

    var completer = {
        getCompletions: function(editor, session, pos, prefix, callback) {
            if (prefix.length === 0) {
                var line = session.getLine(pos.row);
                if (undefined !== line) {
                    var interpreter = new XmlTagInterpreter(pos.row, pos.column, session);
                    var completeInfo = interpreter.getCompleteInfo();
                    if (undefined === completeInfo || completeInfo === null 
                            || undefined === completeInfo.completeType || completeInfo.completeType === null
                            || completeInfo.completeType.length === 0
                            || undefined === completeInfo.tagName || completeInfo.tagName === null
                            || completeInfo.tagName.length === 0) {
                        callback(null, []);
                        return;
                    }

                    $.getJSON("ajax.php?a=completions&completeType=" + encodeURIComponent(completeInfo.completeType) 
                            + "&tagName=" + encodeURIComponent(completeInfo.tagName) 
                            + "&attributeName=" + encodeURIComponent(completeInfo.attributeName), function(json) {
                        callback(null, json.map(function(c) {
                            return {value: c.value, caption: c.caption, 
                                meta: c.meta, score:c.score};
                        }));
                    })
                }
            } else {
                callback(null, []);
                return;
            }
        }
    };

    editor = ace.edit("editor");
    editor.setOptions({
        enableBasicAutocompletion: [completer],
        enableLiveAutocompletion: true,
        enableSnippets: true,
    });
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/xml");
    editor.getSession().setUseWrapMode(true);
    var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
}

$(document).ready(function() {


    loadEditor();

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

    $.getJSON("ajax.php?a=getLanguages", function(json) {
        $.each(json, function(i, language) {
            $("#languages").append("<option value=\"" + language + "\">" + language + "</option>");
        });
        $("#languages").on("change", function() {
            editor.getSession().setMode("ace/mode/" + $(this).val());
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

    $(".save-button").on("click", function() {
        saveDocument();
    });

    $(".format-button").on("click", function() {
        pretty();
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
