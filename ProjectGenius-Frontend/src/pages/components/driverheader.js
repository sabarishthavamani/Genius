import React, { useContext, useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { DriverMenuContext } from "../../context/teachermenucontext";
import { IoClose, IoPaperPlane } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import { removeAuthRec, removeAuthToken } from "../../lib/localstorage";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { adminnotificationDisplay } from "../../actions/adminAction";
import { IoPersonSharp } from "react-icons/io5";

const DriverHeader = () => {
  //context
  const { openMenu, toggleMenu } = useContext(DriverMenuContext);
  //state
  const [driverInfo, setdriverInfo] = useState("");
  const [navPop, setNavPop] = useState(false);
  const [notification, setNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // New state for unread notification count

  console.log(openMenu, "open...", toggleMenu, "toggle...");

  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setdriverInfo(JSON.parse(localStorage.getItem("DRIVER_DATA")));
    };
    handleStorageChange();
  }, []);

  const detailHandler = () => {
    setNavPop((prev) => !prev);
  };

  const notificationHandle = () => {
    setNotification((not) => !not);

    // Reset unreadCount when notifications are viewed
    if (!notification) {
      setUnreadCount(0);
    }
  };

  // Notification

  const [data, setData] = useState([]);
  const [IMAGE_URL, setIMAGE_URL] = useState("");

  const fetchData = async () => {
    const formatDate = (date) => {
      const formattedDate = new Date(date);
      const day = formattedDate.getDate();
      const month = formattedDate.toLocaleString("default", { month: "short" });
      const year = formattedDate.getFullYear();
      return `${day} ${month} ${year}`;
    };

    const schedularcurrentDate = formatDate(new Date());
    console.log("Current Date:", schedularcurrentDate);

    try {
      const { status, result, imageUrl } = await adminnotificationDisplay();
      console.log("Date in result:", result);

      if (status) {
        const filteredResult = result.filter(
          (item) => formatDate(item.date) === schedularcurrentDate
        );

        console.log("Filtered result:", filteredResult);

        setIMAGE_URL(imageUrl);
        setData(filteredResult);

        // Update unreadCount with the number of unread notifications
        setUnreadCount(filteredResult.length);

        if (filteredResult.length === 0) {
          console.log("There are no values today");
        }
      } else {
        console.log("Error fetching data:", result);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="genius-header">
      <button
        className="teacher-ham-btn"
        type="button"
        onClick={() => toggleMenu()}
      >
        {openMenu ? <IoClose size={30} /> : <RxHamburgerMenu size={30} />}
      </button>
      <div className="genius-logo">
        <img
          src={`${process.env.PUBLIC_URL}/images/Polygon 3.png`}
          alt="logo"
        />
        <span>Genius</span>
      </div>

      <div className="scl-std" onClick={detailHandler}>
        <img
          src={driverInfo.driverphoto}
          width={"40px"}
          height={"40px"}
          style={{ borderRadius: "50%" }}
        />

        {/* <span>{driverInfo.name}</span> */}
      </div>

      {navPop && (
        <>
          <div
            className="nav-setting-overlay"
            onClick={() => setNavPop((prev) => !prev)}
          ></div>
          <div className="nav-setting">
            <button
              type="button"
              onClick={() => setNavPop(false)}
              className="nav-setting-close-btn"
            >
              <IoClose />
            </button>
            <div className="nav-setting-container">
              <div className="nav-setting-content">
                <div className="nav-setting-header">
                  <p>{driverInfo.name}</p>
                  <span>{driverInfo.driverId}</span>
                </div>

                <div className="nav-setting-controls">
                  <p className="nav-setting-button">{driverInfo.role}</p>
                </div>

                <div className="nav-setting-controls">
                  <button
                    type="button"
                    className="nav-setting-button"
                    onClick={() => {
                      navigate("/teacher-changepassword");
                    }}
                  >
                    <RiLockPasswordLine />
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="nav-setting-button"
                    onClick={() => {
                      removeAuthToken();
                      removeAuthRec();
                      navigate("/driver-login");
                    }}
                  >
                    <AiOutlineLogout />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DriverHeader;
