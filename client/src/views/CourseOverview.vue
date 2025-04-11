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

			<v-toolbar-title class="ml-2"> Course Prerequisites </v-toolbar-title>
		</v-app-bar>
		<v-row>
			<!-- Left half of page -->
			<v-col cols="7" class="scrollable-column">
				<v-card
					class="pa-5"
					style="
						width: 100%;
						height: 95vh;
						max-width: none;
						display: flex;
						flex-direction: column;
						align-items: center;
					"
				>
					<v-card-title class="text-h5 text-center">{{
						course.name
					}}</v-card-title>
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
									@click="handleNodeClick(node.id)"
									style="cursor: pointer"
								>
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
			</v-col>

			<!-- Right half of page -->
			<v-col cols="5">
				<!-- Offered In -->
				<v-card v-if="course.semesterAvailability" class="mb-4">
					<v-card-title>Offered in:</v-card-title>
					<v-card-text>
						<v-chip
							v-for="(semester, index) in course.semesterAvailability"
							:key="index"
							class="ma-1"
							color="primary"
							text-color="white"
							small
						>
							{{ semester }}
						</v-chip>
					</v-card-text>
				</v-card>
				<!-- Syllabus -->
				<v-card v-if="course.syllabus">
					<v-card-title>Course Syllabus</v-card-title>
					<v-card-text class="scrollable-syllabus-content">
						<!-- Course Information -->
						<v-card-title class="text-h6">COURSE INFORMATION</v-card-title>

						<!-- Sections -->
						<v-card-title class="text-h6">Sections</v-card-title>
						<v-list>
							<v-list-item
								v-for="(section, index) in course.syllabus.courseInformation
									.sections"
								:key="index"
							>
								<v-list-item-title class="text-body-1">{{
									section.section
								}}</v-list-item-title>
								<v-list-item-subtitle class="text-body-1">
									{{ section.time }} | Professor: {{ section.professor }}
								</v-list-item-subtitle>
							</v-list-item>
						</v-list>

						<!-- Course Materials -->
						<v-card-title class="text-h6">Course Materials</v-card-title>
						<v-list>
							<v-list-item>
								<v-list-item-title class="text-body-1"
									>Required Textbooks:</v-list-item-title
								>
								<v-list-item-subtitle class="text-body-1">
									{{
										course.syllabus.courseInformation.courseMaterials.requiredTextbooks.join(
											", "
										)
									}}
								</v-list-item-subtitle>
							</v-list-item>
							<v-list-item>
								<v-list-item-title class="text-body-1"
									>Recommended Textbooks:</v-list-item-title
								>
								<v-list-item-subtitle class="text-body-1">
									{{
										course.syllabus.courseInformation.courseMaterials.recommendedTextbooks.join(
											", "
										)
									}}
								</v-list-item-subtitle>
							</v-list-item>
							<v-list-item>
								<v-list-item-title class="text-body-1"
									>Technologies:</v-list-item-title
								>
								<v-list-item-subtitle class="text-body-1">
									{{
										course.syllabus.courseInformation.courseMaterials.technologies.join(
											", "
										)
									}}
								</v-list-item-subtitle>
							</v-list-item>
						</v-list>

						<!-- Course Learning Outcomes -->
						<v-card-title class="text-h6"
							>Course Learning Outcomes:</v-card-title
						>
						<v-list>
							<v-list-item
								v-for="(outcome, index) in course.syllabus.courseInformation
									.courseLearningOutcomes"
								:key="index"
							>
								<v-list-item-title class="text-body-1">{{
									outcome
								}}</v-list-item-title>
							</v-list-item>
						</v-list>

						<!-- Assessment & Evaluation Information -->
						<v-card-title class="text-h6">ASSESSMENT & EVALUATION</v-card-title>

						<!-- Assessment Components -->
						<v-card-title class="text-h6">Assessment Components</v-card-title>
						<v-list>
							<v-list-item
								v-for="(component, index) in course.syllabus
									.assessmentEvaluationInformation.assessmentComponents"
								:key="index"
							>
								<v-list-item-title class="text-body-1">{{
									component.component
								}}</v-list-item-title>
								<v-list-item-subtitle class="text-body-1">
									Weight: {{ component.weight }}
									<div v-if="component.dueDates" class="text-body-1">
										Due Dates: {{ component.dueDates.join(", ") }}
									</div>
									<div v-if="component.date" class="text-body-1">
										Date: {{ component.date }}
									</div>
								</v-list-item-subtitle>
							</v-list-item>
						</v-list>

						<!-- Missed Components Policy -->
						<v-card-title class="text-h6"
							>Missed Components Policy</v-card-title
						>
						<v-card-text class="text-body-1">{{
							course.syllabus.assessmentEvaluationInformation
								.missedComponentsPolicy
						}}</v-card-text>

						<!-- Letter Grade Conversion -->
						<v-card-title class="text-h6">Letter Grade Conversion</v-card-title>
						<v-list>
							<v-list-item
								v-for="(grade, letter) in course.syllabus
									.assessmentEvaluationInformation.letterGradeConversion"
								:key="letter"
							>
								<v-list-item-title class="text-body-1"
									>{{ letter }}: {{ grade }}</v-list-item-title
								>
							</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>

				<!-- Ratings -->
				<v-card class="scrollable-ratings">
					<v-card-title>Course Rating and Reviews</v-card-title>
					<v-card-text>
						<!-- Course Rating Display -->
						<div class="text-center">
							<v-rating v-model="course.rating" readonly></v-rating>
						</div>

						<v-divider class="my-4"></v-divider>

						<!-- Reviews List -->
						<v-list>
							<v-list-item
								v-for="(review, index) in course.reviews"
								:key="index"
								ripple
							>
								<template v-slot:prepend>
									<v-icon>mdi-account-outline</v-icon>
								</template>

								<template v-slot:title>
									<v-rating
										v-model="review.rating"
										readonly
										density="compact"
										size="small"
									></v-rating>
								</template>

								<template v-slot:subtitle>
									<div v-html="review.comment"></div>
								</template>
							</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
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
			const courseId = "STAT300"; // set default to STAT300
			//const courseId = this.$route.params.courseId;
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
		// USE THIS IF WANT TO USE SERVER
		// async handleNodeClick(courseId) {
		// 	try {
		// 		const response = await axios.get(`/api/courses/${courseId}`);
		// 		this.course = response.data;
		// 	} catch (error) {
		// 		console.error("Failed to load course data for:", courseId, error);
		// 		this.addWarning?.(`Failed to load course info for ${courseId}`);
		// 	}
		// },
		async handleNodeClick(courseId) {
			try {
				const courseId = "CPSC100";
				const response = await axios.get(
					`http://localhost:3000/api/courses/${courseId}`
				);
				this.course = response.data;
			} catch (error) {
				console.error("Failed to load course data for:", courseId, error);
				this.addWarning?.(`Failed to load course info for ${courseId}`);
			}
		},
	},
};
</script>

<style>
.scrollable-column {
	overflow-y: auto;
}

.scrollable-ratings {
	/*dont know if we need this yet*
	height: 50vh; /* Set the syllabus height to be half of the left column */
	overflow-y: auto; /* Make the syllabus content scrollable */
}

.scrollable-syllabus-content {
	max-height: 50vh;
	overflow-y: auto;
}

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

.rich-media-node:hover {
	background-color: #f0f0f0;
	transition: background-color 0.2s ease;
}
</style>
