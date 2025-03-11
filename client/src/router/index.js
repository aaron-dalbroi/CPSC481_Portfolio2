import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import CourseOverview from "@/views/CourseOverview.vue";

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
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
