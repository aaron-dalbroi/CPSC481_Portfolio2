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

			<v-toolbar-title class="ml-2">
				Degree Navigator
			</v-toolbar-title>

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
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>

				<!-- Timeline Section -->
				<v-timeline align="start" reverse side="end">
					<!-- Current Courses (at the top of the timeline) -->
					<v-timeline-item
						v-if="user.currentCourses && user.currentCourses.length"
						:key="'current-courses'"
						dot-color="teal-lighten-3"
						size="large"
					>
						<template v-slot:icon>
							<v-avatar color="teal" size="24px"> </v-avatar>
						</template>
						<template v-slot:opposite>
							<span>{{ user.currentCourses[0].semester }}</span>
						</template>
						<v-card class="elevation-2">
							<v-card-title class="text-h5">Current Semester</v-card-title>
							<v-card-text>
								<v-slide-group multiple class="d-flex">
									<v-slide-item
										v-for="course in user.currentCourses"
										:key="course.course"
										class="mb-2"
									>
										<!-- Make each course a button -->
										<v-btn
											:to="{
												name: 'course-overview',
												params: { courseId: course.course },
											}"
											block
											class="course-btn"
										>
											<!-- Course Title and Icon centered -->
											<div class="d-flex justify-center align-center">
												<span class="course-name">{{ course.course }}</span>
												<v-icon
													class="course-icon"
													:color="
														course.completionStatus === 'In Progress'
															? 'warning'
															: 'gray'
													"
												>
													mdi-progress-check
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

					<!-- Past Courses -->
					<v-timeline-item
						v-for="(courses, semester) in timelineState.slice(0, numSemestersToRender).reverse()"
						:key="semester"
						dot-color="teal"
						size="large"
					>
						<template v-slot:icon>
							<v-avatar color="teal" size="24px"> </v-avatar>
						</template>
						<template v-slot:opposite>
							<span>TimelineStateIdx:{{ numSemestersToRender - semester - 1 }}</span>
						</template>
						<v-card class="drop-zone" 
						@drop="onDrop($event, numSemestersToRender - semester - 1)" 
						@dragenter.prevent @dragover.prevent>

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
														course.completionStatus === 'Completed'
														? "mdi-checkbox-marked-circle"
														: course.completionStatus === 'In Progress'
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
				<v-card >
					<v-card-title>Warning Logs</v-card-title>
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
				<v-expansion-panels
					variant="accordion"
					multiple="true"
				>
					<v-expansion-panel
						expand-icon=""
						readonly="true"
					>
						<v-expansion-panel-title>
							<v-row>

								<v-col class="d-flex justify-left align-center">
									Status
								</v-col>
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
									<v-chip color="success" label>
										Completed
									</v-chip>
								</v-col>
								<v-col class="d-flex justify-end align-center">
									48 / 66
								</v-col>
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
										<v-icon
											color="green"
										>
											mdi-check-circle
										</v-icon>
									</td>
									<td>CS 251</td>
									<td>B+</td>
									<td>3</td>
									<td><v-chip color="green">Completed</v-chip></td>
									</tr>
									<tr>
									<td>
										<v-icon
											color="green"
										>
											mdi-check-circle
										</v-icon>
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
									<v-chip color="warning" label>
										In Progress
									</v-chip>
								</v-col>
								<v-col class="d-flex justify-end align-center">
									9 / 66
								</v-col>
								</v-row>
						</v-expansion-panel-title>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-title>
							<v-row>
								<v-col class="d-flex justify-left">
									<v-chip  color="error" label>
										Incomplete
									</v-chip>
								</v-col>
								<v-col class="d-flex justify-end align-center">
									9 / 66
								</v-col>
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
export default {
	name: "MainPage",
	data() {
		return {
			user: {},
			warningLogs: "",

		};
	},

	setup() {
		// Create a ref to hold the timelineState array
  		const timelineState = ref(Array([],[],[],[],[],[],[],[],[],[],
                                    [],[],[],[],[],[],[],[],[],[],
                                    [],[],[],[],[],[],[],[],[],[],
                                    [],[])); // Hard-coded for 32 semesters (8yrs)		
		const user = ref({});
		

		let numSemestersToRender = ref(parseInt(localStorage.getItem('numSemestersToRender')) || 6);

		
		// Method to initialize timelineState with 32 sub-arrays
		const initializeTimelineState = () => {
			
			timelineState.value = Array.from({ length: 32 }, () => []);

			// These values are the ones that should always be in the timeline, and shouldn't be changed.
			// Fall 2o24
			timelineState.value[0].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[0].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[0].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[0].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[0].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			
			// Winter 2025
			timelineState.value[1].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[1].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[1].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[1].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});
			timelineState.value[1].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "Completed"});

			// Fall 2025
			timelineState.value[4].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "In Progress"});
			timelineState.value[4].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "In Progress"});
			timelineState.value[4].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "In Progress"});
			timelineState.value[1].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "In Progress"});
			timelineState.value[4].push({	"course": "CPSC100",
											"semester": "Fall 2024",
											"completionStatus": "In Progress"});
		};										

		    // Method to fetch user data
			const fetchUserData = async () => {
        try {
			const response = await axios.get('http://localhost:3000/api/users');
			user.value = response.data.find((u) => u.id === 1) || {};
		} catch (error) {
			console.error('Error fetching user:', error);
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
        console.log('start drag', item);
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('course_code', item);
      };



    const onDrop = (event, semesterIndex) => {

		const course_code = event.dataTransfer.getData('course_code');
    console.log('Course Being Dropped:', course_code, 'into semester', semesterIndex);

    if (!course_code) return;

    let movedCourse = null;

    // Search for the course and remove it from its original semester
    for (let i = 0; i < timelineState.value.length; i++) {
        const semester = timelineState.value[i];
        const courseIndex = semester.findIndex(course => course.course === course_code);
        if (courseIndex !== -1) {
            movedCourse = semester.splice(courseIndex, 1)[0]; // Extract the full object
            break; // Stop searching once found
        }
    }
	console.log(movedCourse);
    if (movedCourse) {
        // Add the extracted course object to the new semester
        timelineState.value[semesterIndex].push(movedCourse);
    }

    console.log('Updated timelineState:', timelineState.value);
	}

		return {
			timelineState,
			initializeTimelineState,
			user,
			numSemestersToRender,
			startDrag,
			onDrop,

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
		}
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
    this.addWarning("Missing CPSC 331 in Dashboard. Drag and drop it from requirements report");
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

.drop-zone{
    display: flex;
    width: auto;
    height: auto;
    margin: 50px auto;
    background-color: lightgray;
    border-radius: 10px;
    padding: 10px;
    min-height: 50px; /* Set a minimum height for the drop zone */
    min-width: 120px; /* Set a minimum width for the drop zone */
    flex-direction:row;

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
  width: 66%;           /* 2/3 of the width */
  border-radius: 8px;   /* Rounded corners */
  margin: 10px auto;    /* Center the component and add margin */
  padding: 10px;        /* Padding around the text field */
  margin-left: 0;
  margin-right: auto;
}

</style>
