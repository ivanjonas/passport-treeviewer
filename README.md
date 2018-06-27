# Passport Treeviewer

A coding challenge.

## What does it do?

This app shows a tree representation of data in a MySQL database. There is a fixed hierarchy: The root is always present, the first level down is a set of **zero or more "factory nodes,"** and each factory node has between **zero and fifteen child nodes.** 

## Tech

- Node and Express
- React
- Webpack and Babel
- Socket.io
- MySQL
- Sass
- ... and a small pile of minor packages

No jQuery, all ES6.

## Architectural decisions

I chose a relational DB for the guarantees it provides regarding types and (non)nullable fields: if both front-end and back-end validations fail, DB constraints will have a chance to prevent bad input.

Socket.io was a must for real-time information sharing between multiple clients, but it was also a pleasure to use over traditional AJAX.

React was chosen for the ease of developing components in it, and it is also the standard choice. Preact would likely have sufficed in this project.

CSS uses good principles: ITCSS for organization, SUIT-CSS naming, namespacing, single-class selectors to keep specificity as low as possible, etc. Sass was merely the popular choice.

Webpack and Babel are used to leverage the benefits of ES6, especially arrow functions and block-scoped variables. 

## Things that turned out OK

- Caching the MySQL connection object
- Tokenizing magic numbers
- Polling the database at application startup and automatically creating and seeding tables if needed.
- Client-side validation
- Applying the Bridge structural pattern to the contents of the modal.
- Promise chaining in complex database transaction

## Things that I would improve

- Bundling. The produced files are not production-ready.
- Set-and-forget input sanitization. I had to remember to escape user input, and a few times I had to audit the entire application because I was unsure that I had addressed them all.
- More reliable MySQL connection. If the cached connection ever fails for some reason (garbage collection, perhaps), I would have wanted to destroy the failed connection and transparently replace it.
- The way I implemented ModalContent is unwieldy: it is not trivial to pass information between a Factory node and a modal that exists exclusively for that node.
- Better design, especially the color scheme and layout. 
- Prioritization. I often put off critical feature development to pursue a more immediately-relevant but less important goal.
