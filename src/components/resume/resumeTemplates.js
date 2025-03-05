import { jsPDF } from "jspdf";

// Helper function to format JSON objects properly
const formatContent = (content) => {
  if (!content) return "";
  if (typeof content === "object") {
    return Object.entries(content)
      .map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`)
      .join("\n");
  }
  return content;
};

// Function to add sections with proper spacing, auto pagination, and formatting
const addSection = (doc, title, content, y) => {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, y);
  y += 6;
  doc.setFont("helvetica", "normal");

  if (Array.isArray(content)) {
    content.forEach((item, index) => {
      if (typeof item === "string") {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(`- ${item}`, 25, y);
        y += 6;
      } else {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(`- ${title} ${index + 1}`, 25, y);
        y += 6;
        Object.entries(item).forEach(([key, value]) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          let textValue = value;
          if (key === "Duration" && typeof value === "object") {
            textValue = `${value["Start Date"]} - ${value["End Date"]}`;
          }
          const lines = doc.splitTextToSize(`${key}: ${textValue}`, 160);
          lines.forEach((line) => {
            doc.text(line, 30, y);
            y += 6;
          });
        });
      }
    });
  } else if (typeof content === "object") {
    Object.entries(content).forEach(([key, value]) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      let textValue = value;
      if (key === "Duration" && typeof value === "object") {
        textValue = `${value["Start Date"]} - ${value["End Date"]}`;
      }
      const lines = doc.splitTextToSize(`${key}: ${textValue}`, 160);
      lines.forEach((line) => {
        doc.text(line, 25, y);
        y += 6;
      });
    });
  } else {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    const lines = doc.splitTextToSize(content, 160);
    lines.forEach((line) => {
      doc.text(line, 25, y);
      y += 6;
    });
  }

  return y + 4; // Return new y position after adding content
};

// Resume Templates with Auto Pagination
export const resumeTemplates = {
  basic: (doc, data) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Generated Resume", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let y = 30;
    const pageHeight = doc.internal.pageSize.height;

    // Personal Information
    if (data["Personal Information"]) {
      doc.setFont("helvetica", "bold");
      doc.text(data["Personal Information"]["Full Name"], 20, y);
      y += 6;
      doc.setFontSize(12);
      doc.text(`Email: ${data["Personal Information"]["Email"]}`, 20, y);
      y += 6;
      doc.text(`Phone: ${data["Personal Information"]["Phone"]}`, 20, y);
      y += 6;
      doc.text(`LinkedIn: ${data["Personal Information"]["LinkedIn Profile"] || "N/A"}`, 20, y);
      y += 6;
      doc.text(`GitHub: ${data["Personal Information"]["GitHub Profile"] || "N/A"}`, 20, y);
      y += 6;
      doc.text(`Portfolio: ${data["Personal Information"]["Portfolio Website"] || "N/A"}`, 20, y);
      y += 6;
      doc.text(`Location: ${data["Personal Information"]["Location"] || "N/A"}`, 20, y);
      y += 10;
    }

    // Other Sections
    [
      "Professional Summary (Objective)",
      "Technical & Soft Skills",
      "Work Experience",
      "Projects",
      "Education",
      "Certifications & Training",
      "Awards & Recognitions",
      "Publications"
    ].forEach((section) => {
      if (data[section]) {
        y = addSection(doc, section, data[section], y);
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
      }
    });

    return doc;
  },

  modern: (doc, data) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Generated Resume", 20, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    let y = 30;
    const pageHeight = doc.internal.pageSize.height;

    // Personal Information
    if (data["Personal Information"]) {
      doc.setFont("helvetica", "bold");
      doc.text(data["Personal Information"]["Full Name"], 20, y);
      y += 6;
      doc.setFontSize(12);
      doc.text(`Email: ${data["Personal Information"]["Email"]}`, 20, y);
      y += 6;
      doc.text(`Phone: ${data["Personal Information"]["Phone"]}`, 20, y);
      y += 6;
      doc.line(20, y, 190, y); // Divider Line
      y += 6;
      doc.text(`LinkedIn: ${data["Personal Information"]["LinkedIn Profile"] || "N/A"}`, 20, y);
      y += 6;
      doc.text(`GitHub: ${data["Personal Information"]["GitHub Profile"] || "N/A"}`, 20, y);
      y += 6;
      doc.text(`Portfolio: ${data["Personal Information"]["Portfolio Website"] || "N/A"}`, 20, y);
      y += 6;
      doc.text(`Location: ${data["Personal Information"]["Location"] || "N/A"}`, 20, y);
      y += 10;
    }

    // Other Sections
    [
      "Professional Summary (Objective)",
      "Technical & Soft Skills",
      "Work Experience",
      "Projects",
      "Education",
      "Certifications & Training",
      "Awards & Recognitions",
      "Publications"
    ].forEach((section) => {
      if (data[section]) {
        y = addSection(doc, section, data[section], y);
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
      }
    });

    return doc;
  },
};
