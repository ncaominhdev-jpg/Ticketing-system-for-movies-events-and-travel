const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const multer = require('multer');
const port = 3000;
const moment = require('moment');
const session = require("express-session");
require("dotenv").config();
const checkSession = require("./middlewares/checkSession");

const IndexController = require('./controllers/client/indexController')

//Client
const movieRoutes = require('./routes/client/movieRoutes');
const concertRoutes = require('./routes/client/concertRoutes');
const tourRoutes = require('./routes/client/tourRoutes');
const userRoutes = require('./routes/client/userRoutes');
const paymentRoutes = require('./routes/client/paymentRoutes');

//Admin
const adminMovieRoutes = require('./routes/admin/adminMovieRoutes');
const adminConcertRoutes = require('./routes/admin/adminConcertRoutes');
const adminTourRoutes = require('./routes/admin/adminTourRoutes');
const adminUserRoutes = require('./routes/admin/adminUserRoutes');


app.use(expressLayouts);
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.moment = moment;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// app.set('layout', 'layout');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60 * 60 * 1000, // Thời gian session sống: 1 giờ
      },
    })
  );

// User Layout
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/admin' )) {
        res.locals.layout = 'dashboard'; // Admin layout
    } else {
        res.locals.layout = 'layout'; // User layout
    }
    next();
});

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Nếu chưa đăng nhập, user = null
    next();
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
var upload = multer({ storage: storage });

app.get('/', IndexController.getHomePage)


app.get('/contact', checkSession, (req, res) => {
    res.render('client/contact', { title: 'Contact' });
})

const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 1) {
        req.session.alertMessage = "Bạn không có quyền truy cập trang quản trị!";
        return res.redirect('/login');
    }
    next();
};


app.get('/admin',checkSession, isAdmin, (req, res) => {
    res.render('admin', { title: "Quản trị hệ thống" });
});


//Client
app.use(movieRoutes)
app.use(concertRoutes)
app.use(tourRoutes)
app.use(userRoutes)
app.use('/api/payment', paymentRoutes);

//Admin
app.use(adminMovieRoutes)
app.use(adminConcertRoutes)
app.use(adminTourRoutes)
app.use(adminUserRoutes)

app.listen(port, () => {
    console.log('running http://localhost:3000');
})