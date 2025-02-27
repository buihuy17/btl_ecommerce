const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const exphbs = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash")
// faqat session funksiyasi kerak
const MongoStore = require("connect-mongodb-session")(session);

const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const notebooksRoutes = require("./routes/notebooks");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile")

const varMiddleware = require("./middleware/var");
const userMiddleware = require("./middleware/user")

// db url
const MONGODB_URI =
  "mongodb://localhost:27017/laptopshop";

// const User = require("./models/user");

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./utils"),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
// mongostore
const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

// Handlebars
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById("63616427125c918a8e6077d8");
//     req.user = user;
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// });

// fiylni static qilish
app.use(express.static("public"));

// forma bilan ishlash uchun yoziladi
app.use(express.urlencoded({ extended: true }));

// session
app.use(
  session({
    secret: "secret val",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash())
// global middleware
app.use(varMiddleware);
app.use(userMiddleware)
// Routes
app.use("/", homeRoutes);
app.use("/notebooks", notebooksRoutes);
app.use("/add", addRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes)

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: "azizbek@gmail.com",
    //     name: "Azizbek",
    //     cart: { items: [] },
    //   });
    //   await user.save();
    // }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `Server has been started on port ${PORT} http://localhost:${PORT} ...`
      );
    });
  } catch (err) {
    console.log(err);
  }
}
// BWfeAVxg7D4lV5tu

start();
