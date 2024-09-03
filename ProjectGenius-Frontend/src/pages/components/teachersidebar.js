import React, { useState, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
import { GrTableAdd } from "react-icons/gr";
import { IoPersonSharp } from "react-icons/io5";
import { FcLeave } from "react-icons/fc";
import { MdAssignment } from "react-icons/md";
//import Lib
import { removeAuthRec, removeAuthToken } from "../../lib/localstorage";
//import Context
import { TeacherMenuContext } from "../../context/teachermenucontext";

const TeacherSidebar = () => {
  const { openMenu, toggleMenu } = useContext(TeacherMenuContext);
  //hooks
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [dropdownExpanded, setDropdownExpanded] = useState(false);

  return (
    <>
      <div className={`side-menu-content ${openMenu ? "open" : "close"}`}>
        <div className="att-part-one">
          <div className="att-menu">
            <span>Track</span>
            <p
              className="am"
              style={
                pathname === "/teacher-dashboard"
                  ? { backgroundColor: "#f9f6b8" }
                  : {}
              }
              onClick={() => toggleMenu()}  // This closes the sidebar when clicking "Dashboard"
            >
              <Link to="/teacher-dashboard">
                <img
                  src={`${process.env.PUBLIC_URL}/images/dashboard.png`}
                  alt="dashboard"
                />
                Dashboard
              </Link>
            </p>
          </div>
          <div className="att-menu">
            <span>Analyze</span>
            <p
              className="am"
              style={
                pathname === "/teacher-marksheet"
                  ? { backgroundColor: "#f9f6b8" }
                  : {}
              }
              onClick={() => setDropdownExpanded(!dropdownExpanded)}  // Only expand or collapse dropdown
            >
              <Link className="report">
                <img
                  src={`${process.env.PUBLIC_URL}/images/report.png`}
                  alt="report"
                />
                Student Info
                <span>
                  {dropdownExpanded ? (
                    <IoMdArrowDropdown size={20} />
                  ) : (
                    <IoMdArrowDropright size={20} />
                  )}
                </span>
              </Link>
            </p>
            {dropdownExpanded && (
              <>
                <p
                  className="am"
                  style={
                    pathname === "/teacher-attendance"
                      ? { backgroundColor: "#f9f6b8" }
                      : {}
                  }
                  onClick={() => toggleMenu()}  // Close sidebar after clicking
                >
                  <Link to="/teacher-attendance" className="report ms-3">
                    <span>
                      <FaListCheck size={25} />
                    </span>
                    Attendance
                  </Link>
                </p>

                <p
                  className="am"
                  style={
                    pathname === "/student-timetable/:id"
                      ? { backgroundColor: "#f9f6b8" }
                      : {}
                  }
                  onClick={() => toggleMenu()}  // Close sidebar after clicking
                >
                  <Link to="/student-timetable/:id" className="report ms-3">
                    <span>
                      <GrTableAdd size={25} />
                    </span>
                    Time Table
                  </Link>
                </p>

                <p
                  className="am"
                  style={
                    pathname === "/parents-meeting"
                      ? { backgroundColor: "#f9f6b8" }
                      : {}
                  }
                  onClick={() => toggleMenu()}  // Close sidebar after clicking
                >
                  <Link to="/parents-meeting" className="report ms-3">
                    <span>
                      <GrTableAdd size={25} />
                    </span>
                    Parents Meeting
                  </Link>
                </p>

                <p
                  className="am"
                  style={
                    pathname === "/student-homework"
                      ? { backgroundColor: "#f9f6b8" }
                      : {}
                  }
                  onClick={() => toggleMenu()}  // Close sidebar after clicking
                >
                  <Link to="/student-homework" className="report ms-3">
                    <span>
                      <MdAssignment size={25} />
                    </span>
                    Home Work
                  </Link>
                </p>

                <p
                  className="am"
                  style={
                    pathname === "/teacher-generatecard"
                      ? { backgroundColor: "#f9f6b8" }
                      : {}
                  }
                  onClick={() => toggleMenu()}  // Close sidebar after clicking
                >
                  <Link to="/teacher-generatecard" className="report ms-3">
                    <span>
                      <TbReportSearch size={25} />
                    </span>
                    Generate Report
                  </Link>
                </p>

                <p
                  className="am"
                  style={
                    pathname === "/teacher-marksheet"
                      ? { backgroundColor: "#f9f6b8" }
                      : {}
                  }
                  onClick={() => toggleMenu()}  // Close sidebar after clicking
                >
                  <Link to="/teacher-marksheet" className="report ms-3">
                    <span>
                      <TbReportSearch size={25} />
                    </span>
                    Marksheet Edit
                  </Link>
                </p>
              </>
            )}
          </div>
          <div className="att-menu">
            <span>Manage</span>

            <p
              className="am"
              style={
                pathname === "/teacherleaveappliedlist"
                  ? { backgroundColor: "#f9f6b8" }
                  : {}
              }
              onClick={() => toggleMenu()}  // Close sidebar after clicking
            >
              <Link to="/teacherleaveappliedlist" className="child">
                <span>
                  <FcLeave size={25} />
                </span>
                Leave List
              </Link>
            </p>

            <p
              className="am"
              style={
                pathname === "/profile-details"
                  ? { backgroundColor: "#f9f6b8" }
                  : {}
              }
              onClick={() => toggleMenu()}  // Close sidebar after clicking
            >
              <Link to="/profile-details" className="child">
                <span>
                  <IoPersonSharp size={25} />
                </span>
                Profile
              </Link>
            </p>
          </div>
        </div>
        <button
          data-bs-toggle="tooltip"
          title="Logout!"
          data-bs-placement="right"
          className="teachersignout"
          onClick={() => {
            removeAuthToken();
            removeAuthRec();
            navigate("/teacher-login");
          }}
        >
          Logout
          <span>
            <FontAwesomeIcon icon={faSignOut} />
          </span>
        </button>
      </div>
      <div
        className={`side-menu-overlay ${openMenu ? "open" : "close"}`}
        onClick={() => toggleMenu()}
      ></div>
    </>
  );
};
export default TeacherSidebar;
