require('dotenv/config');
const path = require('path');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const ClientError = require('./client-error');
const morgan = require('morgan');
const app = express();
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL
  // ssl: {
  //   rejectUnauthorized: false
  // }
});
app.use(morgan('tiny'));
const jsonMiddleware = express.json();
const formMiddleware = express.urlencoded({ extended: false });
app.use(staticMiddleware);
app.use(jsonMiddleware);
app.use(formMiddleware);

app.post('/api/auth/sign-up', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ClientError(400, 'email and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashed_password => {
      const sql = `
        insert into "users" ("email", "hashed_password")
        values ($1, $2)
        returning "user_id", "email", "created_at"
      `;
      const params = [email, hashed_password];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json('hello world');
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "user_id",
           "hashed_password"
      from "users"
     where "email" = $1
  `;
  const params = [email];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { user_id, hashed_password } = user;
      return argon2
        .verify(hashed_password, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { user_id, email };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.get('/api/listings', authorizationMiddleware, (req, res, next) => {
  const sql = `
  select *
  from listings
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/listing/:listingId', authorizationMiddleware, (req, res, next) => {
  const { listingId } = req.params;
  const sql = `
  select *
  from listings
  where listings.listing_id = $1
  `;
  let listing;
  const params = [listingId];
  db.query(sql, params)
    .then(result => {
      listing = result.rows[0];
      const commentsSql = `
      select *
      from comments
      join users 
      ON comments.user_id = users.user_id
      where comments.listing_id = $1
      ORDER BY comments.timestamp DESC
      `;
      const params = [listingId];
      return db.query(commentsSql, params);
    })
    .then(result => {
      listing.comments = result.rows;
      res.json(listing);
    })
    .catch(err => next(err));
});

// What route we want to hit when the user clicks on the heart
app.post('/api/listing/favorite', authorizationMiddleware, (req, res, next) => {
  // To create a new favorite, we need 2 pieces of information: user_id, listing_id
  // User ID is stored in req.user.id
  const user_id = req.user.user_id;
  const listing_id = req.body.listing_id;
  const sql = `
  insert into "favorites" ("user_id", "listing_id")
        values ($1, $2)
        returning "favorite_id"
  `;
  const params = [user_id, listing_id];
  db.query(sql, params)
    .then(result => {
      const favorite = result.rows[0];
      res.json(favorite);
    })
    .catch(err => next(err));
});

app.delete('/api/listing/favorite/:listing_id', authorizationMiddleware, (req, res, next) => {
  const user_id = req.user.user_id;
  const { listing_id } = req.params;
  const sql = `
  delete from favorites
  where user_id = $1
  and listing_id = $2
  `;
  const params = [user_id, listing_id];
  db.query(sql, params)
    .then(result => {
      res.json(result.rowCount);
    })
    .catch(err => next(err));
});

app.get('/api/favorites', authorizationMiddleware, (req, res, next) => {
  const user_id = req.user.user_id;
  const sql = `
   select *
   from favorites
   join listings l on
   favorites.listing_id = l.listing_id
   where favorites.user_id = $1
   `;

  const params = [user_id];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/me', authorizationMiddleware, (req, res) => {
  res.json(req.user);
});

app.post('/api/comment', authorizationMiddleware, (req, res, next) => {
  const user_id = req.user.user_id;
  const { comment, listing_id } = req.body;

  const sql = `
  insert into "comments" ("body", "user_id", "listing_id")
        values ($1, $2, $3)
        returning "comment_id"
  `;
  const params = [comment, user_id, listing_id];
  db.query(sql, params)
    .then(result => {
      const lastCommentSql = `
      select * from comments
      join users 
      ON comments.user_id = users.user_id
      where comments.comment_id = $1
      `;
      const params = [result.rows[0].comment_id];
      return db.query(lastCommentSql, params);

    })
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));

});

app.use(errorMiddleware);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
