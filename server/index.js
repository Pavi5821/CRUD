const express = require("express");
const cors = require("cors");
const users = require("./sample.json");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(cors({
    origin: "*",   // IMPORTANT for deployment
    methods: ["GET", "POST", "PATCH", "DELETE"]
}));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Display All Users
app.get("/users", (req, res) => {
    return res.json(users);
});

// Delete User
app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);

    let filteredUsers = users.filter(user => user.id !== id);

    fs.writeFile("./sample.json", JSON.stringify(filteredUsers, null, 2), () => {
        return res.json(filteredUsers);
    });
});

// Add User
app.post("/users", (req, res) => {
    let { name, age, city } = req.body;

    if (!name || !age || !city) {
        return res.status(400).send({ message: "All Fields Required" });
    }

    let id = Date.now();
    users.push({ id, name, age, city });

    fs.writeFile("./sample.json", JSON.stringify(users, null, 2), () => {
        return res.json({ message: "User added successfully" });
    });
});

// Update User
app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;

    if (!name || !age || !city) {
        return res.status(400).send({ message: "All Fields Required" });
    }

    let index = users.findIndex(user => user.id == id);

    if (index === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    users.splice(index, 1, { id, name, age, city });

    fs.writeFile("./sample.json", JSON.stringify(users, null, 2), () => {
        return res.json({ message: "User updated successfully" });
    });
});

// ✅ ONLY ONE LISTENER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
