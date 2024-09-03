import React, { useEffect, useNavigate, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faSchool ,faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import AlertConfirm, { Button } from "react-alert-confirm";
import { deleteHomeWork, viewHomeWork } from "../../actions/teacherAction";
import toastAlert from "../../lib/toast";
import { FaFilePdf } from "react-icons/fa";

const HomeWorkPreview = (props) => {
  const { homeWorkList, getIndividualData } = props;
  const [IMAGE_URL, setIMAGE_URL] = useState("");



  const homeworkDelete = async (Id) => {
    try {
      let { status, message } = await deleteHomeWork(Id);
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

  const getData = async()=>{
    const Homework = await viewHomeWork();
      const homeWorkFile = Homework.imageUrl;
      setIMAGE_URL(homeWorkFile);
      console.log(homeWorkFile,'homeWorkFile...');
  }

  useEffect(() => {
    getIndividualData();
    getData()
  }, []);

  const openBasic = async (Id) => {
    const [action] = await AlertConfirm("Are you sure, you want to delete it");
    // action
    if (action) {
      homeworkDelete(Id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Change the locale as per your requirement
  };



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
            <th>Section</th>
            <th>Subject</th>
            <th>Home Work</th>
            <th>Assigned Date</th>
            <th>Last Date</th>
            <th>File</th>
            <th >Delete</th>
          </tr>
        </thead>
        <tbody>
          {homeWorkList &&
            homeWorkList.length > 0 &&
            homeWorkList .sort((a, b) => new Date(a.assignDate) - new Date(b.assignDate)).map((item, key) => (
              <tr className="sheet-body"  key={key}>
                <td>{key + 1}</td>
                {item.homeWork.map((hw, idx) => (
                  <React.Fragment key={idx}>
                    <td>{item.className}</td>
                    <td>{item.section}</td>
                    <td>{hw.subject}</td>
                    <td>{hw.description}</td>
                    <td>{formatDate(item.assignDate)}</td>
                    <td>{formatDate(item.dueDate)}</td>
                    <td className="teacherprofile" style={{width:'100px'}}>
                            {item.fileUploads ? (
                              <>
                                {item.fileUploads.endsWith("pdf")? (
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
                              <p>No files uploaded</p>
                            )}
                          </td>
                  </React.Fragment>
                ))}
                <td >
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
            ))}
        </tbody>
      </table>    
    </div>
    </div>
  );
};

export default HomeWorkPreview;
