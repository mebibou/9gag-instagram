# 9gag-instagram

## Install

1. Download and install redis
2. Open a terminal in the folder and type: `npm install`

This will install the server, the libraries for the frontend and also get data for testing.

To start the data "crawler" manually, use `npm run crawler`

## Start the server

`npm start` and then open a browser on `http://localhost:5000`

## Tests

`npm test`

### DataSet

The data is saved in a Redis instance:
- the posts are saved in a `hash` storing all the key/value pairs
- each post is identified by a unique key. First post will be identified by `post-0`, second by `post-1`, etc.
- the keys are then used to create sorted set for each key/value that we want to index. Example: to sort by likes, we create an index using a key 'like', the number of likes and the key of the post.
- we can then use zrevrange to sort and paginate the posts
