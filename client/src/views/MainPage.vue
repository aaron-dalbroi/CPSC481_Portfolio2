<template>
	<v-container fluid>
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

			<v-toolbar-title class="ml-2"> Degree Navigator </v-toolbar-title>

			<v-spacer></v-spacer>

			<!-- Help Button -->
			<v-btn icon @click="helpDialog = true">
				<v-icon color="white">mdi-help-circle-outline</v-icon>
			</v-btn>

			<!-- Help Dialog -->

			<v-dialog v-model="helpDialog" max-width="500">
				<v-card>
					<v-card-title class="headline">Need Help?</v-card-title>

					<v-card-text>
						<h3 class="mb-3">For first time Users</h3>

						<v-expansion-panels>
							<v-expansion-panel>
								<v-expansion-panel-title
									>My Schedule is Empty!</v-expansion-panel-title
								>
								<v-expansion-panel-text>
									Don't panic! We've made you a template to get you started.
									Click on the "Load Template" button to load a pre-defined
									schedule.
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-card-text>

					<v-card-text>
						<h3 class="mb-3">How do I...</h3>

						<v-expansion-panels>
							<v-expansion-panel
								v-for="(content, title) in helpContent"
								:key="title"
							>
								<v-expansion-panel-title>{{ title }}</v-expansion-panel-title>
								<v-expansion-panel-text>
									{{ content }}
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="red-darken-4" text @click="helpDialog = false"
							>Close</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-app-bar>

		<v-row>
			<!-- Left half of page (Timeline View) -->
			<v-col cols="7" class="scrollable-column">
				<v-card>
					<v-card-title>Your Dashboard</v-card-title>
					<v-card-text>
						<v-list>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>{{ user.displayName }}</v-list-item-title>
									<v-list-item-subtitle>
										{{ user.programName }} - Year {{ user.yearOfProgram }}
									</v-list-item-subtitle>
									<div>
										<v-btn @click="addSemester">Show New Semester</v-btn>
										<v-btn @click="removeSemester">Hide Newest Semester</v-btn>
										<v-btn @click="loadTemplateDialog = true"
											>Load Template</v-btn
										>
										<v-btn @click="saveTemplate">Save Template</v-btn>

										<!-- Load Template Dialog -->
										<v-dialog v-model="loadTemplateDialog" max-width="400">
											<v-card>
												<v-card-title class="headline"
													>Load Template</v-card-title
												>
												<v-card-text>
													<v-select
														v-model="selectedTemplate"
														:items="savedTemplates"
														label="Select a template"
													></v-select>
												</v-card-text>

												<v-card-actions>
													<v-spacer></v-spacer>
													<v-btn
														text
														color="red-darken-4"
														@click="loadTemplate(selectedTemplate)"
														>Load</v-btn
													>
													<v-btn text @click="loadTemplateDialog = false"
														>Cancel</v-btn
													>
												</v-card-actions>
											</v-card>
										</v-dialog>
									</div>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>

				<!-- Timeline Section -->
				<v-timeline align="start" reverse side="end">
					<v-timeline-item
						v-for="(courses, semester) in timelineState
							.slice(0, numSemestersToRender)
							.reverse()"
						:key="semester"
						dot-color="teal"
						size="large"
					>
						<template v-slot:icon>
							<v-avatar
  								:class="{ 'big-btn': numSemestersToRender - semester - 1 === 5, 
										'strikethrough': numSemestersToRender - semester - 1 === 5 }" 
								:color="getSemesterIconColor(numSemestersToRender - semester - 1)"
							>
								<!-- Shrink circle on collapse -->
							</v-avatar>
						</template>

						<!-- The semester name on the left hand side -->
						<template v-slot:opposite>
							<v-btn
								class="semester-btn"
								@click="toggleCollapse(numSemestersToRender - semester - 1)"
							>
								{{ getSemesterName(numSemestersToRender - semester - 1) }}
							</v-btn>
						</template>

						<v-card
							class="drop-zone"
							v-if="!collapsed[numSemestersToRender - semester - 1]"
							@drop="onDrop($event, numSemestersToRender - semester - 1)"
							@dragenter.prevent
							@dragover.prevent
						>
							<v-card-title class="text-h5"></v-card-title>
							<v-card-text>
								<v-slide-group multiple class="d-flex">
									<v-slide-item
										v-for="course in courses"
										:key="course.course"
										@dragstart="startDrag($event, course.course)"
									>
										<!-- Make each course a button -->
										<v-btn
											:to="{
												name: 'course-overview',
												params: { courseId: course.course },
											}"
											block
											class="course-btn"
											:class="{ 'gray-btn': (numSemestersToRender-semester-1) < 6 }"

										>
											<!-- Course Title and Icon centered -->
											<div class="d-flex justify-center align-center">
												<span class="course-name">{{ course.course }}</span>
												<v-icon
													class="course-icon"
													:color="
														course.completionStatus === 'Completed'
															? 'green'
															: course.completionStatus === 'In Progress'
															? 'yellow'
															: 'red'
													"
												>
													{{
														course.completionStatus === "Completed"
															? "mdi-checkbox-marked-circle"
															: course.completionStatus === "In Progress"
															? "mdi-border-color"
															: "mdi-cancel"
													}}
												</v-icon>
											</div>
											<!-- Status on the top-right -->
											<v-card-subtitle class="status">{{
												course.completionStatus
											}}</v-card-subtitle>
										</v-btn>
									</v-slide-item>
								</v-slide-group>
							</v-card-text>
						</v-card>
					</v-timeline-item>
				</v-timeline>
			</v-col>
			<!-- Right half of page (Everything Else) -->
			<v-col cols="5" class="scrollable-column">
				<!-- Warning Box -->
				<v-card>
					<v-card-title>Action Required</v-card-title>
					<v-card-text>
						<v-textarea
							v-model="warningLogs"
							auto-grow
							readonly
							variant="outlined"
							class="warning-text"
						></v-textarea>
					</v-card-text>
				</v-card>

				<!-- Search Bar -->
				<v-text-field
					v-model="searchQuery"
					label="Search for courses"
					solo
					clearable
					class="search-bar"
				></v-text-field>

				<!-- Search Results -->
				<v-list>
					<v-list-item
						v-for="item in filteredCourses"
						:key="item.id"
						draggable="true"
						@dragstart="startDrag($event, item.id)"
						ripple
					>
						<template v-slot:prepend>
							<v-icon>mdi-book-open-page-variant</v-icon>
						</template>

						<template v-slot:title>
							<div v-html="item.id + ' - ' + item.name"></div>
						</template>

						<template v-slot:subtitle>
							<div
								v-html="item.description || 'No description available'"
							></div>
						</template>
					</v-list-item>
				</v-list>

				<!-- Requirements Report -->
				<v-card>
					<v-card-title>
						Requirements Report
						<v-sheet class="d-flex align-center">
							<!-- Progress Bar -->
							<v-progress-linear
								:location="null"
								bg-color="error"
								buffer-color="warning"
								buffer-opacity="0.5"
								buffer-value="85"
								color="success"
								height="15"
								model-value="72"
								rounded
							></v-progress-linear>
							<div class="ms-4">48 / 66</div>
						</v-sheet>
					</v-card-title>
				</v-card>

				<!-- Dropdown Table -->
				<v-expansion-panels variant="accordion" multiple="true">
					<v-expansion-panel expand-icon="" readonly="true">
						<v-expansion-panel-title>
							<v-row>
								<v-col class="d-flex justify-left align-center"> Status </v-col>
								<v-col class="d-flex justify-end align-center">
									Total Credits
								</v-col>
							</v-row>
						</v-expansion-panel-title>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-title>
							<v-row>
								<v-col class="d-flex justify-left">
									<v-chip color="success" label> Completed </v-chip>
								</v-col>
								<v-col class="d-flex justify-end align-center"> 48 / 66 </v-col>
							</v-row>
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<v-table>
								<thead>
									<tr>
										<th>Prerequisite(s)</th>
										<th>Course</th>
										<th>Grade</th>
										<th>Credits</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<v-icon color="green"> mdi-check-circle </v-icon>
										</td>
										<td>CS 251</td>
										<td>B+</td>
										<td>3</td>
										<td><v-chip color="green">Completed</v-chip></td>
									</tr>
									<tr>
										<td>
											<v-icon color="green"> mdi-check-circle </v-icon>
										</td>
										<td>CS 255</td>
										<td>B+</td>
										<td>3</td>
										<td><v-chip color="green">Completed</v-chip></td>
									</tr>
								</tbody>
							</v-table>
						</v-expansion-panel-text>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-title>
							<v-row>
								<v-col class="d-flex justify-left">
									<v-chip color="warning" label> In Progress </v-chip>
								</v-col>
								<v-col class="d-flex justify-end align-center"> 9 / 66 </v-col>
							</v-row>
						</v-expansion-panel-title>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-title>
							<v-row>
								<v-col class="d-flex justify-left">
									<v-chip color="error" label> Incomplete </v-chip>
								</v-col>
								<v-col class="d-flex justify-end align-center"> 9 / 66 </v-col>
							</v-row>
						</v-expansion-panel-title>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import axios from "axios";
import {ref, onMounted,computed} from "vue";
import demoTemplateData from '@/data/demo-template.json'
import { load } from "webfontloader";

export default {
	name: "MainPage",
	data() {
		return {
			user: {},
			warningLogs: "",
			searchQuery: "",
			allCourses: [], // will load from backend
			helpDialog: false,
			helpContent: {
				"Navigate between semesters":
					"Use the left and right arrows to switch between semesters.",
				"Add a course to my timeline":
					"Click on a course to add it to your timeline.",
				"Check prerequisites for a course":
					"Hover over a course to see its prerequisites.",
				"Remove a course from my timeline":
					"Click on a course in your timeline to remove it.",
			},

			selectedTemplate: null,
			savedTemplates: ["Starter Template"], // Hardcoded template
		};
	},

	setup() {
		// The semesters are hard-coded, heres the names for each array index in timelineState
		const semesterNames = [
			"Fall 2024",
			"Winter 2025",
			"Spring 2025",
			"Summer 2025",
			"Fall 2025",
			"Winter 2026",
			"Spring 2026",
			"Summer 2026",
			"Fall 2026",
			"Winter 2027",
			"Spring 2027",
			"Summer 2027",
			"Fall 2027",
			"Winter 2028",
			"Spring 2028",
			"Summer 2028",
			"Fall 2028",
			"Winter 2029",
			"Spring 2029",
			"Summer 2029",
			"Fall 2029",
			"Winter 2030",
			"Spring 2030",
			"Summer 2030",
			"Fall 2030",
			"Winter 2031",
			"Spring 2031",
			"Summer 2031",
			"Fall 2031",
			"Winter 2032",
			"Spring 2032",
			"Summer 2032",
		];

		// Create a ref to hold the timelineState array
		const timelineState = ref(
			Array(
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[]
			)
		); // Hard-coded for 32 semesters (8yrs)
		const user = ref({});

		// Track whether a semester is collapsed or not
		const collapsed = ref(Array(32).fill(false));
		const loadTemplateDialog = ref(false);

		let numSemestersToRender = ref(
			parseInt(localStorage.getItem("numSemestersToRender")) || 6
		);

		// Method to initialize timelineState with 32 sub-arrays
		const initializeTimelineState = () => {
			timelineState.value = Array.from({ length: 32 }, () => []);

			// These values are the ones that should always be in the timeline, and shouldn't be changed.
			// Fall 2o24
			timelineState.value[0].push({	"course": "CPSC231",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[0].push({	"course": "MATH249",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[0].push({	"course": "PHIL279",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[0].push({	"course": "CPSC277",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[0].push({	"course": "CPSC225",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			
			// Winter 2025
			timelineState.value[1].push({
				course: "CPSC233",
				semester: "Fall 2024",
				completionStatus: "Completed",
			});
			timelineState.value[1].push({
				course: "CPSC251",
				semester: "Fall 2024",
				completionStatus: "Completed",
			});
			timelineState.value[1].push({
				course: "MATH211",
				semester: "Fall 2024",
				completionStatus: "Completed",
			});
			timelineState.value[1].push({
				course: "CPSC180",
				semester: "Fall 2024",
				completionStatus: "Completed",
			});
			timelineState.value[1].push({
				course: "CPSC190",
				semester: "Fall 2024",
				completionStatus: "Completed",
			});

			// Fall 2025
			timelineState.value[4].push({	"course": "CPSC338",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
			timelineState.value[4].push({	"course": "CPSC353",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
			timelineState.value[4].push({	"course": "ART130",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
			timelineState.value[4].push({	"course": "MATH375",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
			timelineState.value[4].push({	"course": "CPSC319",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
						
			// Winter 2026
			timelineState.value[5].push({	"course": "CPSC340",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
			timelineState.value[5].push({	"course": "CPSC389",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
			timelineState.value[5].push({	"course": "ECON201",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
			timelineState.value[5].push({	"course": "STATS251",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});
			timelineState.value[5].push({	"course": "CPSC371",
											"semester": "Fall 2025",
											"completionStatus": "In Progress"});	
		};										

		// Method to fetch user data
		const fetchUserData = async () => {
			try {
				const response = await axios.get("http://localhost:3000/api/users");
				user.value = response.data.find((u) => u.id === 1) || {};
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		// Fetch user data when the component is mounted
		onMounted(() => {
			fetchUserData();
		});
		// Call the method to initialize the state
		initializeTimelineState();

		console.log(timelineState.value);

		const startDrag = (event, item) => {
			console.log("start drag", item);
			event.dataTransfer.dropEffect = "move";
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData("course_code", item);
		};

		const onDrop = (event, semesterIndex) => {
			const course_code = event.dataTransfer.getData("course_code");
			console.log(
				"Course Being Dropped:",
				course_code,
				"into semester",
				semesterIndex
			);

			if (!course_code) return;

			let movedCourse = null;
			
			// This handles the case where we are moving a course already in the timeline.

			// Search for the course and remove it from its original semester
			for (let i = 0; i < timelineState.value.length; i++) {
				const semester = timelineState.value[i];
				const courseIndex = semester.findIndex(
					(course) => course.course === course_code
				);
				if (courseIndex !== -1) {

					// These semesters hold completed and enrolled courses. We dont want to move those.
					if(i == 0 || i == 1 || i == 4 || i == 5){
						alert("Cannot Move Completed or Enrolled Courses in the Timeline.");
						return;
					}

					movedCourse = semester.splice(courseIndex, 1)[0]; // Extract the full object
					break; // Stop searching once found
				}
			}
			
			// Check if the semester is in the past (index < 6)
			if(semesterIndex < 6){
				alert("Cannot move courses into past semesters.");
				return;
			}

			// This handles the case where we are moving a course from the search results.
			if(movedCourse == null){

				movedCourse = {
					course: course_code,
					semester: semesterNames[semesterIndex],
					completionStatus: "Not Completed", // Default status of "Not Completed"
				};
			}
			console.log(movedCourse);
			if (movedCourse) {
				// Add the extracted course object to the new semester
				timelineState.value[semesterIndex].push(movedCourse);
			}

			console.log("Updated timelineState:", timelineState.value);
		};

		// Helper functions
		const getSemesterName = (semesterIndex) => semesterNames[semesterIndex];
		const getSemesterIconColor = (semesterIndex) => {
			const semesterName = getSemesterName(semesterIndex);
			if (semesterName.includes("Fall")) return "orange";
			if (semesterName.includes("Winter")) return "blue";
			if (semesterName.includes("Spring")) return "green";
			if (semesterName.includes("Summer")) return "yellow";
			return "black";
		};

		const toggleCollapse = (semesterIndex) => {
			collapsed.value[semesterIndex] = !collapsed.value[semesterIndex];
		};

		// Methods for adding/removing semesters and template actions
		const addSemester = () => {
			// Avoid direct mutation in places that cause recursive rendering
			if (numSemestersToRender.value < semesterNames.length) {
				numSemestersToRender.value += 1;
				localStorage.setItem(
					"numSemestersToRender",
					numSemestersToRender.value
				); // Persist the change
			} else {
				alert("Max number of semesters reached.");
			}
		};

		const removeSemester = () => {
			if (numSemestersToRender.value > 1) {
				numSemestersToRender.value -= 1;
				localStorage.setItem(
					"numSemestersToRender",
					numSemestersToRender.value
				); // Persist the change
			}
		};
			// Load a bunch of courses into the timelineState array for demo purposes.
			const loadTemplate = async (selectedTemplate) => {

				// If the user selected the starter template.
				if(selectedTemplate != null){
					

					// Extract the "demo-template" object
					let data = demoTemplateData['demo-template'];
					console.log(data);
					console.log(data[5]);
						
					// First, clear out anything that might already be in the timelineState array.
					for(let i = 0; i < timelineState.value.length; i++){
						
						// Skip the first 2 fall/winter semesters, as they are already filled with courses that shouldnt be deleted.
						if(i != 0 && i != 1 && i != 4 && i != 5){
							
							// Erase all other data.
							timelineState.value[i] = [];
						}

						// If there is any data at this semester in the demo template, add it to the timelineState array.
						
						// These are the semesters we know we are adding to the timelineState array.
						if(i >= 5 && i < 18){
							
							// For each course,
							for(let j = 0; j < data[i].length; j++){
								
								// Add the course to the timelineState array.
								timelineState.value[i].push(data[i][j]);
							}
	
						}
					}

					// Finally change the number of semesters to render to show all the courses.
					console.log("timelineState after loading template:" + timelineState.value);
					numSemestersToRender.value = 16;

					loadTemplateDialog.value = false;
				}			
			};

		return {
			timelineState,
			initializeTimelineState,
			user,
			numSemestersToRender,
			startDrag,
			onDrop,
			getSemesterIconColor,
			getSemesterName,
			collapsed,
			toggleCollapse,
			addSemester,
			removeSemester,
			loadTemplate,
			loadTemplateDialog,
		};
	},

	methods: {
		addWarning(message) {
			this.warningLogs += `\n⚠️ ${message}⚠️`;
		},

		// Function to update the timeline state with sorted courses
		updateTimelineState() {
			// console.log(this.user.pastCourses);
			// console.log(this.groupedPastCourses);
		},
		goToCourse(course) {
			this.$router.push({
				name: "course-overview",
				params: { courseId: course.id },
			});
		},
	},

	computed: {
		groupedPastCourses() {
			return (
				this.user.pastCourses?.reduce((acc, course) => {
					if (!acc[course.semester]) {
						acc[course.semester] = [];
					}
					acc[course.semester].push(course);
					return acc;
				}, {}) || {}
			);
		},

		sortedGroupedPastCourses() {
			// Sort semesters in descending order (latest at the top)
			const sortedKeys = Object.keys(this.groupedPastCourses).sort((a, b) => {
				const [semesterA, yearA] = a.split(" ");
				const [semesterB, yearB] = b.split(" ");
				return yearB - yearA; // Compare years in descending order
			});

			// Return a new object with the sorted keys
			return sortedKeys.reduce((acc, key) => {
				acc[key] = this.groupedPastCourses[key];
				console.log(acc);
				return acc;
			}, {});
		},

		filteredCourses() {
			if (!this.searchQuery) return [];
			const query = this.searchQuery.toLowerCase();

			return this.allCourses.filter((course) => {
				const nameMatch = (course.name || "").toLowerCase().includes(query);
				const idMatch = (course.id || "").toLowerCase().includes(query);
				return nameMatch || idMatch;
			});
		},
	},
	async created() {
		// try {
		// 	const response = await axios.get("http://localhost:3000/api/users");
		// 	user = response.data.find((u) => u.id === 1) || {};
		// } catch (error) {
		// 	console.error("Error fetching user:", error);
		// }
	},
	mounted() {
		// Call addWarning after the page is mounted
		this.addWarning(
			"Missing CPSC 331 in Dashboard. Drag and drop it from requirements report"
		);
		axios
			.get("http://localhost:3000/api/courses") // adjust this path as needed
			.then((response) => {
				this.allCourses = response.data;
			})
			.catch(() => {
				this.addWarning("Failed to load course data.");
			});
	},
};
</script>

<style scoped>
/* Ensure all course buttons are the same size */
.course-btn {
	height: 120px; /* Set a consistent height for all buttons */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 10px;
	text-align: center;
	margin: 4px 0;
	position: relative;
}

/* Center course name and icon */
.course-name {
	font-size: 1.1rem;
	font-weight: bold;
}

.course-icon {
	font-size: 1.3rem;
	margin-left: 8px;
}

/* Status on the top-right of the button */
.status {
	position: absolute;
	top: 8px;
	right: 8px;
	font-size: 0.9rem;
}

/* Timeline adjustments */
.v-timeline-item {
	width: 100%;
}

.v-slide-group {
	overflow-x: auto;
	display: flex;
	flex-wrap: nowrap;
}

.d-flex {
	display: flex;
}

.v-avatar {
	background-color: teal;
}

.ml-2 {
	margin-left: 8px;
}

.v-spacer {
	flex-grow: 1;
}

.float-right {
	float: right;
}

.v-btn {
	margin: 10px;
	font-weight: bold;

	border-radius: 4px;
	transition: background-color 0.3s ease;
}

.v-btn:hover {
	background-color: darkslategray; /* Darker shade on hover */
	color: white;
}

.gray-btn {
  background-color: gray !important;
  color: white !important;
}

.big-btn {
  font-size: 1.5rem !important;
  padding: 24px 24px !important;
}

.strikethrough {
	box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0);
	animation: glowAnimation 1.5s infinite alternate;
}

@keyframes glowAnimation {
  from {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 1);
  }
  to {
    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 1);
  }
}

.drop-zone {
	display: flex;
	width: auto;
	height: auto;
	margin: 50px auto;
	background-color: lightgray;
	border-radius: 10px;
	padding: 10px;
	min-height: 50px; /* Set a minimum height for the drop zone */
	min-width: 120px; /* Set a minimum width for the drop zone */
	flex-direction: row;
}

.scrollable-column {
	max-height: calc(100vh - 64px); /* Adjust for App Bar height */
	overflow-y: auto; /* Enables vertical scrolling */
	padding-right: 8px; /* Optional: prevents scrollbar from overlapping content */
}

.log-box {
	background-color: #fff3cd; /* Light yellow background */

	overflow-y: auto;
}

.warning-text {
	color: #856404; /* Darker text for readability */
	font-weight: bold;
}

.warning-text .v-input__control {
	background-color: #fff3cd !important; /* Yellow background */
}

.search-bar {
	width: 66%; /* 2/3 of the width */
	border-radius: 8px; /* Rounded corners */
	margin: 10px auto; /* Center the component and add margin */
	padding: 10px; /* Padding around the text field */
	margin-left: 0;
	margin-right: auto;
}
</style>
