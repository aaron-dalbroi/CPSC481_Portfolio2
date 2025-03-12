<template>
	<v-container
		class="fill-height d-flex justify-center align-center"
		style="width: 100vw; height: 100vh; padding: 0"
	>

	<v-app-bar color="red-darken-4" app>
			<v-btn icon @click="$router.go(-1)">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
			<v-img
				class="mx-2"
				src="../assets/U_Calgary_Logo.png"
				max-height="40"
				max-width="40"
				contain
			></v-img>

			<v-toolbar-title class="ml-2">
				Course Prerequisites
			</v-toolbar-title>

		</v-app-bar>
		<v-card
			class="pa-5"
			style="
				width: 100%; /* Allow the card to expand fully */
				height: 95vh; /* Keep the height constraint */
				max-width: none; /* Remove the max-width restriction */
				display: flex;
				flex-direction: column;
				align-items: center;
			"
		>
			<v-card-title class="text-h5 text-center">{{ course.name }}</v-card-title>
			<v-card-subtitle class="text-center">{{
				course.description
			}}</v-card-subtitle>
			<v-card-text
				class="d-flex justify-center"
				style="flex-grow: 1; width: 100%"
			>
				<vue-tree
					class="vue-tree-container"
					:dataset="treeData"
					:config="treeConfig"
					linkStyle="straight"
				>
					<template v-slot:node="{ node, collapsed }">
						<div
							class="rich-media-node"
							:style="{ border: collapsed ? '2px solid grey' : '' }"
						>
							<!-- Star icon in the top right corner -->
							<!--<v-icon class="star-icon">mdi-star</v-icon>-->

							<span class="node-id">{{ node.id }}</span>
							<span class="node-name">{{ node.name }}</span>
							<v-icon
								class="status-icon"
								:icon="getCompletionIcon(node.id)"
							></v-icon>
						</div>
					</template>
				</vue-tree>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
import axios from "axios";
import VueTree from "@ssthouse/vue3-tree-chart";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";

export default {
	name: "CourseOverview",
	components: {
		VueTree,
	},
	data() {
		return {
			course: {},
			treeData: {},
			userData: null, // Stores user data
			treeConfig: {
				nodeWidth: 120,
				nodeHeight: 80,
				levelHeight: 150, // Ensures proper spacing between nodes
				draggable: false, // Disables dragging
				translateX: 0, // No horizontal shift
				translateY: 100, // Moves the tree down for proper alignment
			},
		};
	},
	async created() {
		try {
			const courseId = this.$route.params.courseId;
			const response = await axios.get(
				`http://localhost:3000/api/courses/${courseId}`
			);
			this.course = response.data;

			const allCoursesResponse = await axios.get(
				"http://localhost:3000/api/courses"
			);
			this.courseData = allCoursesResponse.data;

			const userResponse = await axios.get("http://localhost:3000/api/users/1"); // Adjust user ID as needed
			this.userData = userResponse.data;

			this.setTreeData();
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	},
	methods: {
		setTreeData() {
			const prerequisites = this.course.prerequisites || [];
			this.treeData = {
				id: this.course.id,
				name: this.course.name,
				icon: this.getCompletionIcon(this.course.id), // Add status icon
				children: this.buildPrerequisiteTree(prerequisites),
			};
		},

		// Recursive function to build the tree for prerequisites
		buildPrerequisiteTree(prerequisiteIds) {
			const tree = [];

			for (const prereqId of prerequisiteIds) {
				const prereqCourse = this.fetchCourseById(prereqId);
				if (prereqCourse) {
					const courseNode = {
						id: prereqCourse.id,
						name: prereqCourse.name,
						icon: this.getCompletionIcon(prereqCourse.id), // Add icon here
						children: prereqCourse.prerequisites?.length
							? this.buildPrerequisiteTree(prereqCourse.prerequisites)
							: [],
					};
					tree.push(courseNode);
				}
			}

			return tree;
		},

		// Function to fetch course by its ID from the loaded courses
		fetchCourseById(courseId) {
			return this.courseData.find((course) => course.id === courseId);
		},

		// Determines the correct icon based on course completion status
		getCompletionIcon(courseId) {
			if (!this.userData) return "";

			// Check if the course is in currentCourses
			const currentCourse = this.userData.currentCourses.find(
				(c) => c.course === courseId
			);
			if (currentCourse) return "mdi-progress-check"; // In Progress

			// Check if the course is in pastCourses
			const pastCourse = this.userData.pastCourses.find(
				(c) => c.course === courseId
			);
			if (pastCourse) {
				return pastCourse.completionStatus === "Completed"
					? "mdi-checkbox-marked-circle" // Completed
					: "mdi-cancel"; // Incomplete
			}

			return "";
		},
	},
};
</script>

<style>
.vue-tree-container {
	display: flex;
	justify-content: center; /* Center horizontally */
	align-items: center; /* Center vertically */
	width: 100%;
}
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.status-icon {
	position: absolute;
	top: 5px;
	right: 5px;
	color: #555;
}

.star-icon {
	position: absolute;
	top: 5px;
	right: 5px;
	color: rgb(255, 255, 255); /* Make it stand out */
	font-size: 18px;
}
.rich-media-node {
	position: relative; /* Required for absolute positioning */
	min-width: 120px;
	max-width: 200px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: rgb(32, 32, 32);
	background-color: #c7d4d8;
	border-radius: 4px;
	word-wrap: break-word;
	text-align: center;
}
.node-id {
	font-weight: bold;
	font-size: 14px;
	color: #333;
}

.node-name {
	font-size: 12px;
}
</style>
