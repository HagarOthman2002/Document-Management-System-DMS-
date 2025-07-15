import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !owner || !workspaceId) {
      alert("Please fill all fields and choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("workSpaceId", workspaceId); // Match the field in your schema
    formData.append("owner", owner);

    try {
      const res = await axiosInstance.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success:", res.data);
      alert("Document uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    }
  };

  return (
    <div className="upload-page" style={{ padding: "20px" }}>
      <h2>Upload Document</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Choose File:</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div>
          <label>Owner ID:</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Enter owner ID"
          />
        </div>
        <div>
          <label>Workspace ID:</label>
          <input
            type="text"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            placeholder="Enter workspace ID"
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadDocument;
