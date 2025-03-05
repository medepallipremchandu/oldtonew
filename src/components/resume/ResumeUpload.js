import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import { resumeTemplates } from "./resumeTemplates";
import { jwtDecode } from "jwt-decode";

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeList, setResumeList] = useState([]); 
  const [selectedResume, setSelectedResume] = useState(null); 
  const [username, setUsername] = useState("User");
  const [selectedTemplate, setSelectedTemplate] = useState("basic");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken?.username) {
        setUsername(decodedToken.username);
      } else {
        fetchUserProfile(token);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      fetchUserProfile(token);
    }

    fetchProcessedResumes();
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(response.data.username || "User");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUsername("User"); 
    }
  };

  const fetchProcessedResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get("http://localhost:8000/api/users/process-resume/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumeList(response.data || []);
    } catch (error) {
      console.error("Error fetching processed resumes:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!resume) {
      alert("Please select a resume file.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post("http://localhost:8000/api/users/process-resume/", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (response.status !== 200) {
        alert("Upload failed. Server responded with an error.");
        return;
      }

      setFields(response.data.ai_suggested_fields);
      fetchProcessedResumes();
    } catch (error) {
      alert(`Upload failed: ${error.response?.data?.error || error.message}`);
    }
    setLoading(false);
  };

  const handleDownloadPDF = (resumeData) => {
    if (!resumeData) {
      alert("No data available to export.");
      return;
    }

    console.log("Downloading PDF for username:", username);

    const doc = new jsPDF();
    resumeTemplates[selectedTemplate](doc, resumeData);
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "_");
    const filename = `${username}_${timestamp}.pdf`;

    doc.save(filename);
  };

  const handleResumeClick = (resume) => {
    setSelectedResume(resume);
    setFields(resume.ai_suggested_fields);
  };

  return (
    <div>
      <h2>Upload Resume & Generate AI-Based Resume</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pdf,.docx" onChange={(e) => setResume(e.target.files[0])} required />
        <textarea
          placeholder="Paste Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Process Resume"}
        </button>
      </form>

      {fields && (
        <div>
          <h3>Generated Resume</h3>
          {Object.entries(fields).map(([section, content]) => (
            <div key={section} style={{ marginBottom: "20px" }}>
              <h3>{section}</h3>
              {typeof content === "object" ? (
                Array.isArray(content) ? (
                  content.map((item, index) => (
                    <div key={index} style={{ paddingLeft: "20px", borderLeft: "2px solid #ccc" }}>
                      {Object.entries(item).map(([key, value]) => (
                        <div key={key}>
                          <label>{key}: </label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                              setFields((prevData) => {
                                const updatedArray = [...prevData[section]];
                                updatedArray[index] = { ...updatedArray[index], [key]: e.target.value };
                                return { ...prevData, [section]: updatedArray };
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  Object.entries(content).map(([key, value]) => (
                    <div key={key}>
                      <label>{key}: </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setFields((prevData) => ({
                            ...prevData,
                            [section]: { ...prevData[section], [key]: e.target.value },
                          }))
                        }
                      />
                    </div>
                  ))
                )
              ) : (
                <textarea
                  value={content}
                  onChange={(e) =>
                    setFields((prevData) => ({
                      ...prevData,
                      [section]: e.target.value,
                    }))
                  }
                  rows={3}
                />
              )}
            </div>
          ))}
          <label>Select Resume Template:</label>
          <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
            <option value="basic">Basic</option>
            <option value="modern">Modern</option>
          </select>
          <button onClick={() => handleDownloadPDF(fields)}>Download</button>
        </div>
      )}

      <h2>Processed Resumes</h2>
      {resumeList.length > 0 ? (
        <ul>
          {resumeList.map((resume, index) => (
            <li key={index}>
              <p>📅 Processed On: {new Date(resume?.created_at).toLocaleString()}</p>
              <button onClick={() => handleResumeClick(resume)}>Edit</button>
              <button onClick={() => handleDownloadPDF(resume.ai_suggested_fields)}>Download</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No processed resumes found.</p>
      )}
    </div>
  );
};

export default ResumeUpload;