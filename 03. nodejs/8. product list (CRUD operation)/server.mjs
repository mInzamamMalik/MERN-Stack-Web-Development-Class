import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'

const productSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    currencyCode: String,
    numberOfSale: Number,
    rating: Number,
    isFreeShipping: Boolean,
    shopName: String,
    createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model('Product', productSchema);

let app = express();
app.use(express.json());
app.use(cors());


app.get("/products", async (req, res) => {

    let result = await productModel
        .find({})
        .exec()
        .catch(e => {
            console.log("error in db: ", e);
            res.status(500).send({ message: "error in getting all products" });
            return
        })

    res.send({
        message: "all products success ",
        data: result
    });
});

app.get("/product/:id", async (req, res) => {

    let result = await productModel
        .findOne({_id: req.params.id})
        .exec()
        .catch(e => {
            console.log("error in db: ", e);
            res.status(500).send({ message: "error in getting all products" });
            return
        })

    res.send({
        message: "all products success ",
        data: result
    });
});


app.post("/product", async (req, res) => {

    let body = req.body;

    if (
        !body.productName
        || !body.productPrice
        || !body.currencyCode
        || !body.numberOfSale
        || !body.rating
        || !body.isFreeShipping
        || !body.shopName
    ) {

        res.status(400).send({
            message: `required field missing, all fields are required: 
            productName
            productPrice
            currencyCode
            numberOfSale
            rating
            isFreeShipping
            shopName`
        })
        return;
    }

    let result = await productModel.create({

        productName: body.productName,
        productPrice: body.productPrice,
        currencyCode: body.currencyCode,
        numberOfSale: body.numberOfSale,
        rating: body.rating,
        isFreeShipping: body.isFreeShipping,
        shopName: body.shopName,

    }).catch(e => {
        console.log("error in db: ", e);
        res.status(500).send({ message: "db error in saving product" });
    })

    console.log("result: ", result);
    res.send({ message: "product is added in database" });
});

app.delete("/product/:id", async (req, res) => {

    let _id = req.params.id;

    try {
        const result = await productModel.findByIdAndDelete(_id);
        console.log("Deleted product: ", result);
        res.send({
            message: "deleted"
        });
        return;

    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "db error"
        })
    }



})
app.put("/product/:id", async (req, res) => {

    let _id = req.params.id;
    let body = req.body;

    try {
        const result = await productModel.findByIdAndUpdate(_id, body);
        console.log("updated product: ", result);
        res.send({
            message: "updated"
        });
        return;

    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "db error"
        })
    }
})

// app.use("/*", (req, res) => {
//     console.log(" I am * handler");
//     res.status(404).send("this api doesn't exist");
// })


let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is running on ${PORT}`);
});



/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://abc:abc@cluster0.xwbyne9.mongodb.net/ecommerceDatabase?retryWrites=true&w=majority';
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

