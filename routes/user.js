const express = require("express");
const routes = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

routes
  .route("/signup")
  .get((req, res) => {
    res.render("user/signup.ejs");
  })
  .post(
    wrapAsync(async (req, res) => {
      try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", "User registered");
          res.redirect("/listings");
        });
      } catch (er) {
        req.flash("error", er.message);
        res.redirect("/listings");
      }
    })
  );

routes
  .route("/login")
  .get((req, res) => {
    res.render("user/login");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    (req, res) => {
      req.flash("success", "Welcome to Redbus!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    }
  );

routes.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you logged out");
    res.redirect("/listings");
  });
});




// routes.get("/signup", (req, res) => {
//   res.render("user/signup.ejs");
// });

// routes.post(
//   "/signup",
//   wrapAsync(async (req, res) => {
//     try {
//       let { username, email, password } = req.body;
//       let newUser = new User({ username, email });
//       const registerdUser = await User.register(newUser, password);
//       req.login(registerdUser, (err) => {
//         if (err) {
//           return next(err);
//         }
//         req.flash("success", "User registered");
//         res.redirect("/listings");
//       });
//     } catch (er) {
//       req.flash("error", er.message);
//       res.redirect("/listings");
//     }
//   })
// );

// routes.get("/login", (req, res) => {
//   res.render("user/login");
// });

// routes.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   (req, res) => {
//     req.flash("success", "Welcome to Redbus!");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
//   }
// );

module.exports = routes;
