import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AvatarController from "../controllers/Avatar";
import { generateAvatarUrl } from "../utils/avatarUrlGenerator";
import useAnalyticsEvent from "../hooks/useAnalyticsEvent";
import "./StudentList.css";

const StudentList = ({ students }) => {
  const navigate = useNavigate();
  const [processingStudentId, setProcessingStudentId] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const trackEvent = useAnalyticsEvent("Student List");
  const hoverStartRef = useRef({});

  useEffect(() => {
    const loadAvatars = async () => {
      try {
        const data = await AvatarController.getAllAvatars();
        setAvatars(data);
      } catch (err) {
        console.error("Failed to load avatars:", err);
      }
    };

    loadAvatars();
    trackEvent("component_view", "Student List Page Loaded");
  }, [trackEvent]);

  const handleMouseEnter = (label) => {
    hoverStartRef.current[label] = Date.now();
    trackEvent("hover_start", label);
  };

  const handleMouseLeave = (label) => {
    const start = hoverStartRef.current[label];
    if (start) {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEvent("hover_end", label, duration);
      delete hoverStartRef.current[label];
    }
  };

  const handleClick = (student) => {
    const studentId = student._id?.$oid || student._id;
    setProcessingStudentId(studentId);
    trackEvent("card_click", `Reading Progress Click - ${student.firstName} ${student.lastName}`);
    navigate(`/students/${studentId}`);
  };

  const getAccuracyValue = (student) => {
    const accuracy = student.student?.reading?.overallPerformance?.overallAccuracy;
    return typeof accuracy === "number" ? accuracy * 100 : null;
  };

  const getFluencyValue = (student) => {
    const fluency = student.student?.reading?.overallPerformance?.overallFluency;
    return typeof fluency === "number" ? fluency : null;
  };

  const getBarColorClass = (value) => {
    if (value < 50) return "low";
    if (value < 75) return "fair";
    if (value < 90) return "good";
    return "excellent";
  };

  if (!Array.isArray(students)) {
    console.warn("StudentList received non-array or missing student data:", students);
    return <div className="loading-message">Loading students...</div>;
  }

  const groupedStudents = {
    Excellent: [],
    Good: [],
    Fair: [],
    Low: [],
  };

  students.forEach((student) => {
    const accuracy = getAccuracyValue(student);
    if (accuracy === null || accuracy < 50) {
      groupedStudents.Low.push(student);
    } else if (accuracy < 75) {
      groupedStudents.Fair.push(student);
    } else if (accuracy < 90) {
      groupedStudents.Good.push(student);
    } else {
      groupedStudents.Excellent.push(student);
    }
  });

  const performanceOrder = ["Excellent", "Good", "Fair", "Low"];

  return (
    <div className="classroom student-list">
      <div className="student-list-container">
        <h2>Students</h2>
        <div className="responsive-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Accuracy vs Fluency</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {performanceOrder.map((group) => (
                <React.Fragment key={group}>
                  {groupedStudents[group].length > 0 && (
                    <tr className="group-divider">
                      <td colSpan="5">{group} Performers</td>
                    </tr>
                  )}
                  {groupedStudents[group].map((student, index) => {
                    const studentId = student._id?.$oid || student._id;
                    const avatarData = avatars.find(
                      avatar => avatar._id?.$oid === studentId || avatar._id === studentId
                    );
                    const gender = student.gender?.toLowerCase() === "female" ? "female" : "male";

                    // Define fallback URL based on gender
                    const genderFallbackUrl = `https://avataaars.io/?avatarStyle=Circle&topType=${
                      gender === "female" ? "LongHairStraight" : "ShortHairShortFlat"
                    }&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=Black&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light`;

                    // Only use avatarData if it is truly customized
                    const avatarUrl =
                      avatarData && avatarData.generatedUsername !== "Default_Name"
                        ? generateAvatarUrl(avatarData)
                        : genderFallbackUrl;

                    const accuracyVal = getAccuracyValue(student);
                    const fluencyVal = getFluencyValue(student);
                    const accuracyPercent = accuracyVal?.toFixed(1) ?? "N/A";
                    const fluencyDisplay = fluencyVal?.toFixed(1) ?? "N/A";

                    const rowLabel = `${student.firstName} ${student.lastName} Row`;

                    return (
                      <tr
                        key={`${studentId}-${index}`}
                        className="striped-row"
                        onMouseEnter={() => handleMouseEnter(rowLabel)}
                        onMouseLeave={() => handleMouseLeave(rowLabel)}
                      >
                        <td>
                          <img src={avatarUrl} alt="Avatar" className="avatar-image" />
                        </td>
                        <td>{`${student.firstName} ${student.lastName}`}</td>
                        <td>{`Stu-${studentId?.slice(-6) || index + 1}`}</td>
                        <td>
                          <div className="dual-bar-container">
                            <div className="accuracy-bar-container">
                              <div
                                className={`accuracy-bar-fill ${getBarColorClass(accuracyVal || 0)}`}
                                style={{
                                  width: `${accuracyVal || 0}%`,
                                  backgroundColor: "#3b82f6",
                                }}
                              ></div>
                              <span className="bar-value right">{accuracyPercent}%</span>
                            </div>
                            <div className="accuracy-bar-container">
                              <div
                                className={`accuracy-bar-fill ${getBarColorClass(fluencyVal || 0)}`}
                                style={{
                                  width: `${Math.min(fluencyVal || 0, 100)}%`,
                                  backgroundColor: "#10b981",
                                }}
                              ></div>
                              <span className="bar-value right">{fluencyDisplay} WPM</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {processingStudentId === studentId ? (
                            <span className="processing-message">
                              <span className="spinner-inline" /> Processing performance data...
                            </span>
                          ) : (
                            <button
                              className="reading-progress-button"
                              onClick={() => handleClick(student)}
                              onMouseEnter={() =>
                                handleMouseEnter(`Reading Progress Button - ${student.firstName}`)
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(`Reading Progress Button - ${student.firstName}`)
                              }
                            >
                              Reading Progress
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;