import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import CourseOverview from "@/views/CourseOverview.vue";
import SelectOptionalCourse from "@/views/SelectOptionalCourse.vue";
import NonMajorFieldChoice from "@/views/Non-Major-Field-Choice.vue"; // Import the new component
import NonScienceCourseChoice from "@/views/Non-Science-Choice.vue"; // Import the new component

const routes = [
	{
		path: "/",
		name: "main-page",
		component: MainPage,
	},
	{
		path: "/course/:courseId",
		name: "course-overview",
		component: CourseOverview,
		props: true, // Pass route params as props
	},
	{ path: "/select-course",
	  name:"select-course",
	  component: SelectOptionalCourse }, // Route for the secondary page
	  
	  { path: "/non-major-field-choice",
		name:"non-major-field-choice",
		component: NonMajorFieldChoice }, // Route for the secondary page
		  
		{ path: "/non-science-choice",
			name:"non-science-choice",
			component: NonScienceCourseChoice }, // Route for the secondary page

];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
