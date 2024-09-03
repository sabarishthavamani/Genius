import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import AlertConfirm, { Button } from "react-alert-confirm";
//import components
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import TimeTablePreview from "./components/timetablepreview";
//import Action
import {
  getSingleteacher,
  createteacherschedule,
  getfixedschedule,
  viewTeacher,
  findClass,
  findWholeClass,
  createStudentSchedule,
  getStudentcShedule,
} from "../actions/adminAction";
//import lib
import toastAlert from "../lib/toast";
import { assignHomeWork, viewHomeWork } from "../actions/teacherAction";
import HomeWorkPreview from "./components/homeworkpreview";
import TeacherHeader from "./components/teachernavbar";
import TeacherSidebar from "./components/teachersidebar";

function AssignHomeWork() {
  //state
  // const [teacherName, setTeacherName] = useState("");
  // const [teacherId, setTeacherId] = useState("");
  const [selectedClass, setSelectedClass] = useState([]);
  const [selectedClassview, setSelectedClassview] = useState("");
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionview, setSelectedSectionview] = useState("");
  const [teachingSubject, setTeachingSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignDate, setassignDate] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [homeWorkList, sethomeWorkList] = useState("");
  const [fileUploads, setfileUploads] = useState("");
  const [selectedTeacher, setselectedTeacher] = useState("");
  const { Id } = useParams();

  const navigate = useNavigate();

  const [teacherData] = useState(
    JSON.parse(localStorage.getItem("TEACHER_DATA"))
  );
  const teacherId = teacherData.teacherId;
  const teacherName = teacherData.name;
  // const getData = async () => {
  //   try {
  //     let { status, result } = await viewTeacher();
  //     if (status === true) {
  //       const teachingSubList = result
  //         .flatMap((teacher) => teacher.subjects.split(","))
  //         .reduce((uniqueSubjects, subject) => {
  //           if (!uniqueSubjects.has(subject)) {
  //             uniqueSubjects.add(subject);
  //           }
  //           return uniqueSubjects;
  //         }, new Set());

  //       console.log(Array.from(teachingSubList));

  //       console.log(teachingSubList, "teachingSubList...");

  //       setTeachingSubject(Array.from(teachingSubList));
  //     }
  //   } catch (err) {
  //     console.log(err, "---err");
  //   }
  // };
  useEffect(() => {
    // getData(Id);
    classDetails();
  }, []);

  const classDetails = async () => {
    try {
      const teachClass = await findWholeClass();
      const classData = teachClass.result;
      console.log(classData, "classData.,,..,,..");
      const singleTeacherClass = classData.filter(
        (data) => data.teacherId === teacherId
      );

      setselectedTeacher(singleTeacherClass);

      console.log(selectedTeacher, "singleTeacherClass222.,,..,,..");

      // Extract className and section from status array
      const classSections = singleTeacherClass.map((item) => item.status);
      const classNames = classSections.flatMap((status) =>
        status.map((s) => s.className)
      );
      const sectionNames = classSections.flatMap((status) =>
        status.map((s) => s.section)
      );
      console.log(classSections, "classSections");
      console.log(classNames, "cName");
      console.log(sectionNames, "sectionName");

      setSelectedClass(classNames);
      setSelectedSection(sectionNames);
    } catch (err) {
      console.log(err, "---err");
    }
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setSelectedClassview(selectedClass);
    console.log(selectedClass, "selectedClass.....");

    const selectedTeacherData = selectedTeacher.find((data) =>
      data.status.some(
        (status) =>
          status.className === selectedClass &&
          status.section === selectedSectionview
      )
    );

    if (selectedTeacherData) {
      const sections = selectedTeacherData.status
        .filter((status) => status.className === selectedClass)
        .map((status) => status.section);

      setSelectedSectionview(sections.length > 0 ? sections[0] : "");

      const subjects = selectedTeacherData.status
        .filter(
          (status) =>
            status.className === selectedClass &&
            status.section === selectedSectionview
        )
        .flatMap((status) => status.subjects);
      setTeachingSubject(subjects);
    } else {
      setTeachingSubject([]);
    }
  };

  const handleSectionChange = (e) => {
    const selectedSection = e.target.value;
    setSelectedSectionview(selectedSection);

    const selectedTeacherData = selectedTeacher.find((data) =>
      data.status.some(
        (status) =>
          status.className === selectedClassview &&
          status.section === selectedSection
      )
    );

    if (selectedTeacherData) {
      const subjects = selectedTeacherData.status
        .filter(
          (status) =>
            status.className === selectedClassview &&
            status.section === selectedSection
        )
        .flatMap((status) => status.subjects);
      setTeachingSubject(subjects);
    } else {
      setTeachingSubject([]);
    }
  };

  console.log(teachingSubject, "sel sub....");

  const handleSubmit = async () => {
    if (
      !teacherName ||
      !teacherId ||
      !assignDate ||
      !dueDate ||
      !selectedClass ||
      !selectedSection ||
      !selectedSubject ||
      !descriptionContent
      // ! fileUpload
    ) {
      toastAlert("error", "Please fill in all the required fields");
      return;
    }

    // Create an array to store the homework assignments
    const homeworkData = [
      { subject: selectedSubject, description: descriptionContent },
    ];

    const formData = new FormData();
    formData.append("teacherId", teacherId);
    formData.append("name", teacherName);
    formData.append("assignDate", assignDate);
    formData.append("dueDate", dueDate);
    formData.append("className", selectedClassview);
    formData.append("section", selectedSectionview);

    // Append each homework assignment to the form data
    homeworkData.forEach((homework, index) => {
      formData.append(`homeWork[${index}][subject]`, homework.subject);
      formData.append(`homeWork[${index}][description]`, homework.description);
    });

    formData.append("fileUploads", fileUploads);

    console.log(selectedClassview, "selectedClass......");
    console.log(selectedSectionview, "selectedSection......");
    console.log(fileUploads, "fileUpload......");

    try {
      const { status, message, result } = await assignHomeWork(formData);
      if (status === true) {
        setassignDate("");
        setDueDate("");
        setSelectedClassview("");
        setSelectedSectionview("");
        setSelectedSubject("");
        setDescriptionContent("");
        setfileUploads("");
        toastAlert("success", message);
        sethomeWorkList(result);
        getIndividualData();
      } else if (status === false) {
        toastAlert("error", message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const getIndividualData = async () => {
    try {
      const { status, result } = await viewHomeWork();
      if (status === true) {
        sethomeWorkList(result);
        console.log(result, "list result.....");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePreClick = () => {
    navigate("/teacher-dashboard");
  };

  const handleFilePhotoChange = (event) => {
    const { name, files } = event.target;
    const selectedFile = files[0];
    setfileUploads(selectedFile);
  };

  const getPhotoName = () => {
    if (typeof fileUploads === "string" && fileUploads) {
      return fileUploads.split("/").pop();
    } else if (typeof fileUploads === "object") {
      return fileUploads.name;
    } else {
      return "";
    }
  };

  useEffect(() => {
    getIndividualData();
  }, []);

  return (
    <div className="dashboard-page">
      <TeacherHeader />
      <div className="dashboard-main">
        <TeacherSidebar />
        <div className="dashboard-container">
          <h2 className="dashboard-title">Student Schedule</h2>
          <div
            className="class-details"
            style={{ width: "85%", borderRadius: "15px" }}
          >
            <form className="teacher-form">
              {/* <div className="teach-box">
          <label htmlFor="teacherName">
            Teacher Name<sup>*</sup>
          </label>
          <input type="text" id="teacherName" value={teacherName}  />
        </div> */}
              <div className="teach-box">
                <label htmlFor="teacherId">
                  Teacher ID<sup>*</sup>
                </label>
                <input type="text" id="teacherId" value={teacherId} />
              </div>
              <div className="teach-box">
                <label htmlFor="assignDate">
                  Assigned Date<sup>*</sup>
                </label>
                <input
                  type="date"
                  id="assignDate"
                  value={assignDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setassignDate(e.target.value)}
                />
              </div>
              <div className="teach-box">
                <label htmlFor="dueDate">
                  Due Date<sup>*</sup>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="teach-box">
                <label htmlFor="class">
                  Class<sup>*</sup>
                </label>
                <select
                  id="class"
                  value={selectedClassview}
                  onChange={handleClassChange}
                >
                  <option value="">Select</option>

                  {selectedClass &&
                    selectedClass.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                </select>
              </div>
              <div className="teach-box">
                <label htmlFor="section">
                  Section<sup>*</sup>
                </label>
                <select
                  id="section"
                  value={selectedSectionview}
                  onChange={handleSectionChange}
                >
                  <option value="">Select</option>
                  {selectedSection &&
                    selectedSection.map((sectionName) => (
                      <option key={sectionName} value={sectionName}>
                        {sectionName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="teach-box">
                <label htmlFor="subject">
                  Subject<sup>*</sup>
                </label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Select</option>
                  {teachingSubject &&
                    teachingSubject.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>
              <div className="teach-box">
                <label htmlFor="description">
                  Description<sup>*</sup>
                </label>
                <textarea
                  id="description"
                  value={descriptionContent}
                  onChange={(e) => setDescriptionContent(e.target.value)}
                  minLength={10}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    outline: "none",
                    resize: "none",
                    height: "70px",
                  }}
                ></textarea>
              </div>
              {/* <div className="teach-box">
              <label htmlFor="fileUpload">
                File Upload<sup>*</sup>
              </label>
              <input
                type="file"
                id="file"
                name="fileUploads"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file"
                className="t-photo"
                style={{
                  borderRadius: "5px",
                  outline: "none",
                  resize: "none",
                  height: "70px",
                }}
              >
                <div style={{ marginRight: "10px" }}>
                  <FontAwesomeIcon
                    icon={faUpload}
                    style={{ height: "30px", width: "50px" }}
                  />
                </div>
                 {typeof fileUploads === "object" ? (
                    <span>{fileUploads.name}</span>
                  ) : (
                    <span>{}</span>
                  )} 
               </label>
            </div>   */}
              <div className="teach-box">
                <label>Upload Files</label>
                <input
                  type="file"
                  id="file"
                  name="fileUploads"
                  onChange={handleFilePhotoChange}
                />
                <label htmlFor="file" className="t-photo">
                  <div style={{ marginRight: "10px" }}>
                    <FontAwesomeIcon icon={faUpload} />
                  </div>
                  {typeof fileUploads === "object" ? (
                    <span>{fileUploads.name}</span>
                  ) : (
                    <span>{getPhotoName()}</span>
                  )}
                </label>
                {typeof fileUploads === "object" && (
                  <img
                    src={URL.createObjectURL(fileUploads)}
                    style={{ width: "60px", marginTop: "5px" }}
                  />
                )}
                {typeof fileUploads === "string" && (
                  <img
                    src={fileUploads}
                    style={{ width: "60px", marginTop: "5px" }}
                  />
                )}
              </div>
            </form>
          </div>
          <div className="sub-btnn">
            <button className="schedulesubmit" onClick={handlePreClick}>
              <FontAwesomeIcon icon={faArrowLeft} className="myarrow" />
              Go Back
            </button>
            <button
              className="schedulesubmit"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <HomeWorkPreview
            homeWorkList={homeWorkList}
            getIndividualData={getIndividualData}
          />
        </div>
      </div>
    </div>
  );
}

export default AssignHomeWork;
