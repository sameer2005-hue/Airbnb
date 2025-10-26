if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listings = require("./routes/listings");
const review = require("./routes/review");
const user = require("./routes/user");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const atlasdb_url = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(atlasdb_url);
}

main()
  .then(() => console.log("connected successfully"))
  .catch((err) => console.log(err));

const store = MongoStore.create({
  mongoUrl: atlasdb_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on('error', (err) => {
  console.log("error in mongo session store", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expiers: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.engine("ejs", ejsMate);

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// express session
app.use(session(sessionOption));
app.use(flash());

// using passport for authenticaton
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// routes for listings the all lisiting (index, show, edit, new, delete)
app.use("/listings", listings);

// routes that manage the review listings (add or delete)
app.use("/listings/:id/review", review);

app.use("/", user);

app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.status = 404;
  error.message = "Page Not Found";
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).render("listing/error", { err });
});

// app.use((err, req, res, next) => {
//   // let { status, message } = err;
//   res.render("listing/error", { err });
// });

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
