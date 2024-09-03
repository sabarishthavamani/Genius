import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import toastAlert from '../lib/toast';
//import Actions
import { parentsignup } from '../actions/parentAction';
//import pacakages
import isEmpty from 'is-empty';

const initialFormValue = {
  fatherphonenumber: '',
  dob: '',
    password: '',
    confirmpassword:'',
}

const ParentSignup = () => {
    // hooks
    const navigate = useNavigate();
    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [errors, setErrors] = useState({});
    const [inputErrors,setInputErrors] = useState({});
    //destructuring
    const { fatherphonenumber,dob, password, confirmpassword } = formValue;

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
              fatherphonenumber: fatherphonenumber,
              dob: dob,
              password: password,
                confirmpassword: confirmpassword,
            }
            let { status, message, errors } = await parentsignup(data)
            if (status === true) {
                setFormValue(initialFormValue)
                setErrors({})
                toastAlert('success',message)
                navigate('/parent-login')         
            } else if (status === false) {
                if (errors) {
                    setErrors(errors)
                    setInputErrors((prevErrors) => ({
                      ...prevErrors,
                      email:errors.email,
                      password:errors.password,
                      confirmpassword:errors.confirmpassword,
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
          <img className="tech" src="images/parent-signup.png" />
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
              <h3>Parent Sign Up</h3>
              <Form.Group controlId="formEmail" className="field">
                            <Form.Label>Father Phone Number</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Father Phone Number"
                                name="fatherphonenumber"
                                value={fatherphonenumber}
                                onChange={handleChange}
                                isInvalid={(inputErrors && inputErrors.fatherphonenumber) && isValid(inputErrors.fatherphonenumber)} 
                            />
                            <Form.Control.Feedback type="invalid">{inputErrors && inputErrors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="field">
                            <Form.Label>Children Date of Birth</Form.Label>
                            <Form.Control
                                type="dob"
                                placeholder="DD/MM/YYY"
                                name="dob"
                                value={dob}
                                onChange={handleChange}
                                isInvalid={(inputErrors && inputErrors.dob) && isValid(inputErrors.dob)} 
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
                        <Form.Group controlId="formEmail" className="field">
                            <Form.Label className='form-lable'>Confirm Password</Form.Label>
                            <Form.Control
                                 type='password'
                                placeholder="Enter Your Confirm Password"
                                name="confirmpassword"
                                value={confirmpassword}
                                onChange={handleChange}
                                isInvalid={(inputErrors && inputErrors.confirmpassword) && isValid(inputErrors.confirmpassword)} 
                            />
                            <Form.Control.Feedback type="invalid">{inputErrors && inputErrors.confirmpassword}
                            </Form.Control.Feedback>
                        </Form.Group>
              <button type="button" className="log" onClick={handleSubmit}>Save</button>
            </form>
          </div>
        </div>
      </div>      
      
    )
}

export default ParentSignup;


