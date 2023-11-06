import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHistory, faUpload } from '@fortawesome/free-solid-svg-icons';

const AdmissionFormFinal = (props) => {
    const {formValue, setFormValue, handlePreClick, handleSubmit, errors} = props

    //state
    const [onFocusPrevSchool, setFocusOnPrevSchool] = useState(false )
    const [onFocusRelNam, setFocusOnRelNam] = useState(false)
    const [onFocusRelNum, setFocusOnRelNum] = useState(false)
    const [onFocusVaccination, setFocusOnVaccination] = useState(false)
    const [isValid, setIsValid] = useState(true);

    const triggerPreviousForm = () => {
        handlePreClick()
    }

    const triggerSubmitAction = () => {
        handleSubmit()
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
      }
    
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

    const displayFile = (file) => {
    if (file) {
        const url = URL.createObjectURL(file);
        if (file.type.startsWith("image/")) {
        return <img src={url} style={{ width: "70px" }} alt="Uploaded File" />;
        } else if (file.type === "application/pdf") {
        return <embed src={url} type="application/pdf" width="70px" height="70px" />;
        }
    }
    return null;
    };

    const {admissiongrade, previousgrade, previousschoolhistory, emergencyrelationname, bloodgroup, vaccination, emergencycontactNumber, signature} = formValue;

    const isButtonDisable = ( admissiongrade !== "" &&  previousgrade !== "" && previousschoolhistory !== "" && emergencyrelationname !== "" && bloodgroup !== "" && vaccination !== "" && emergencycontactNumber !== "" );

    return (
        // Student History form JSX
        <>
           <div className="person-details">
            <div className="person-header">
              <span><FontAwesomeIcon icon={faHistory} className='personicon' />Student History</span>
            </div>
            <form action="">
              <div className="form-left">
                <div className="field-box">
                  <label htmlFor="">
                    Admission Grade<sup>*</sup>
                  </label>
                  <select name="admissiongrade" value={admissiongrade} onChange={handleChange}>
                    <option />
                    <option>Preschool</option>
                    <option>LKG</option>
                    <option>UKG</option>
                    <option>Class 1</option>
                    <option>Class 2</option>
                    <option>Class 3</option>
                    <option>Class 4</option>
                    <option>Class 5</option>
                    <option>Class 6</option>
                    <option>Class 7</option>
                    <option>Class 8</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                    <option>Class 11</option>
                    <option>Class 12</option>
                  </select>
                </div>
                <div className="field-box">
                  <label htmlFor="">
                    Previous Grade/Class<sup>*</sup>
                  </label>
                  <select name="previousgrade" value={previousgrade} onChange={handleChange}>
                    <option />
                    <option>Not Applicable</option>
                    <option>Preschool</option>
                    <option>LKG</option>
                    <option>UKG</option>
                    <option>Class 1</option>
                    <option>Class 2</option>
                    <option>Class 3</option>
                    <option>Class 4</option>
                    <option>Class 5</option>
                    <option>Class 6</option>
                    <option>Class 7</option>
                    <option>Class 8</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                    <option>Class 11</option>
                    <option>Class 12</option>
                  </select>
                </div>
                <div className="field-box">
                  <label htmlFor="">
                    Previous School Name<sup>*</sup>
                  </label>
                  <input type="text" name="previousschoolhistory" value={previousschoolhistory} onChange={handleChange} maxLength={30} onFocus={() => setFocusOnPrevSchool(true)} onBlur={() => setFocusOnPrevSchool(false)} />
                  { previousschoolhistory.length >= 30 && onFocusPrevSchool &&  <span className='text-error'>Reached max characters limit 30</span> }
                </div>
                <div className="field-box">
                  <label htmlFor="">
                    Emergency Relation Name<sup>*</sup>
                  </label>
                  <input type="text" name="emergencyrelationname" value={emergencyrelationname} onChange={handleChange} maxLength={20} onFocus={() => setFocusOnRelNam(true)} onBlur={() => setFocusOnRelNam(false)} />
                  {onFocusRelNam && emergencyrelationname.length >= 20 &&<span className='text-error'>Reached max characters limit 20</span>}
                </div>
              </div>
              <div className="form-right">
                <div className="field-box">
                  <label htmlFor="">
                    Blood Group<sup>*</sup>
                  </label>
                  <select name="bloodgroup" value={bloodgroup} onChange={handleChange}>
                    <option />
                    <option>A+ve</option>
                    <option>A-ve</option>
                    <option>B+ve</option>
                    <option>B-ve</option>
                    <option>AB+ve</option>
                    <option>AB-ve</option>
                    <option>O+ve</option>
                    <option>O-ve</option>
                    <option>A1B+</option>
                    <option>A1B-</option>
                    <option>A2B+</option>
                    <option>A2B-</option>
                    <option>Bombay Blood Group</option>
                  </select>
                  {errors.bloodgroup !== "" &&  <span className='text-error'>{errors.bloodgroup}</span> }
                </div>
                <div className="field-box">
                  <label htmlFor="">
                    Vaccination Details
                  </label>
                  <input type="text" name="vaccination" value={vaccination} onChange={handleChange} maxLength={20} onFocus={() => setFocusOnVaccination(true)} onBlur={() => setFocusOnVaccination(false)} />
                  {vaccination.length >= 20 && onFocusVaccination &&<span className='text-error'>Reached max characters limit 20</span>}
                </div>
                <div className="field-box">
                  <label htmlFor="">
                    Emergency Contact Number<sup>*</sup>
                  </label>
                  <input type="text" name="emergencycontactNumber" value={emergencycontactNumber} onChange={handleChange} maxLength={10} onBlur={() => (emergencycontactNumber.length < 10  ? setFocusOnRelNum(true) : setFocusOnRelNum (false))} />
                  {emergencycontactNumber.length < 10 && onFocusRelNum && <span className='text-error'>Please enter valid Mobile Number</span> }
                </div>
                <div className="field-box">
                  <label>
                    Digital Signature
                  </label>
                  <input type="file" id="file" name="signature" onChange={handleFileChange} accept="image/*,application/pdf" />
                  <label htmlFor="file" className="photo">
                    <div style={{ marginRight: '10px' }}><FontAwesomeIcon icon={faUpload} /></div>
                    {signature ? (<span>{signature.name}</span>) : <span>Drag and Drop or Browse Files</span>}
                  </label>
                  {displayFile(signature)}
                  {!isValid && <span className='text-error'>File size is Minimum 30Kb to Maximum 300Kb</span>}
                  {signature === "" && <span className='text-error'>*No file uploaded</span>}
                </div>
              </div>
            </form>
          </div>
          <div className="btnn">
            <button 
                className='previous'
                onClick={triggerPreviousForm}
            >
                <FontAwesomeIcon icon={faArrowLeft} className='myarrow' />
                Previous
            </button>
            <button type="button" onClick={triggerSubmitAction}
                disabled={!isButtonDisable}
                style={{ backgroundColor: isButtonDisable ? '#ff80a6' : 'gray' }}
                >
                Submit
            </button>
          </div>
        </>
      );
}

export default AdmissionFormFinal