// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";  // To decode token and get user email

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [responseMessage, setResponseMessage] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setFormData((prevData) => ({
//           ...prevData,
//           email: decodedToken.email || "",  // Auto-fill email if user is logged in
//         }));
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResponseMessage("");

//     try {
//       const response = await axios.post("https://testhost.pythonanywhere.com/api/users/contact/", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.data.success) {
//         setResponseMessage("Message sent successfully!");
//         setFormData({ name: "", email: formData.email, message: "" }); // Keep email if user is logged in
//       } else {
//         setResponseMessage("Failed to send message.");
//       }
//     } catch (error) {
//       setResponseMessage("Error sending message. Please try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" }}>
//       <h2>Contact Us</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "10px" }}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>
//         <div style={{ marginBottom: "10px" }}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             value={formData.email}
//             onChange={handleChange}
//             required={!formData.email}  // Only required if email is not prefilled
//             style={{ width: "100%", padding: "8px" }}
//             readOnly={!!formData.email} // Make the field readonly if user is logged in
//           />
//         </div>
//         <div style={{ marginBottom: "10px" }}>
//           <textarea
//             name="message"
//             placeholder="Your Message"
//             value={formData.message}
//             onChange={handleChange}
//             required
//             rows="4"
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>
//         <button type="submit" disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
//           {loading ? "Sending..." : "Send Message"}
//         </button>
//       </form>
//       {responseMessage && <p>{responseMessage}</p>}
//     </div>
//   );
// };

// export default ContactUs;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setFormData((prevData) => ({
          ...prevData,
          name: decodedToken.username || "",
          email: decodedToken.email || "",
        }));
  
        // Fetch name & email from backend (ensure token is included)
        axios.get("https://testhost.pythonanywhere.com/api/users/contact/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setFormData((prevData) => ({
            ...prevData,
            name: response.data.name,
            email: response.data.email,
          }));
        })
        .catch((error) => console.error("Error fetching user info:", error));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const token = localStorage.getItem("token");
      console.log("Sending data:", { message: formData.message });

const response = await axios.post(
  "https://testhost.pythonanywhere.com/api/users/contact/",
  { message: formData.message },  
  {
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  }
);


      if (response.data.success) {
        setResponseMessage("Message sent successfully!");
        setFormData((prevData) => ({ ...prevData, message: "" })); // Clear only message field
      } else {
        setResponseMessage("Failed to send message.");
      }
    } catch (error) {
      setResponseMessage("Error sending message. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly // User cannot change name
            style={{ width: "100%", padding: "8px", background: "#f0f0f0" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly // User cannot change email
            style={{ width: "100%", padding: "8px", background: "#f0f0f0" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default ContactUs;
