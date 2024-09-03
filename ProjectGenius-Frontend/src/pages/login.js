import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

// import lib
import { setAuthToken } from '../lib/localstorage';
import toastAlert from '../lib/toast';

//import Actions
import { login } from "../actions/adminAction"

//import config
import { setAuthorization } from '../config/axios'

//import pacakages
import isEmpty from 'is-empty';

const initialFormValue = {
    email: '',
    password: '',
}

const Login = () => {

    // hooks
    const navigate = useNavigate();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [errors, setErrors] = useState({});
    const [inputErrors,setInputErrors] = useState({});

    const { email, password } = formValue;


    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          [name]: null, // Clear the error for this input
      }));
        setFormValue({ ...formValue, ...{ [name]: value } })
    }



    const handleSubmit = async () => {
        try {

            let data = {
                email: email,
                password: password
            }
            let { status, message, errors, token } = await login(data)
            if (status === true) {
                setFormValue(initialFormValue)
                setErrors({})
                setAuthToken(`Bearer ${token}`);
                setAuthorization(`Bearer ${token}`);
                toastAlert('success', message)
                navigate('/verify',{ state: { email: email } })              
            } else if (status === false) {
                if (errors) {
                    setErrors(errors)
                    setInputErrors((prevErrors) => ({
                      ...prevErrors,
                      email:errors.email,
                      password:errors.password
                    }))
                } else if (message) {
                    toastAlert('error', message)
                }
            }

        } catch (err) {
            console.log(err, '...err')
        }
    }
    const isValid = (errName) => {
      return !isEmpty(errName);
  }
    return(
        <div className="container1">
        <div className="leftcontent">
          <img className="ellipse" src="images/Ellipse 17.svg" />
          <img className="ell" src="images/Ellipse 17.png" />
          <img className="tech" src="images/Work time.png" />
        </div>
        <div className="rightcontent">
          <div className="sign-in">
            <form className='loginform'>
              <div className="logo">
                <img src="images/Polygon 3.svg" />
                <span>
                  <h2>SchoolHub</h2>
                </span>
              </div>
              <h3>Admin Sign In</h3>
               <Form.Group controlId="formEmail" className="field">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="abcxyz@gmail.com"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                isInvalid={(inputErrors && inputErrors.email) && isValid(inputErrors.email)} 
                            />
                            <Form.Control.Feedback type="invalid">{inputErrors && inputErrors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
               <Form.Group controlId="formEmail" className="field">
                            <Form.Label className='form-lable'>Password</Form.Label>
                            <Form.Control
                                 type='password'
                                placeholder="Enter Your Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                isInvalid={(inputErrors && inputErrors.password) && isValid(inputErrors.password)} 
                            />
                            <Form.Control.Feedback type="invalid">{inputErrors && inputErrors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
              <button type="button" className="log" onClick={handleSubmit}>Login</button>
            </form>
          </div>
        </div>
      </div>      
      
    )
}

export default Login;


