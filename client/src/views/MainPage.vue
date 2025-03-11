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
				dot-color="teal"
				size="small"
			>
				<div class="d-flex">
					<!-- Get the semester from the first current course -->
					<strong class="me-4">
						{{ user.currentCourses[0].semester }}
					</strong>
					<div>
						<strong>Current Courses</strong>
						<v-slide-group multiple class="d-flex">
							<v-slide-item
								v-for="course in user.currentCourses"
								:key="course.course"
								class="mb-2"
							>
								<v-card class="pa-4" outlined>
									<v-card-title>
										{{ course.course }}
										<v-spacer />
										<v-icon
											:color="
												course.completionStatus === 'In Progress'
													? 'blue'
													: 'gray'
											"
											class="float-right"
										>
											mdi-progress-check
										</v-icon>
									</v-card-title>
									<v-card-subtitle>{{
										course.completionStatus
									}}</v-card-subtitle>
								</v-card>
							</v-slide-item>
						</v-slide-group>
					</div>
				</div>
			</v-timeline-item>

			<!-- Past Courses -->
			<v-timeline-item
				v-for="(courses, semester) in sortedGroupedPastCourses"
				:key="semester"
				dot-color="teal-lighten-3"
				size="small"
			>
				<div class="d-flex">
					<strong class="me-4">{{ semester }}</strong>
					<div>
						<strong>Courses Taken</strong>
						<v-slide-group multiple class="d-flex">
							<v-slide-item
								v-for="course in courses"
								:key="course.course"
								class="mb-2"
							>
								<v-card class="pa-4" outlined>
									<v-card-title>
										{{ course.course }}
										<v-spacer />
										<v-icon
											:color="
												course.completionStatus === 'Completed'
													? 'green'
													: 'red'
											"
											class="float-right"
										>
											{{
												course.completionStatus === "Completed"
													? "mdi-checkbox-marked-circle"
													: "mdi-cancel"
											}}
										</v-icon>
									</v-card-title>
									<v-card-subtitle>{{
										course.completionStatus
									}}</v-card-subtitle>
								</v-card>
							</v-slide-item>
						</v-slide-group>
					</div>
				</div>
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
/* Add custom styles to adjust timeline positioning */
.v-timeline {
	margin-left: 20px; /* Shift timeline more to the left */
}

.v-timeline-item {
	width: 300px; /* Adjust tile width */
}

.v-slide-group {
	overflow-x: auto;
	display: flex;
	flex-wrap: nowrap;
}

.d-flex {
	display: flex;
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
