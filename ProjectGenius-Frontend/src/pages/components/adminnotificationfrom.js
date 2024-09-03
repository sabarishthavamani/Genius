import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  adminnotificationDisplay,
  newadminNotification,
} from "../../actions/adminAction";

//lib
import toastAlert from "../../lib/toast";
// import command from "nodemon/lib/config/command";

const Adminnotificationfrom = ({ closePopup,handleFormSubmit }) => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    title: "",
    command: "",
    photo: null,
    date: "",
  });
  const navigation = useNavigate();
  const [fileErrorMsg, setFileErrorMsg] = useState("");

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const supportedExtension = [".jpg", ".png", ".jpeg", ".gif"];
    const selectedFile = files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name
        .substring(selectedFile.name.lastIndexOf("."))
        .toLowerCase();
      if (!supportedExtension.includes(fileExtension)) {
        setFileErrorMsg(
          "Please upload a valid image file (jpg, jpeg, png, gif)."
        );
        setFormValues({ ...formValues, [name]: null });
      } else if (selectedFile.size > 300000 || selectedFile.size < 30000) {
        setFileErrorMsg("File size should be Minimum 30Kb to Maximum 300Kb");
        setFormValues({ ...formValues, [name]: null });
      } else {
        setFileErrorMsg("");
        setFormValues({ ...formValues, [name]: selectedFile });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    console.log("Form Values:", formValues);
  }, [formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formValues.title || !formValues.command || !formValues.photo) {
        toastAlert("error", "Please fill in all fields");
        return;
      }
  
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("command", formValues.command);
      formData.append("date", formValues.date);
      formData.append("photo", formValues.photo);
  
      handleFormSubmit(formData);
  
      closePopup(); 
    } catch (error) {
      console.log("Error submitting data:", error);
    }
  };

  return (
    <div
      className="teacher-attendance"
      style={{
        boxShadow: "1px 3px 10px 4px #00000040",
        background: "rgb(247, 247, 248)",
      }}
    >
      <div className="monthly-content">
        <h2>SchoolHub Circular</h2>
        <form>
          <div className="route-allocate-part-two">
            <div className="route-allocate-input">
              <label htmlFor="fromDate">Title : </label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleChange}
              />
            </div>
           

            <div className="route-allocate-input">
              <label htmlFor="toDate">To Date:</label>
              <input
                type="file"
                id="file"
                name="photo"
                onChange={handleFileChange}
              />
               {formValues.photo === null && fileErrorMsg === "" && (
              <span className="text-error">*No file uploaded</span>
            )}
            </div>


          </div>

          <div className="route-allocate-part-two">
          <div className="route-allocate-input">
              <label htmlFor="numofDays">Date : </label>
              <input
                type="date"
                name="date"
                id="date"
                value={formValues.date}
                onChange={handleChange}
              />              
            </div>
            {formValues.photo && (
              <img
                src={URL.createObjectURL(formValues.photo)}
                style={{ width: "70px", marginTop: "5px" }}
                alt="Uploaded"
              />
            )}
          </div>

          <div
            className="route-allocate-input"
            style={{ width: "100%", marginRight: "50px" }}
          >
            <label htmlFor="reason">Command :</label>
            <textarea
              type="text"
              name="command"
              value={formValues.command}
              onChange={handleChange}
            />
          </div>

          <div className="btnn center">
            <button
              onClick={handleSubmit}
              disabled={
                !formValues.title || !formValues.command || !formValues.photo
              }
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Adminnotificationfrom;
