function XmlTagInterpreter(row, col, session) {
    "use strict";
    this.row = row;
    this.col = col;
    this.session = session;
    this.leftOfCursor = null;
    this.rightOfCursor = null;
    this.leftType = null;
    this.rightType = null;
}

/**
 * Sets the left of cursor property used by other methods. This is a
 * string without new lines from the beginning of the document to the
 * letter just before the cursor. 
 */
XmlTagInterpreter.prototype.setLeftOfCursor = function() {
    "use strict";
    this.leftOfCursor = "";
    for (var r=0; r<=this.row; r++) {
        if (r === this.row) {
            var line = this.session.getLine(r);
            for (var c=0; c<this.col; c++) {
                this.leftOfCursor += line[c];
            }
        } else {
            this.leftOfCursor += this.session.getLine(r);
        }
    }
};

/**
 * Sets the right of cursor property used by other methods. This is a
 * string without new lines from the letter just to the right of the cursor
 * to the end of the document. 
 */
XmlTagInterpreter.prototype.setRightOfCursor = function() {
    "use strict";
    this.rightOfCursor = "";
    for (var r=this.row; r<=this.session.getLength(); r++) {
        if (r === this.row) {
            var line = this.session.getLine(r);
            for (var c=this.col; c<line.length; c++) {
                this.rightOfCursor += line[c];
            }
        } else {
            this.rightOfCursor += this.session.getLine(r);
        }
    }
};

/**
 * Sets the left type depending on first non-whitespace character to the
 * left of the cursor position. We look for a right angle or a quotation.
 * If a right angle we assume the cursor is inside a tag. If quotation the
 * cursor is inside an attribute. We set the left type value to 'value'
 * or 'attribute'. 
 */
XmlTagInterpreter.prototype.setLeftType = function() {
    "use strict";
    this.setLeftOfCursor();
    if (this.leftOfCursor === undefined || this.leftOfCursor.length === 0) {
        this.leftType = ""; 
        return;
    }
    for (var i=this.leftOfCursor.length-1; i>=0; i--) {
        if (this.leftOfCursor[i] === " " || this.leftOfCursor[i] === "\t") {
            continue;
        }
        if (this.leftOfCursor[i] === ">") {
            this.leftType = "value";
            return;
        } else if (this.leftOfCursor[i] === '"') {
            this.leftType = "attribute";
            return;
        } else {
            this.leftType = "";
            return;
        }
    }
};

/**
 * Sets the right type depending on first non-whitespace character to the
 * right of the cursor position. We look for a left angle or a quotation.
 * If a left angle we assume the cursor is inside a tag. If quotation the
 * cursor is inside an attribute. We set the right type value to 'value'
 * or 'attribute'. 
 */
XmlTagInterpreter.prototype.setRightType = function() {
    "use strict";
    this.setRightOfCursor();
    if (this.rightOfCursor === undefined || this.rightOfCursor.length === 0) {
        this.rightType = ""; 
        return;
    }
    for (var i=0; i<this.rightOfCursor.length; i++) {
        if (this.rightOfCursor[i] === " " || this.rightOfCursor[i] === "\t") {
            continue;
        }
        if (this.rightOfCursor[i] === "<") {
            this.rightType = "value";
            return;
        } else if (this.rightOfCursor[i] === '"') {
            this.rightType = "attribute";
            return;
        } else {
            this.rightType = "";
            return;
        }
    }
};

/**
 * Returns the tag name to be sent to autocompleter service.
 * @returns {_L1.XmlTagInterpreter.prototype@pro;leftOfCursor@call;trim@call;replace|String}
 */
XmlTagInterpreter.prototype.getCompleteInfo = function() {
    "use strict";
    this.setLeftType();
    this.setRightType();
    if (this.leftType !== this.rightType) {
        return "";
    }
    if (this.leftType === "value") {
        var tagName = this.leftOfCursor.trim()
                .replace(new RegExp("^.*<([a-z0-9:]+).*?>$"), "$1");
        return {completeType: "value", tagName: tagName};
    } else if (this.leftType === "attribute") {
        var tagName = this.leftOfCursor.trim()
                .replace(new RegExp("^.*<([a-z0-9:]+).*?([a-z0-9:]+)\s*=\s*\"$"), "$1");
        var attributeName = this.leftOfCursor.trim()
                .replace(new RegExp("^.*<([a-z0-9:]+).*?([a-z0-9:]+)\s*=\s*\"$"), "$2");
        return {completeType: "attribute", tagName: tagName, attributeName: attributeName};
    } else {
        return null;
    }
};
