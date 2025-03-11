const express = require("express");
const fs = require("fs");

const router = express.Router();
const DATA_FILE = "./data.json";

// Load JSON data
const loadData = () => {
	const rawData = fs.readFileSync(DATA_FILE);
	return JSON.parse(rawData);
};

// Save JSON data
const saveData = (data) => {
	fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all users
router.get("/users", (req, res) => {
	const data = loadData();
	res.json(data.users);
});

// Get a single user by ID
router.get("/users/:id", (req, res) => {
	const data = loadData();
	const userId = parseInt(req.params.id);
	const user = data.users.find((u) => u.id === userId);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	res.json(user);
});

// Add a new user
router.post("/users", (req, res) => {
	const data = loadData();
	const newUser = req.body;
	newUser.id = data.users.length + 1;
	data.users.push(newUser);
	saveData(data);
	res.status(201).json(newUser);
});

// Get all courses
router.get("/courses", (req, res) => {
	const data = loadData();
	res.json(data.courses);
});

// Get a single course by ID
router.get("/courses/:id", (req, res) => {
	const data = loadData();
	const courseId = req.params.id;
	const course = data.courses.find((c) => c.id === courseId);

	if (!course) {
		return res.status(404).json({ message: "Course not found" });
	}

	res.json(course);
});

// Add a new course
router.post("/courses", (req, res) => {
	const data = loadData();
	const newCourse = req.body;
	data.courses.push(newCourse);
	saveData(data);
	res.status(201).json(newCourse);
});

// Update user's starred courses
router.put("/users/:id/starred", (req, res) => {
	const data = loadData();
	const userId = parseInt(req.params.id);
	const { courseId } = req.body; // Course ID to add/remove

	const user = data.users.find((u) => u.id === userId);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	// Toggle starred course (add if not present, remove if already present)
	const courseIndex = user.starredCourses.indexOf(courseId);
	if (courseIndex === -1) {
		user.starredCourses.push(courseId);
	} else {
		user.starredCourses.splice(courseIndex, 1);
	}

	saveData(data);
	res.json({
		message: "Starred courses updated",
		starredCourses: user.starredCourses,
	});
});

module.exports = router;
