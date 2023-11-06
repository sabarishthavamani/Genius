import React, { useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload, faUser } from '@fortawesome/free-solid-svg-icons';
import moment from "moment-timezone";

const AdmissionFormOne = (props) => {
    const {formValue, setFormValue, handleNextClick, errors} = props

    //state
    const [onFocusFirstName, setFocusOnFirstName] = useState(false);
    const [onFocusLastName, setFocusOnLastName] = useState(false);
    const [onFocusFather, setFocusOnFather] = useState(false);
    const [onFocusMother, setFocusOnMother] = useState(false);
  
  const [isValid, setIsValid] = useState(true);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 300000 || selectedFile.size < 30000) {
        setFormValue({ ...formValue, ...{ [event.target.name]: null } });
        setIsValid(false);
      } else {
        setFormValue({ ...formValue, ...{ [event.target.name]: selectedFile } });
        setIsValid(true);
      }
    }
  };

    const triggerNextForm = () => {
      handleNextClick()
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'dob') {
        const dateValue = new Date(value)
        const day = dateValue.getDate().toString().padStart(2, '0');
        const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
        const year = dateValue.getFullYear();
        const dateOfBirth = `${day}/${month}/${year}`;

        const birthDate = moment(dateOfBirth, "DD/MM/YYYY");
        const today = moment();
        const age = today.diff(birthDate, "years");

        setFormValue({ ...formValue, age, [name]: dateOfBirth });
      } else {
        setFormValue({ ...formValue, [name]: value });
      }
    }



    const {firstName, dob, fathername, placeofbirth, lastName, age, mothername, photo} = formValue

    const isButtonDisable = (firstName !== "" && lastName !== "" && dob !== "" && age !== "" && fathername !== "" && mothername !== "" && placeofbirth !== "" );

    return (
        // Personal Details form JSX
        <>
        <div className="person-details">
          <div className="person-header">
            <ion-icon name="person" />
            <span><FontAwesomeIcon icon={faUser} className="personicon" />Person Details</span>
          </div>
          <form className='myform' action="">
            <div className="form-left">
              <div className="field-box">
                <label htmlFor="">
                  First Name<sup>*</sup>
                </label>
                <input type="text" name="firstName" value={firstName} onChange={handleChange} maxLength={15} onFocus={() => setFocusOnFirstName(true)} onBlur={() => setFocusOnFirstName(false)} />
                {onFocusFirstName && firstName.length >= 15 &&<span className='text-error'>Reached max characters limit 15</span>}
              </div>
              <div className="field-box">
                <label htmlFor="">
                  Date of Birth<sup>*</sup>
                </label>
                <div className='date-input-container '>
                  <input type="text" style={{borderRadius: '4px 0px 0px 4px '}} value={ dob } placeholder='DD/MM/YYYY' readOnly />
                  <input type='date' name='dob' onChange={handleChange} />
                </div>
              </div>
              <div className="field-box">
                <label htmlFor="">
                  Father Name<sup>*</sup>
                </label>
                <input type="text" name="fathername" value={fathername} onChange={handleChange} maxLength={20} onFocus={() => setFocusOnFather(true)} onBlur={() => setFocusOnFather(false)}/>
                {onFocusFather && fathername.length >= 20 &&<span className='text-error'>Reached max characters limit 20</span>}
              </div>
              <div className="field-box">
                <label htmlFor="">
                  Place of Birth<sup>*</sup>
                </label>
                <input type="text" name="placeofbirth" value={placeofbirth} onChange={handleChange} />
              </div>
            </div>
            <div className="form-right">
              <div className="field-box">
                <label htmlFor="">
                  Last Name<sup>*</sup>
                </label>
                <input type="text" name="lastName" value={lastName} onChange={handleChange} maxLength={15} onFocus={() => setFocusOnLastName(true)} onBlur={() => setFocusOnLastName(false)} />
                {onFocusLastName && lastName.length >= 15 &&<span className='text-error'>Reached max characters limit 15</span>}
              </div>
              <div className="field-box">
                <label htmlFor="">
                  Age<sup>*</sup>
                </label>
                <input type="text" name="age" value={age} onChange={handleChange} readOnly  />
              </div>
              <div className="field-box">
                <label htmlFor="">
                  Mother Name<sup>*</sup>
                </label>
                <input
                  type="text" name="mothername" value={mothername} onChange={handleChange} maxLength={20} onFocus={() => setFocusOnMother(true)} onBlur={() => setFocusOnMother(false)} />
                {onFocusMother && mothername.length >= 20 &&<span className='text-error'>Reached max characters limit 20</span>}
              </div>
              <div className="field-box">
                <label>
                  Upload Student Photo
                </label>
                <input type="file" id="file" name="photo" onChange={handleFileChange} />
                <label htmlFor="file" className="photo">
                  <div style={{ marginRight: '10px' }}><FontAwesomeIcon icon={faUpload} /></div>
                  {photo ? (<span>{photo.name}</span>) : (<span>Drag and Drop or Browse Files</span>)}
                </label>
                {photo && <img src={URL.createObjectURL(photo)} style={{ 'width': '70px', 'marginTop': "5px" }} />}
                {!isValid && <span className='text-error'>File size is Minimum 30Kb to Maximum 300Kb</span> } 
                {photo === "" && <span className='text-error'>*No file uploaded</span>}
              </div>
            </div>
          </form>
        </div>
        <div className="btnn">
          <button
            onClick={triggerNextForm}
            disabled={!isButtonDisable}
            style={{ backgroundColor: isButtonDisable ? '#ff80a6' : 'gray' }}
          >
            Next
            <img src="images/arrow.png" alt="" />
          </button>
        </div>
        </>
      );
}

export default AdmissionFormOne