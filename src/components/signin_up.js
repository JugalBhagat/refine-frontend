import React,{useState} from 'react'
import Login from './login';
import Signup from './signup';


function Signin_up({setIsLogin,isLogin}) {
    const [hasAcc, setHasAcc] = useState(true);

    const props= {hasAcc,setHasAcc,setIsLogin};
    return (
        <div>
            { hasAcc ? (<Login props={props} />):(<Signup props={props} />)}
            {/* {isLogin ? (<Login props={props} />) : hasAcc ? (<Login props={props} />):(<Signup props={props} />)} */}
        </div>
    )
}

export default Signin_up
