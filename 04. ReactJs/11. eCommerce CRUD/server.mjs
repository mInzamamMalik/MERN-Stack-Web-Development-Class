import express, { request } from "express"
import cors from "cors"
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { stringToHash, varifyHash } from "bcrypt-inzi"


const dbURI = process.env.MONGODBURI || 'mongodb+srv://abc:abc@cluster0.xwbyne9.mongodb.net/socialMediaBase?retryWrites=true&w=majority';
const SECRET = process.env.SECRET || "topsecret";
const port = process.env.PORT || 5001;


const app = express();
app.use(express.json()); // parsing body
app.use(cookieParser()); // parsing cookies


app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true
}));



const userSchema = new mongoose.Schema({

    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },

    age: { type: Number, min: 17, max: 65, default: 18 },
    isMarried: { type: Boolean, default: false },

    createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model('Users', userSchema);

const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    code: { type: String, required: true },

    createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model('Products', productSchema);


app.post("/login", (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user already exist // query email user
    userModel.findOne(
        { email: body.email },
        // { email:1, firstName:1, lastName:1, age:1, password:0 },
        "email firstName lastName age password",
        (err, user) => {
            if (!err) {
                console.log("user: ", user);

                if (user) { // user found
                    varifyHash(body.password, user.password).then(isMatched => {

                        console.log("isMatched: ", isMatched);

                        if (isMatched) {

                            var token = jwt.sign({
                                _id: user._id,
                                email: user.email,
                                iat: Math.floor(Date.now() / 1000) - 30,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token: ", token);

                            res.cookie('Token', token, {
                                maxAge: 86_400_000,
                                httpOnly: true // https only cookies are the most secure one
                            });

                            res.send({
                                message: "login successful",
                                profile: {
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    age: user.age,
                                    _id: user._id
                                }
                            });
                            return;
                        } else {
                            console.log("user not found");
                            res.status(401).send({ message: "Incorrect email or password" });
                            return;
                        }
                    })

                } else { // user not already exist
                    console.log("user not found");
                    res.status(401).send({ message: "Incorrect email or password" });
                    return;
                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "login failed, please try later" });
                return;
            }
        })



})
app.post("/logout", (req, res) => {

    res.cookie('Token', '', {
        maxAge: 0,
        httpOnly: true
    });

    res.send({ message: "Logout successful" });
})

app.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user already exist // query email user
    userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log("user: ", user);

            if (user) { // user already exist
                console.log("user already exist: ", user);
                res.status(400).send({ message: "user already exist,, please try a different email" });
                return;

            } else { // user not already exist

                stringToHash(body.password).then(hashString => {

                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email.toLowerCase(),
                        password: hashString
                    },
                        (err, result) => {
                            if (!err) {
                                console.log("data saved: ", result);
                                res.status(201).send({ message: "user is created" });
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "internal server error" });
                            }
                        });
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
            return;
        }
    })
});


// every request will go through this check point
app.use(function (req, res, next) {
    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }
    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {
                res.status(401).send("token expired")
            } else {

                console.log("token approved");

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/profile", async (req, res) => {

    try {
        let user = await userModel.findOne({ _id: req.body.token._id }).exec();
        res.send(user);

    } catch (error) {
        res.status(500).send({ message: "error getting users" });
    }
})


app.get("/products", async (req, res) => {
    try {
        let products = await productModel.find({}).exec();
        console.log("all product : ", products);

        res.send({
            message: "all products",
            data: products
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})

app.get("/product/:id", async (req, res) => {
    try {
        let product = await productModel
            .findOne({ _id: req.params.id })
            .exec();
        console.log("product : ", product);

        res.send({
            message: "product",
            data: product
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})

app.post("/product", async (req, res) => {

    console.log("product received: ", req.body);

    let newProduct = new productModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        code: req.body.code,
    })
    try {
        let response = await newProduct.save()
        console.log("product added: ", response);

        res.send({
            message: "product added",
            data: response
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to add product"
        });
    }
})

app.put("/product/:id", async (req, res) => {

    console.log("data to be edited: ", req.body);

    let update = {}
    if (req.body.name) update.name = req.body.name
    if (req.body.description) update.description = req.body.description
    if (req.body.price) update.price = req.body.price
    if (req.body.code) update.code = req.body.code

    try {
        let updated = await productModel
            .findOneAndUpdate({ _id: req.params.id }, update, { new: true })
            .exec();

        console.log("updated product: ", updated);

        res.send({
            message: "product updated successfully",
            data: updated
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to update product"
        });
    }
})
app.delete("/product/:id", async (req, res) => {

    console.log("product received: ", req.body);

    try {
        let deleted = await productModel.deleteOne({ _id: req.params.id })
        console.log("product deleted: ", deleted);

        res.send({
            message: "product deleted",
            data: deleted
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to delete product"
        });
    }
})




app.use((req, res) => {
    res.status(404).send("404 not found");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})








/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////

