ace-editor-demo
===============

A simple Ace editor demo powered by jQuery and PHP.

Features
========

* Auto save to disk via ajax using jQuery
* Search and replace
* Theme switching
* Time formating using momentjs
* Styled with Bootstrap
* Ace editor (XML and HTML modes)
* Custom autocompletion

How it works
============

This demo functions in a way that might not be obvious. The document you are seeing is based off of your session id. When you first open the editor it checks to see if a file named `"documents/" . session_id() . "demo.xml"` exists. If it doesn't it is created and returned. From then on that is the document you'll be editing. If you open a new browser session you'll be presented with a brand new document. This allows multiple users to test Ace without requiring authentication, as well as no clobbering.

By default your document is saved every 60 seconds. Also the document is saved when you have quit editing the document for 200 milliseconds.

The search and replace also behaves oddly. Until you click the `Find` button, the `Replace` and `Replace all` buttons are disabled. And any changes to the find input field re-disables the `Replace` and `Replace all` buttons. This is because `editor.find(needle)` must be fired before a replace can occur. The replacement is based on the `needle`. This probably wouldn't be ideal in production; easily implemented other ways.
