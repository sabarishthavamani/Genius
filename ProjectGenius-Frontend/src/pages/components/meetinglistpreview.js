import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faSchool,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import AlertConfirm, { Button } from "react-alert-confirm";
import { deleteMeeting, viewMeeting } from "../../actions/teacherAction";
import toastAlert from "../../lib/toast";
import { FaFilePdf } from "react-icons/fa";

const MeetingPreview = (props) => {
  const { meetingList, getIndividualData } = props;
  const [IMAGE_URL, setIMAGE_URL] = useState("");

  console.log(meetingList, "getmeetinglist...");

  const homeworkDelete = async (Id) => {
    try {
      let { status, message } = await deleteMeeting(Id);
      if (status === true) {
        toastAlert("success", message);
        getIndividualData();
      } else if (status === false) {
        toastAlert("error", message);
      }
    } catch (err) {
      console.log(err, "--err");
    }
  };

  const getData = async () => {
    const meeting = await viewMeeting();
    const meetingFile = meeting.imageUrl;
    setIMAGE_URL(meetingFile);
    console.log(meetingFile, "meetingFile...");
  };

  useEffect(() => {
    getIndividualData();
    getData();
  }, []);

  const openBasic = async (Id) => {
    const [action] = await AlertConfirm("Are you sure, you want to delete it");
    if (action) {
      homeworkDelete(Id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Change the locale as per your requirement
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="att-sheet" 
    style={{ width:'100%',marginTop:'20px',marginBottom:'20px' }}
    >
       <div
            className="att-record"
          >
      <table className="sheet" border={1}>
        <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
          <tr className="sheet-head">
            <th>S.No</th>
            <th>Class</th>
            <th>Student</th>
            <th>Description</th>
            <th>Assigned Date</th>
            <th>File</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {meetingList && meetingList.length > 0 ? (
            meetingList
              .filter((item) => {
                const assignDate = new Date(item.assignDate);
                return (
                  assignDate.getDate() === currentDate.getDate() &&
                  assignDate.getMonth() === currentMonth &&
                  assignDate.getFullYear() === currentYear
                );
              })
              .map((item, key) => (
                <tr className="sheet-body" key={key}>
                  <td>{key + 1}</td>
                  <React.Fragment>
                    <td>{item.className}</td>
                    <td>{item.studentName}</td>
                    <td>{item.description}</td>
                    <td>{formatDate(item.assignDate)}</td>
                    <td className="teacherprofile" style={{ width: "100px" }}>
                      {item.fileUploads ? (
                        <>
                          {item.fileUploads.endsWith("pdf") ? (
                            <>
                              <FaFilePdf size={24} />
                              <span style={{ marginLeft: "7px" }}></span>
                              <a
                                target="_blank"
                                href={`${IMAGE_URL}/${item.fileUploads}`}
                              >
                                View
                              </a>
                            </>
                          ) : (
                            <>
                              <img
                                src={`${IMAGE_URL}/${item.fileUploads}`}
                                alt=""
                              />
                              <a
                                target="_blank"
                                href={`${IMAGE_URL}/${item.fileUploads}`}
                              >
                                View
                              </a>
                            </>
                          )}
                        </>
                      ) : (
                        <p>
                          <span>No files uploaded</span>
                        </p>
                      )}
                    </td>
                  </React.Fragment>
                  <td>
                    <div>
                      <Button
                        onClick={() => openBasic(item._id)}
                        className="pop-up-button"
                      >
                        <a
                          className="dropdown-item"
                          href="#"
                          style={{ color: "red" }}
                        >
                          <i
                            className="fa fa-trash-o"
                            style={{ color: "red", marginRight: 10 }}
                          />
                        </a>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="7">No meetings found for today</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default MeetingPreview;
