import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import {
  casualLeaveAllocateEdit,
  leaveAllocate,
  leaveAllocateDelete,
  leaveAllocateDisplay,
  viewDriver,
  viewTeacher,
} from "../actions/adminAction";
import toastAlert from "../lib/toast";
import NewEmployeeLeave from "./components/newemployeeleave";
import AlertConfirm from "react-alert-confirm";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/Adminsidebar";

const LeaveSchedule = () => {
  const navigate = useNavigate();
  const initialFormData = {
    employeeId: "",
    name: "",
    medicalLeave: "",
    casualLeave: "",
    paternityLeave: "",
    annualLeave: "",
    unpaidLeave: 0,
  };

  const [formValue, setFormValue] = useState(initialFormData);
  const [initialCasualLeave, setInitialCasualLeave] = useState("");
  const [casualLeaveBalance, setCasualLeaveBalance] = useState("");
  const Today = new Date().toLocaleDateString();

  const [showNewEmployeeLeavePopup, setShowNewEmployeeLeavePopup] =
    useState(false);

  const handleNewEmployeeLeavePopup = () => {
    setShowNewEmployeeLeavePopup(true);
  };

  const handleCloseNewEmployeeLeavePopup = () => {
    setShowNewEmployeeLeavePopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/vehicleview");
  };

  const handleReset = async () => {
    const response1 = await leaveAllocateDisplay();
    const allData = response1.result;
    console.log(allData,'allData....');
    const leaveDataExists = allData && allData.find(
      (data) => data.medicalLeave && data.casualLeave && data.paternityLeave
    );
    console.log(leaveDataExists, "previoussss...");
    if (!leaveDataExists) {
      toastAlert("error", "No leaves data allocated for employees.");
      return;
    }

    try {
      const response = await viewTeacher();
      const data = response;
      const teacheralldata = data.result;
      const teachers = await teacheralldata.filter((each) => each.active === 1);

      //driver

      const responsedriver = await viewDriver();
      const driverdata = responsedriver;
      const driveralldata = driverdata.result;
      const activedriver = await driveralldata.filter(
        (driver) => driver.active === 1
      );

      for (const teacher of teachers) {
        const formData = {
          employeeId: teacher.teacherId,
          name: teacher.name,
        };
        let { status, message } = await leaveAllocateDelete(formData);
        if (status === false) {
          toastAlert("error", message);
          return;
        }
      }

      for (const driver of activedriver) {
        const driverFormData = {
          employeeId: driver.driverId,
          name: driver.name,
        };
        let { status, message } = await leaveAllocateDelete(driverFormData);
        if (status === false) {
          toastAlert("error", message);
          navigate("/vehicleview");
          return;
        }
      }

      toastAlert(
        "success",
        "Previous leave allocation data deleted successfully"
      );
    } catch (err) {
      console.log(err);
    }
  };

  //createleaveschedular
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formValue.medicalLeave ||
      !formValue.casualLeave ||
      !formValue.paternityLeave
    ) {
      toastAlert("error", "Please fill in all fields");
      return;
    }

    const response = await leaveAllocateDisplay();
    const allData = response.result;
    const leaveDataExists = allData.find(
      (data) => data.medicalLeave && data.casualLeave && data.paternityLeave
    );
    console.log(leaveDataExists, "previoussss...");
    if (leaveDataExists) {
      toastAlert(
        "error",
        "Leave data already exists for all employees. Please reset the data to add new allocation."
      );
      return;
    }
    try {
      const formData = { ...formValue };
      const response2 = await viewTeacher();
      const data = response2;
      const teacheralldata = data.result;
      const teachers = await teacheralldata.filter((each) => each.active === 1);

      const responseDriver = await viewDriver();
      const driverdata = responseDriver;
      const drivveralldata = driverdata.result;
      const activeDrivers = await drivveralldata.filter(
        (driver) => driver.active === 1
      );

      for (const teacher of teachers) {
        const teacherFormData = {
          ...formData,
          employeeId: teacher.teacherId,
          name: teacher.name,
        };
        let { status, message } = await leaveAllocate(teacherFormData);
        if (status === false) {
          toastAlert("error", message);
          navigate("/vehicleview");
          return;
        }
      }

      // active drivers
      for (const driver of activeDrivers) {
        const driverFormData = {
          ...formData,
          employeeId: driver.driverId,
          name: driver.name,
        };
        let { status, message } = await leaveAllocate(driverFormData);
        if (status === false) {
          toastAlert("error", message);
          navigate("/vehicleview");
          return;
        }
      }
      toastAlert("success", "Leave allocated successfully for all teachers");
      setFormValue(initialFormData);
      navigate("/vehicleview");
    } catch (err) {
      console.log(err);
    }
  };

  const openBasic = async () => {
    const [action] = await AlertConfirm(
      `Are you sure, you want to update casual leave for this month ${Today}`
    );
    // action
    if (action) {
      handleUpdateCasual();
    }
  };

  const Resetpopup = async () => {
    const [action] = await AlertConfirm(
      `Are you sure, you want to reset the leave allocation for all employees (Note* : This will delete all the leave data)`
    );
    // action
    if (action) {
      handleReset();
    }
  };

  const handleUpdateCasual = async () => {
    if (!formValue.casualLeave) {
      toastAlert("error", "Please enter the days of leave");
      return;
    }

    try {
      //teacher
      const response = await viewTeacher();
      const data = response;
      const teacheralldata = data.result;
      const activeTeachers = await teacheralldata.filter(
        (each) => each.active === 1
      );

      //driver
      const responseDriver = await viewDriver();
      const driverdata = responseDriver;
      const drivveralldata = driverdata.result;
      const activeDrivers = await drivveralldata.filter(
        (driver) => driver.active === 1
      );

      let successFlag = false;

      //combine the values into one
      const allActiveEmployees = [...activeTeachers, ...activeDrivers];

      for (const employee of allActiveEmployees) {
        const allocateDisplay = await leaveAllocateDisplay();
        const allData = allocateDisplay.result;
        const employeeData = allData.find(
          (data) =>
            data.employeeId === employee.teacherId ||
            data.employeeId === employee.driverId   
        );
        if (
          !employeeData ||
          !("medicalLeave" in employeeData) ||
          !("casualLeave" in employeeData) ||
          !("paternityLeave" in employeeData)
        ) {
          continue;
        }

        const formData2 = {
          employeeId: employee.teacherId || employee.driverId,
          casualLeave: parseInt(formValue.casualLeave),
          unpaidLeave: formValue.unpaidLeave,
        };
        let { status, message } = await casualLeaveAllocateEdit(formData2);
        if (status === false) {
          toastAlert("error", message);
          return;
        }

        successFlag = true;
      }

      // Success message
      if (successFlag) {
        toastAlert(
          "success",
          "Leave allocated successfully for all teachers and drivers"
        );
        setFormValue(initialFormData);
        navigate("/vehicleview");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const total = (
      parseInt(formValue.medicalLeave || 0) +
      parseInt(formValue.casualLeave || 0) +
      parseInt(formValue.paternityLeave || 0)
    ).toString();
    setFormValue({ ...formValue, annualLeave: total });
  }, [formValue.medicalLeave, formValue.casualLeave, formValue.paternityLeave]);

  useEffect(() => {
    setInitialCasualLeave(formValue.casualLeave);
  }, [formValue.casualLeave]);

  return (
    <>
      <div className="attendance">
        <AdminHeader />
        <div className="attendance-content">
          <AdminSidebar />
          <div className="att-sheet">
            <h2 className="dashboard-title">Leave Allocation</h2>
            <div className="right-content">
              <div className="sub-btnn">
                <h5>Allocate Leave for new employee</h5>
                <a href="#" onClick={handleNewEmployeeLeavePopup}>
                  Add new
                </a>
              </div>
              <div className="teacher-details">
                <div className="teacher-header">
                  <ion-icon name="person" />
                  <span>Leave Details</span>
                </div>
                <form
                  action=""
                  className="teacher-form"
                  onSubmit={handleSubmit}
                >
                  <div className="teach-box">
                    <label htmlFor="medicalLeave">Medical Leave</label>
                    <input
                      type="number"
                      name="medicalLeave"
                      id="medicalLeave"
                      value={formValue.medicalLeave}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="teach-box">
                    <label htmlFor="casualLeave">Casual Leave</label>
                    <input
                      type="number"
                      name="casualLeave"
                      id="casualLeave"
                      value={formValue.casualLeave}
                      onChange={handleChange}
                      min={0}
                    />
                    <a href="#" onClick={() => openBasic()}>
                      Update casual leave
                    </a>
                  </div>
                  <div className="teach-box">
                    <label htmlFor="paternityLeave">Paternity Leave</label>
                    <input
                      type="number"
                      name="paternityLeave"
                      id="paternityLeave"
                      value={formValue.paternityLeave}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="teach-box">
                    <label htmlFor="annualLeave">Annual Leave</label>
                    <input
                      type="number"
                      name="annualLeave"
                      id="annualLeave"
                      value={formValue.annualLeave}
                      onChange={handleChange}
                      min={0}
                      disabled
                    />
                  </div>
                  {/* <div className="teach-box">
          <label htmlFor="unpaidLeave">Unpaid Leave(LOP)</label>
          <input
            type="number"
            name="unpaidLeave"
            id="unpaidLeave"
            value={formValue.unpaidLeave}
            onChange={handleChange}
            min={0}
          />
        </div> */}
                </form>
              </div>
              <div className="sub-btnn">
                <button onClick={handleCancel}>
                  <FontAwesomeIcon icon={faArrowLeft} className="myarrow" />
                  Cancel
                </button>

                <button type="submit" onClick={handleSubmit}>
                  Submit
                </button>

                <button type="button" onClick={Resetpopup}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNewEmployeeLeavePopup && (
        <div className="teacher-schedule-pop">
          <div
            className="schedule-pop-overlay"
            onClick={handleCloseNewEmployeeLeavePopup}
          ></div>
          <div className="schedule-pop-container">
            <NewEmployeeLeave />
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveSchedule;
