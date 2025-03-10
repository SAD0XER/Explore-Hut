// Check for NODE_ENV is not set on "production".
if (process.env.NODE_ENV != "production") require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./errors/ExpressError.js");
const session = require("express-session");
const store = require("./config/session.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ROUTES = require("./constants/routes.js");

// Requiring Express Router files.
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Setting for project requirements.
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Handling Error if session store fails.
store.on("error", (error) => {
    console.log("ERROR in MONGO SESSION STORE!");
    console.log(error);
    console.error(error);
});

// express-session parameters.
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // It is to use static authenticate method of model in LocalStrategy.

// use static serialize and deserialize of model for passport session support.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flsh Message Middleware.
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // Storing current User in locals so that can be accessed everywhere.
    next();
});

// Express Routers
app.use(ROUTES.LISTINGS, listingRouter);
app.use(ROUTES.REVIEWS, reviewRouter);
app.use(ROUTES.USER, userRouter);

// Middlewares
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong!" } = err;
    console.error(`Error ${statusCode}: ${message}`, err.stack);
    res.status(statusCode).render("errors/error.ejs", { message });
});

/* Database connectivity setup */
connectDB();

/* Server setup */
app.listen(8080, () => {
    console.log("Server is running on localhost:8080");
});
