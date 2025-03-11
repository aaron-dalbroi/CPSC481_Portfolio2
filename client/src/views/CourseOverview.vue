<template>
	<v-container
		class="fill-height d-flex justify-center align-center"
		style="width: 100vw; height: 100vh; padding: 0"
	>
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
		const courseId = this.$route.params.courseId;
		try {
			const response = await axios.get(
				`http://localhost:3000/api/courses/${courseId}`
			);
			this.course = response.data;

			// Load all courses from the API or from local data
			const allCoursesResponse = await axios.get(
				"http://localhost:3000/api/courses"
			); // Adjust this API endpoint if necessary
			this.courseData = allCoursesResponse.data;

			this.setTreeData();
		} catch (error) {
			console.error("Error fetching course:", error);
		}
	},
	methods: {
		setTreeData() {
			const prerequisites = this.course.prerequisites || [];
			this.treeData = {
				id: this.course.id,
				name: this.course.name,
				children: this.buildPrerequisiteTree(prerequisites), // Build the tree synchronously
			};
		},

		// Recursive function to build the tree for prerequisites
		buildPrerequisiteTree(prerequisiteIds) {
			const tree = [];

			for (const prereqId of prerequisiteIds) {
				// Fetch course data for the current prerequisite
				const prereqCourse = this.fetchCourseById(prereqId);
				if (prereqCourse) {
					const courseNode = {
						id: prereqCourse.id,
						name: prereqCourse.name,
						children: [], // Initialize with an empty array for child prerequisites
					};

					// Recursively fetch prerequisites for this course (if any)
					if (
						prereqCourse.prerequisites &&
						prereqCourse.prerequisites.length > 0
					) {
						courseNode.children = this.buildPrerequisiteTree(
							prereqCourse.prerequisites
						);
					}

					tree.push(courseNode);
				}
			}

			return tree;
		},

		// Function to fetch course by its ID from the loaded courses
		fetchCourseById(courseId) {
			return this.courseData.find((course) => course.id === courseId); // This should work if courseData is correctly loaded
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
