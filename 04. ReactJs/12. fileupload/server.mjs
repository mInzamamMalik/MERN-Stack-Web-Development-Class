import express, { request } from "express"
import cors from "cors"
import mongoose from 'mongoose';
import fs from 'fs';
import admin from "firebase-admin";
import { stringToHash } from "bcrypt-inzi";

// https://firebase.google.com/docs/storage/admin/start
var serviceAccount = {
    "type": "service_account",
    "project_id": "ecom-25516",
    "private_key_id": "86011547644fef4552650651291f6bb1221bc00f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDB5whE9S7NHQsl\n2eH20AxHnJH/RBSXnIX2wW20kbHCkGF/HUfi2IeNyLMUi8BiVOtXKfDp+fs0Jzz8\nwyJ5QGmltw5cWBg1tYvh6ycMhbxgKKtwbx96LzTR/Dfp66wJ6k9o+s950z3nIiLX\nE0TDu23zVYe3Yz1Ko3jvq3vOtclZabFlHT5rxEMOWhfX0m7G1x9MQzZFEsoQuWuZ\nzQHTv6cKqQ6ad5TGYlJ0berPJ1XZ7E3VvNRwbyUVpFx0KnUX0zG/O/CkijnUd62S\nx8gusO48zSgyQWJMvhHJUIzA78zrubh2k40SrB5JwarL6LK6tYI8e+iWI6iaFeUS\n2/3jx2ErAgMBAAECggEAM7GkQr4a/BQCJNUxqNtOaskTIzrDQqg4DtECrmEpQvW7\nCGiGAbQ4b1RSaefYIl8BXvuPftFmZ0EOwVREnI7Pm55x9ayGx8rewBwxDOWakwhE\nrHTzr19mdZUIUxTBiOMuyI4VQiVPG4++Ohio/IW7imQDCqEqdfufAkZ1e2Z7h5pu\n0eVi78dgCjYxq5GRZVvTEScliz4pk7cjLVnWeT6w9HAVt5X4MZpXnO+FLTKKAaLn\nCKZylwuL0WWaI6o/WGraZE5HI0XgnHxBgaIGb2hV0bq+V4aGDGiWybChYjHVPNr+\nfRNkCNxol36tvnzYiwHmWTbrPU1VqbCsHkHRicBAAQKBgQDv3ryO7XHNQHCFvjji\nru+bA1zPBglbiLnEUvjpX5YdQY8V0GR3jmSaLY+q5aZug60kb09Zt6J4vsu6X1ai\nJQPJqr2qcOHGSUFjtCPaibJuu8n0mxVW/caSOsSM9wmmoLPinU9O6rW4qUIvC9iO\nLTyxiX8JaT99lKr8ihyknMX7qwKBgQDO8PuTDSy4IBtUpyZARTDFREvQeKciUDF8\ni1OSFDQsM4S5YVi+ZasQjRfjmArg8jB/+IQN+2fTTL6tMsU+v431dHvDIaaE228M\n8r/xI9cJb+QFX8ZWDKR2YW1cWRcJeiPpMDahJDSAD4MoVXnEyglwp05jkVZLCRNh\nSE8PBvqwgQKBgE+VpxoEze07pBm7s0QCppzX0MMfTZuBEaGBpfRIMpYiWkbyjWLd\na6N72l7pMv8X0Sp1g+5QbyeApjd/yk6h2U/fxm32ZfJT+84IxpyLcxgqVidCDSJ/\nsJJzzSK4FAuk5goaB2Y3mXNbNQpG8+K4P5rn8647rUUNPm3rpPU4zrdhAoGAIG6W\nDtrOumCVx/OWRBZT6WaltxthnjgROWKgi1FNR+wfDeqavOQ0JhjmuI2Yjt6GCVhK\nYeKXx/7MF1rQnN/qgKBr0Q4SCdpWEiJtQH6McfcuNkVnUQ8UK1VjjUiNGrggrqgW\nt7Rz4eoMdSLIPbYoOpaN637YllPqzKFHeqRuX4ECgYEApXk5K9Nl0E2XB8Foqn52\nWzkCHZ0NVR7jCIxC6pIkhdSPLNBwQaVgiKIo8aH3c1J7s/+QqNQyoONt/wWwCV4K\n+ydqdV+pIOmB24QAhOxR2mo0zR38yuaXfCT8uotyzSQ36Fd9DXfMShm/DYxKdNmS\nczfVKpXu/m8PMnjOOF9iwYE=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-omuap@ecom-25516.iam.gserviceaccount.com",
    "client_id": "100999921734265469440",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-omuap%40ecom-25516.iam.gserviceaccount.com"
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecom-25516.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://ecom-25516.appspot.com");



//==============================================
import multer from 'multer';
const storageConfig = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storageConfig })

//==============================================




const dbURI = process.env.MONGODBURI || 'mongodb+srv://abc:abc@cluster0.xwbyne9.mongodb.net/socialMediaBase?retryWrites=true&w=majority';
const port = process.env.PORT || 5001;


const app = express();
app.use(express.json()); // parsing body


app.use(cors({
    origin: ['http://localhost:3000', 'https://ecom-25516.web.app', "*"],
    credentials: true
}));

const userSchema = new mongoose.Schema({

    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },

    createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model('Users', userSchema);



app.post("/signup", upload.any(), (req, res) => {

    let body = req.body;

    // console.log("body: ", body);
    // console.log("body: ", body.name);
    // console.log("body: ", body.email);
    // console.log("body: ", body.password);

    console.log("file: ", req.files[0]);

    if (!body.name
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "name": "John",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }


    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples
    bucket.upload(
        req.files[0].path,
        {
            destination: `profilePhotos/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // delete file from folder before sending response back to client (optional but recommended)
                        // optional because it is gonna delete automatically sooner or later
                        // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
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
                                            name: body.name,
                                            email: body.email.toLowerCase(),
                                            password: hashString,
                                            profilePicture: urlData[0]
                                        },
                                            (err, result) => {
                                                if (!err) {
                                                    console.log("data saved: ", result);
                                                    res.status(201).send({
                                                        message: "user is created",
                                                        data: {
                                                            name: body.name,
                                                            email: body.email.toLowerCase(),
                                                            profilePicture: urlData[0]
                                                        }
                                                    });
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


                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });








});


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

