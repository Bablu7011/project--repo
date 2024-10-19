const express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    sanitizer = require('sanitizer'),
    path = require('path'),
    app = express(),
    port = 8081;

// Body parser for form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public'))); // Assuming static files are in the 'public' directory

// Method override for PUT and DELETE requests
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Assume the EJS views are in a directory called 'views'
app.set('views', path.join(__dirname, 'views'));

// Sample to-do list
let todolist = [];

// Display the to-do list and the form
app.get('/todo', (req, res) => {
    res.render('todo.ejs', {
        todolist,
        clickHandler: "func1();"
    });
});

// Adding an item to the to-do list
app.post('/todo/add/', (req, res) => {
    let newTodo = sanitizer.escape(req.body.newtodo);
    if (req.body.newtodo !== '') {
        todolist.push(newTodo);
    }
    res.redirect('/todo');
});

// Deleting an item from the to-do list
app.get('/todo/delete/:id', (req, res) => {
    if (req.params.id !== '') {
        todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
});

// Get a single to-do item and render the edit page
app.get('/todo/:id', (req, res) => {
    let todoIdx = req.params.id;
    let todo = todolist[todoIdx];

    if (todo) {
        res.render('edititem.ejs', {
            todoIdx,
            todo,
            clickHandler: "func1();"
        });
    } else {
        res.redirect('/todo');
    }
});

// Edit an item in the to-do list
app.put('/todo/edit/:id', (req, res) => {
    let todoIdx = req.params.id;
    let editTodo = sanitizer.escape(req.body.editTodo);
    if (todoIdx !== '' && editTodo !== '') {
        todolist[todoIdx] = editTodo;
    }
    res.redirect('/todo');
});

// Redirect to the to-do list if the page is not found
app.use((req, res, next) => {
    res.redirect('/todo');
});

// Start the server
app.listen(port, () => {
    console.log(`Todolist running on http://0.0.0.0:${port}`);
});

module.exports = app;
