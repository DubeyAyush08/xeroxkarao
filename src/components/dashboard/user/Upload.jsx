import React, { useState, useEffect } from "react";

const Upload = () => {
    const [pageCounts, setPageCounts] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [colorMode, setColorMode] = useState("black-and-white");
    const [copies, setCopies] = useState(1);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js";
        script.async = true;
        script.onload = () => console.log("PDF.js loaded");
        document.body.appendChild(script);
    }, []);

    const handleFileUpload = async (files) => {
        const counts = [];

        for (const file of files) {
            if (!file) continue;

            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const typedArray = new Uint8Array(reader.result);

                    if (file.type === "application/pdf") {
                        if (window.pdfjsLib) {
                            const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
                            counts.push({ name: file.name, pages: pdf.numPages, colorMode, copies });
                        } else {
                            console.error("PDF.js not loaded yet");
                            counts.push({ name: file.name, pages: "Error loading PDF.js", colorMode, copies });
                        }
                    } else if (file.type.startsWith("image/")) {
                        counts.push({ name: file.name, pages: 1, colorMode, copies });
                    } else {
                        counts.push({ name: file.name, pages: "Unsupported file type", colorMode, copies });
                    }
                } catch (error) {
                    console.error("Error reading file:", error);
                    counts.push({ name: file.name, pages: "Error reading file", colorMode, copies });
                }
                setPageCounts(prevCounts => {
                    const newCounts = [...prevCounts, ...counts];
                    const uniqueCounts = newCounts.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
                    calculateTotalPages(uniqueCounts);
                    return uniqueCounts;
                });
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const files = event.dataTransfer.files;
        handleFileUpload(files);
    };

    const handleInputChange = (event) => {
        const files = event.target.files;
        handleFileUpload(files);
    };

    const calculateTotalPages = (counts) => {
        const total = counts.reduce((sum, file) => {
            const rate = file.colorMode === "color" ? 5 : 2;
            return sum + (typeof file.pages === "number" ? file.pages * file.copies * rate : 0);
        }, 0);
        setTotalPages(total);
    };

    const handleDelete = (fileName) => {
        setPageCounts(prevCounts => {
            const newCounts = prevCounts.filter(file => file.name !== fileName);
            calculateTotalPages(newCounts);
            return newCounts;
        });
    };

    return (
        <div 
            style={{ textAlign: "center", marginTop: "20px" }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h2 style={{ color: "#333", marginBottom: "20px" }}>Upload Files to Count Pages</h2>
            <input 
                type="file" 
                accept="application/pdf,image/*" 
                onChange={handleInputChange} 
                multiple 
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <div 
                style={{
                    border: dragging ? "2px dashed #000" : "2px dashed #ccc",
                    padding: "20px",
                    borderRadius: "5px",
                    marginTop: "20px",
                    backgroundColor: dragging ? "#f0f0f0" : "#fff"
                }}
            >
                {dragging ? "Drop files here..." : "Or drag and drop files here"}
            </div>
            <div style={{ marginTop: "20px" }}>
                <label>
                    Color Mode:
                    <select value={colorMode} onChange={(e) => setColorMode(e.target.value)} style={{ marginLeft: "10px" }}>
                        <option value="black-and-white">Black and White</option>
                        <option value="color">Color</option>
                    </select>
                </label>
                <label style={{ marginLeft: "20px" }}>
                    Copies:
                    <input 
                        type="number" 
                        value={copies} 
                        onChange={(e) => setCopies(Number(e.target.value))} 
                        min="1" 
                        style={{ marginLeft: "10px", width: "50px" }}
                    />
                </label>
            </div>
            {pageCounts.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    {pageCounts.map((file, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <p style={{ fontSize: "16px", color: "#555" }}>
                                📄 {file.name}: Number of Pages: {file.pages}, Color Mode: {file.colorMode}, Copies: {file.copies}
                            </p>
                            <button 
                                style={{ padding: "5px 10px", fontSize: "14px", borderRadius: "5px", backgroundColor: "#f44336", color: "#fff", border: "none", cursor: "pointer" }}
                                onClick={() => handleDelete(file.name)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {totalPages > 0 && (
                <button 
                    style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px", borderRadius: "5px", backgroundColor: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" }}
                    onClick={() => alert(`Total Amount: ₹${totalPages}`)}
                >
                    Pay ₹{totalPages}
                </button>
            )}
        </div>
    );
};

export default Upload;
