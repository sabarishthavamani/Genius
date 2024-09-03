import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { adminnotificationDisplaybyId, adminnotificationUpdate } from "../../actions/adminAction";

const AdminnotificationUpdate = () => {
  const { Id } = useParams();
  const [formValues, setFormValues] = useState({
    title: "",
    command: ""
  });
  const navigate = useNavigate();

  const { title, command } = formValues;

  useEffect(() => {
    const fetchNotificationDetails = async (id) => {
      try {
        const { status, result } = await adminnotificationDisplaybyId(id);
        if (status) {
          setFormValues(result);
        } else {
          // Handle case where data fetching fails
          console.error("Failed to fetch notification details");
        }
      } catch (err) {
        console.error("Error fetching notification details:", err);
      }
    };

    fetchNotificationDetails(Id);
  }, [Id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status, message } = await adminnotificationUpdate(Id, formValues);
      if (status) {
        console.log("Notification updated successfully");
      } else {
        console.error("Error updating notification:", message);
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  return (
    <div className="fee-collection">
      <Sidebar />
      <div className="fee-content">
        <div className="l-header">
          <p>SchoolHub Circular</p>
        </div>
        <div className="fee-setup">
          <div className="fee-setup-header">
            <span>Admin Notification</span>
          </div>
          <form className="setup-form" onSubmit={handleSubmit}>
            <div className="setup-left">
              <div className="setup-right">
                <div className="setup-box">
                  <label style={{ fontWeight: "bold", fontSize: "large" }}>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    style={{ width: "1020px" }}
                  />
                </div>
                <div className="setup-box">
                  <label style={{ fontWeight: "bold", fontSize: "large" }}>
                    Notification
                  </label>
                  <textarea
                    name="command"
                    value={command}
                    onChange={handleChange}
                    style={{ width: "1020px", height: "250px" }}
                  />
                </div>
              </div>
            </div>
            <div className="save-changes">
              <button type="submit">SUBMIT</button>
            </div>
            <div className="fee-view"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminnotificationUpdate;
