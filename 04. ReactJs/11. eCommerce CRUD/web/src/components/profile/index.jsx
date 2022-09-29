import { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../../context/context';
import axios from "axios";

let Profile = () => {

    let { state, dispatch } = useContext(GlobalContext);

    


    return (
        <div >            
            {(state.user === null) ?
                <div>Loading...</div>
                :
                <div>
                    _id: {state.user?._id}
                    <br />
                    name: {state.user?.firstName} {state.user?.lastName}
                    <br />
                    email: {state.user?.email}
                    <br />
                    age: {state.user?.age}
                </div>
            }

        </div>
    );
}

export default Profile;
