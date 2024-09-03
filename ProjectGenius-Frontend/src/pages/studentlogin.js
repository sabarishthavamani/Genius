import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { setAuthRec, setAuthRecSTD, setAuthToken, setAuthRecParent, setAuthRecDriver } from '../lib/localstorage';
import { teacherlogin } from '../actions/teacherAction';
import { studentLogin } from '../actions/student.action';
import { parentlogin } from '../actions/parentAction';
import { driverlogin } from '../actions/driverAction';
import { setAuthorization } from '../config/axios';
import isEmpty from 'is-empty';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialFormValue = {
  identifier: '',
  password: '',
};

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [errors, setErrors] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const { identifier, password } = formValue;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null, // Clear the error for this input
    }));
    setFormValue({ ...formValue, [name]: value });
  };

  const handleSubmit = async () => {
    const loginAttempts = [
      studentLogin({ email: identifier, password }).then(result => ({ type: 'student', result })),
      teacherlogin({ teacherId: identifier, password }).then(result => ({ type: 'teacher', result })),
      parentlogin({ fatherphonenumber: identifier, password }).then(result => ({ type: 'parent', result })),
      driverlogin({ driverId: identifier, password }).then(result => ({ type: 'driver', result }))
    ];

    const results = await Promise.allSettled(loginAttempts);

    let loginSuccess = false;
    let errorMessages = [];

    for (const { status, value } of results) {
      if (status === 'fulfilled') {
        const { type, result } = value;
        const { status: loginStatus, message, errors, token, result: userData } = result;

        if (loginStatus === true) {
          setFormValue(initialFormValue);
          setErrors({});
          setAuthToken(`Bearer ${token}`);
          setAuthorization(`Bearer ${token}`);

          toast.success(`Logged in successfully as ${type}`);

          switch (type) {
            case 'student':
              setAuthRecSTD(userData);
              navigate('/student-dashboard');
              break;
            case 'teacher':
              setAuthRec(userData);
              navigate('/teacher-dashboard');
              break;
            case 'parent':
              setAuthRecParent(userData);
              navigate('/parent-home');
              break;
            case 'driver':
              setAuthRecDriver(userData);
              navigate('/driver-dashboard');
              break;
            default:
              break;
          }

          loginSuccess = true;
          break; 
        } else {
          if (errors) {
            setErrors(errors);
            setInputErrors((prevErrors) => ({
              ...prevErrors,
              identifier: errors.email || errors.teacherId || errors.fatherphonenumber || errors.driverId,
              password: errors.password,
            }));
          }
          errorMessages.push(message || 'Login failed');
        }
      } else {
        errorMessages.push('An error occurred during login');
      }
    }

    if (!loginSuccess) {
      toast.error(errorMessages.join('. '));
    }
  };

  const isValid = (errName) => !isEmpty(errName);

  return (
    <div className="container1">
      <div className="leftcontent">
        <img className="ellipse" src="images/Ellipse 17.svg" alt="Ellipse" />
        <img className="ell" src="images/Ellipse 17.png" alt="Ellipse" />
        <img className="tech" src="images/Kids Studying from Home-pana 1.svg" alt="Kids Studying" />
      </div>
      <div className="rightcontent">
        <div className="sign-in">
          <form className="loginform">
            <div className="logo">
              <img src="images/Polygon 3.svg" alt="Logo" />
              <span>
                <h2>SchoolHub</h2>
              </span>
            </div>
            <h3>User Login</h3>
            <Form.Group controlId="formIdentifier" className="field">
              <Form.Label>User Login</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your User Login"
                name="identifier"
                value={identifier}
                onChange={handleChange}
                isInvalid={inputErrors.identifier && isValid(inputErrors.identifier)}
              />
              <Form.Control.Feedback type="invalid">
                {inputErrors.identifier}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPassword" className="field">
              <Form.Label className="form-lable">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Your Password"
                name="password"
                value={password}
                onChange={handleChange}
                isInvalid={inputErrors.password && isValid(inputErrors.password)}
              />
              <Form.Control.Feedback type="invalid">
                {inputErrors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <button type="button" className="log" onClick={handleSubmit}>Login</button>
          </form>
        </div>
        <p>Don't Have an Account..? <Link to={'/student-signup'}>SignUp Here</Link></p>
        <p>Forget Password..? <Link to={'/student-forgetpassword'}>Click Here</Link></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentLogin;
