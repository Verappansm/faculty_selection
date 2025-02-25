import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseSelection.css';

const CourseSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from location state or fallback to localStorage
  const storedEmpId = localStorage.getItem('empId');
  const storedFacultyEmail = localStorage.getItem('facultyEmail');
  const storedPreference = localStorage.getItem('preference');

  const empId = location.state?.empId || storedEmpId;
  const facultyEmail = location.state?.facultyEmail || storedFacultyEmail;
  const preference = location.state?.preference || storedPreference;

  const [facultyName, setFacultyName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [ug, setUg] = useState('');
  const [ugspecialization, setUgspecialization] = useState('');
  const [pg, setPg] = useState('');
  const [pgspecialization, setPgspecialization] = useState('');
  const [researchDomain, setResearchDomain] = useState('');

  // Fetch faculty name based on email
  useEffect(() => {
    if (facultyEmail) {
      axios.get('faculties.json')
        .then(response => {
          const faculty = response.data.find(fac => fac.email === facultyEmail);
          if (faculty) {
            setFacultyName(faculty.name);
          } else {
            setFacultyName('Unknown Faculty');
          }
        })
        .catch(error => console.error("Error fetching faculty data:", error));
    }
  }, [facultyEmail]);

  // Fetch course data
  useEffect(() => {
    axios.get('courses.json')
      .then(response => setCourses(response.data))
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  const maxCourses = 7

  const handleCourseSelect = (course) => {
    setSelectedCourses(prev => {
      if (prev.length >= maxCourses && !prev.some(c => c.courseId === course.courseId)) {
        alert(`You can only select exactly ${maxCourses} courses.`);
        return prev;
      }

      const domainCount = prev.filter(c => c.domain === course.domain).length;
      if (domainCount >= 2 && !prev.some(c => c.courseId === course.courseId)) {
        alert(`You can only select up to 2 courses from the ${course.domain} domain.`);
        return prev;
      }

      if (prev.some(c => c.courseId === course.courseId)) {
        return prev.filter(c => c.courseId !== course.courseId);
      }
      return [...prev, course];
    });
  };

  const handleSubmit = async () => {
    if (!empId) {
      alert("Error: Employee ID is missing!");
      return;
    }

    if (!facultyName) {
      alert("Error: Faculty name is missing!");
      return;
    }

    if (selectedCourses.length !== maxCourses) {
      alert(`You must select exactly ${maxCourses} courses.`);
      return;
    }

    const theoryCount = selectedCourses.filter(c => c.type === "Theory").length;
    const theoryLabCount = selectedCourses.filter(c => c.type === "Theory+Lab").length;

    const minTheory = 5
    const minTheoryLab = 5

    if (preference === "Theory" && theoryCount < minTheory) {
      alert(`You must select at least ${minTheory} Theory courses.`);
      return;
    }
    if (preference === "Theory+Lab" && theoryLabCount < minTheoryLab) {
      alert(`You must select at least ${minTheoryLab} Theory+Lab courses.`);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faculty/submit-courses`, 
        { empId, facultyName, facultyEmail, preference, selectedCourses },
        { headers: { 'Content-Type': 'application/json' } }
      );
      await axios.post(`http://localhost:5000/faculty/storeugpg`, 
        { empId, ug, ugspecialization, pg, pgspecialization, researchDomain },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert("Courses submitted successfully!");
      navigate('/');  
    } catch (error) {
      console.error("Error submitting courses:", error);
      alert("Error submitting courses. Check console for details.");
    }
  };

  // Helper function to group courses by domain
  const groupByDomain = (courses) => {
    return courses.reduce((acc, course) => {
      if (!acc[course.domain]) {
        acc[course.domain] = [];
      }
      acc[course.domain].push(course);
      return acc;
    }, {});
  };

  // Grouping courses
  const theoryCoursesByDomain = groupByDomain(courses.filter(course => course.type === "Theory"));
  const theoryLabCoursesByDomain = groupByDomain(courses.filter(course => course.type === "Theory+Lab"));

  return (
    <div className="course-selection-container">
      <h1>Course Selection</h1>
      <p className="faculty-details">Faculty Name: <strong>{facultyName || "N/A"}</strong></p>
      {/* <p className="faculty-details">Faculty Email: <strong>{facultyEmail || "N/A"}</strong></p> */}
      <p className="faculty-details">Preference: <strong>{preference || "N/A"}</strong></p>
      <p className="faculty-details">Employee ID: <strong>{empId || "N/A"}</strong></p>
      <p><strong>You must select exactly {maxCourses} courses.</strong></p>

      <div className="input-fields">
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <label>
            UG:
            <input
              type="text"
              value={ug}
              onChange={(e) => setUg(e.target.value)}
            />
          </label>
          <label>
            UG specialization:
            <input
              type="text"
              value={ugspecialization}
              onChange={(e) => setUgspecialization(e.target.value)}
            />
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <label>
            PG:
            <input
              type="text"
              value={pg}
              onChange={(e) => setPg(e.target.value)}
            />
          </label>
          <label>
            PG specialization:
            <input
              type="text"
              value={pgspecialization}
              onChange={(e) => setPgspecialization(e.target.value)}
            />
          </label>
        </div>
        
        <label>
          Research Domain:
          <input
            type="text"
            value={researchDomain}
            onChange={(e) => setResearchDomain(e.target.value)}
          />
        </label>
      </div>

      <div className="selected-courses">
        <h2>Selected Courses</h2>
        <ol>
          {selectedCourses.map(course => (
            <li key={course.courseId}>
              {course.courseName} ({course.type}) ({course.courseId}) - <strong>{course.domain}</strong>
            </li>
          ))}
        </ol>
      </div>

      <h2 className="course-category">Theory Courses</h2>
      <div className="course-list">
        {Object.keys(theoryCoursesByDomain).map(domain => (
          <div key={domain}>
            <h3>{domain}</h3>
            {theoryCoursesByDomain[domain].map(course => (
              <label key={course.courseId}>
                <input
                  type="checkbox"
                  checked={selectedCourses.some(c => c.courseId === course.courseId)}
                  onChange={() => handleCourseSelect(course)}
                />
                {course.courseName} ({course.type}) ({course.courseId}) - <strong>{course.domain}</strong>
              </label>
            ))}
          </div>
        ))}
      </div>

      <h2 className="course-category">Theory+Lab Courses</h2>
      <div className="course-list">
        {Object.keys(theoryLabCoursesByDomain).map(domain => (
          <div key={domain}>
            <h3>{domain}</h3>
            {theoryLabCoursesByDomain[domain].map(course => (
              <label key={course.courseId} style={{ display: "block", marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  checked={selectedCourses.some(c => c.courseId === course.courseId)}
                  onChange={() => handleCourseSelect(course)}
                />
                {course.courseName} ({course.type}) ({course.courseId}) - <strong>{course.domain}</strong>
              </label>
            ))}
          </div>
        ))}
      </div>

      <button className="submit-button" onClick={handleSubmit}>Submit Courses</button>
    </div>
  );
};

export default CourseSelection;