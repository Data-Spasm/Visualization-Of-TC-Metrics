import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarController from "../controllers/Avatar";
import { generateAvatarUrl } from "../utils/avatarUrlGenerator";
import "./StudentList.css";

const StudentList = ({ students, onSelectStudent }) => {
  const navigate = useNavigate();

  const handleClick = (student) => {
    onSelectStudent(student);
    navigate("/students");
  };

  const getOverallAccuracyValue = (student) => {
    const accuracy = student.student?.reading?.overallPerformance?.overallAccuracy;
    return typeof accuracy === "number" ? accuracy * 100 : null;
  };

  const getBarColorClass = (percent) => {
    if (percent < 50) return "low";
    if (percent < 75) return "fair";
    if (percent < 90) return "good";
    return "excellent";
  };

  const groupedStudents = {
    Excellent: [],
    Good: [],
    Fair: [],
    Low: [],
  };

  students.forEach((student) => {
    const accuracy = getOverallAccuracyValue(student);
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
    <div className="student-list-wrapper">
      <div className="student-list-container">
        <h2>Students</h2>
        <div className="responsive-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Avg Accuracy (%)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {performanceOrder.map((group, gIndex) => (
                <React.Fragment key={group}>
                  {groupedStudents[group].length > 0 && (
                    <tr className="group-divider">
                      <td colSpan="5">{group} Performers</td>
                    </tr>
                  )}
                  {groupedStudents[group].map((student, index) => {
                    const studentId = student._id?.$oid;
                    const avatarData = AvatarController.getAllAvatars().find(
                      avatar => avatar._id?.$oid === studentId
                    );
                    const avatarUrl = avatarData ? generateAvatarUrl(avatarData) : null;

                    const accuracyVal = getOverallAccuracyValue(student);
                    const accuracyPercent = accuracyVal?.toFixed(1) ?? "N/A";
                    const barColor = getBarColorClass(accuracyVal || 0);

                    // Tooltip mock improvement for now
                    let tooltipMsg = "No data";

                    if (accuracyVal !== null) {
                    if (accuracyVal === 0) {
                        tooltipMsg = `${accuracyPercent}% | No improvement data available`;
                    } else {
                        const improvement = (Math.random() * 20 - 10).toFixed(1);
                        tooltipMsg = `${accuracyPercent}% | ${improvement >= 0 ? "Improved" : "Dropped"} by ${Math.abs(improvement)}% since last week`;
                    }
                    }

                    return (
                      <tr key={`${studentId}-${index}`} className="striped-row">
                        <td>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="avatar-image" />
                          ) : (
                            <div className="avatar-placeholder">👤</div>
                          )}
                        </td>
                        <td>{`${student.firstName} ${student.lastName}`}</td>
                        <td>{`Stu-${studentId?.slice(-6) || index + 1}`}</td>
                        <td>
                          {accuracyVal !== null ? (
                            <div
                              className="accuracy-bar-container"
                              title={tooltipMsg}
                            >
                              <div
                                className={`accuracy-bar-fill ${barColor}`}
                                style={{ width: `${accuracyVal}%` }}
                              >
                                {`${accuracyPercent}%`}
                              </div>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>
                          <button
                            className="reading-progress-button"
                            onClick={() => handleClick(student)}
                          >
                            Reading Progress
                          </button>
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
