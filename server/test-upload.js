const express = require("express");
const fs = require("fs");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const multer = require("multer");

// ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"));
}

const app = express();
app.use((req, res, next) => {
    req.isAuthenticated = () => true;
    req.user = { role: "instructor" };
    next();
});

app.use("/api/upload", uploadRoutes);

const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);

    // Create a dummy image file
    const testImagePath = path.join(__dirname, "dummy.jpg");
    fs.writeFileSync(testImagePath, "dummy image content");

    try {
        const FormData = require("form-data");
        const form = new FormData();
        form.append("image", fs.createReadStream(testImagePath));
        // MUST PROVIDE A COURSE ID FOR UPDATE
        form.append("courseId", "9999"); 

        const fetch = require("node-fetch");
        const response = await fetch(`http://localhost:${port}/api/upload`, {
            method: "POST",
            body: form,
            headers: form.getHeaders()
        });

        const data = await response.json();
        console.log("Upload Status:", response.status);
        console.log("Upload Response:", data);
        
    } catch (e) {
        console.error("Test error:", e);
    } finally {
        fs.unlinkSync(testImagePath);
        server.close();
        process.exit(0);
    }
});
