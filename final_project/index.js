const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url} from ${req.ip}`);
    next();
});

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check for token in the Authorization header
    let token = req.headers['authorization']?.split(' ')[1]; // Expect "Bearer <token>"

    // If no token in header, fall back to session storage
    if (!token && req.session.authorization) {
        token = req.session.authorization['accessToken'];
    }

    if (token) {
        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "Invalid token, user not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "No token provided, user not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
