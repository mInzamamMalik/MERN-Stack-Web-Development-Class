import { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../../context/context';
import axios from "axios";

import { useFormik } from 'formik';
import * as yup from 'yup';
import "./index.css"



let Products = () => {

    let { state, dispatch } = useContext(GlobalContext);

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

            } catch (e) {
                console.log("Error in api call: ", e);
            }

        },
    });


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

        </div>
    );
}

export default Products;
