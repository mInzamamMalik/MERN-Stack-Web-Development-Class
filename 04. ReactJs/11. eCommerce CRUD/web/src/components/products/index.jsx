import { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../../context/context';
import axios from "axios";

import { useFormik } from 'formik';
import * as yup from 'yup';
import "./index.css"



let Products = () => {

    let { state, dispatch } = useContext(GlobalContext);
    let [products, setProducts] = useState([]);
    let [editProduct, setEditProduct] = useState(null);

    let [loading, setLoading] = useState(false);

    let [toggleReload, setToggleReload] = useState(false);



    useEffect(() => {

        const getAllProducts = async () => {
            try {
                let response = await axios({
                    url: `${state.baseUrl}/products`,
                    method: "get",
                    withCredentials: true
                })
                if (response.status === 200) {
                    console.log("response: ", response.data.data);

                    setProducts(response.data.data.reverse());
                    // setProducts(response.data.data);

                } else {
                    console.log("error in api call")
                }
            } catch (e) {
                console.log("Error in api call: ", e);
            }
        }
        getAllProducts();

    }, [toggleReload])





    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: '',
            photo: '',
            code: ''
        },
        validationSchema: yup.object({
            name: yup
                .string('enter your product name')
                .min(3, "product name is too short")
                .required('product name is required'),
            description: yup
                .string('Enter your description'),
            price: yup
                .number('Enter a number')
                .moreThan(0, "price can not be zero")
                .required("price is required"),
            code: yup
                .string("code must be a string")
                .required("code is required")

        }),
        onSubmit: async (values) => {
            console.log(values);
            try {
                let response = await axios.post(`${state.baseUrl}/product`,
                    values,
                    {
                        withCredentials: true
                    })
                console.log("response: ", response.data);
                setToggleReload(!toggleReload)

            } catch (e) {
                console.log("Error in api call: ", e);
            }
        },
    });

    let updateHandler = async (e) => {
        e.preventDefault();


        try {
            let updated = await
                axios.put(`${state.baseUrl}/product/${editProduct?._id}`,
                    {
                        name: editProduct.name,
                        price: editProduct.price,
                        description: editProduct.description,
                        code: editProduct.code,
                    },
                    {
                        withCredentials: true
                    })
            console.log("updated: ", updated.data);

            setToggleReload(!toggleReload);
            setEditProduct(null);


        } catch (e) {
            console.log("Error in api call: ", e);
            setLoading(false)
        }


    }


    return (
        <div >
            <h1>Products Page</h1>

            <form onSubmit={formik.handleSubmit}>
                <input
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}

                />
                {
                    (formik.touched.name && formik.errors.name) ?
                        <div className="errorMessage">{formik.errors.name}</div> : null
                }
                <br />
                <input
                    id="description"
                    name="description"
                    placeholder="Description"
                    type="text"
                    value={formik.values.description}
                    onChange={formik.handleChange}

                />
                {
                    (formik.touched.description && formik.errors.description) ?
                        <div className="errorMessage">{formik.errors.description}</div> : null
                }
                <br />
                <input
                    id="price"
                    name="price"
                    placeholder="Price"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}

                />
                {
                    (formik.touched.price && formik.errors.price) ?
                        <div className="errorMessage">{formik.errors.price}</div> : null
                }
                <br />
                <input
                    id="code"
                    name="code"
                    placeholder="Code"
                    type="text"
                    value={formik.values.code}
                    onChange={formik.handleChange}

                />
                {
                    (formik.touched.code && formik.errors.code) ?
                        <div className="errorMessage">{formik.errors.code}</div> : null
                }
                <br />
                <button type="submit">
                    Submit
                </button>
            </form>
            <hr />

            {(editProduct !== null) ? (< div >

                <h1>
                    update form
                </h1>
                <form onSubmit={updateHandler} >
                    Name: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, name: e.target.value }) }} value={editProduct.name} /> <br />
                    Price: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, price: e.target.value }) }} value={editProduct.price} /> <br />
                    Description: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, description: e.target.value }) }} value={editProduct.description} /> <br />
                    Code: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, code: e.target.value }) }} value={editProduct.code} /> <br />

                    <button type="submit"> Proceed Update </button>
                </form>
            </div>) : null}

            <hr />

            <div>
                {products?.map(eachProduct => (
                    <div key={eachProduct?._id}>

                        <h3>{eachProduct?.name}</h3>
                        <div>{eachProduct?.price}</div>
                        <div>{eachProduct?.description}</div>
                        <div>{eachProduct?.code}</div>

                        <button onClick={async () => {
                            try {

                                setLoading(true)

                                let deleted = await
                                    axios.delete(`${state.baseUrl}/product/${eachProduct?._id}`,
                                        {
                                            withCredentials: true
                                        })
                                console.log("deleted: ", deleted.data);
                                setLoading(false)

                                setToggleReload(!toggleReload);

                            } catch (e) {
                                console.log("Error in api call: ", e);
                                setLoading(false)
                            }

                        }}>Delete</button>

                        <button onClick={() => {
                            setEditProduct({
                                _id: eachProduct._id,
                                name: eachProduct?.name,
                                price: eachProduct?.price,
                                description: eachProduct?.description,
                                code: eachProduct?.code
                            })
                        }}>Edit</button>

                    </div>
                ))}
            </div>


        </div >
    );
}

export default Products;
