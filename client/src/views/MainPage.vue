<template>
	<v-container>
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
					<v-card-title class="text-h5">Current Courses</v-card-title>
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
													? 'blue'
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
				v-for="(courses, semester) in sortedGroupedPastCourses"
				:key="semester"
				dot-color="teal"
				size="large"
			>
				<template v-slot:icon>
					<v-avatar color="teal" size="24px"> </v-avatar>
				</template>
				<template v-slot:opposite>
					<span>{{ semester }}</span>
				</template>
				<v-card class="elevation-2">
					<v-card-title class="text-h5">Courses Taken</v-card-title>
					<v-card-text>
						<v-slide-group multiple class="d-flex">
							<v-slide-item
								v-for="course in courses"
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
												course.completionStatus === 'Completed'
													? 'green'
													: 'red'
											"
										>
											{{
												course.completionStatus === "Completed"
													? "mdi-checkbox-marked-circle"
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
	</v-container>
</template>

<script>
import axios from "axios";

export default {
	name: "MainPage",
	data() {
		return {
			user: {},
		};
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
				return acc;
			}, {});
		},
	},
	async created() {
		try {
			const response = await axios.get("http://localhost:3000/api/users");
			this.user = response.data.find((u) => u.id === 1) || {};
		} catch (error) {
			console.error("Error fetching user:", error);
		}
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
</style>
