<template>
	<v-container>
		<v-card>
			<v-card-title>{{ course.name }}</v-card-title>
			<v-card-subtitle>{{ course.description }}</v-card-subtitle>
			<v-card-text>
				<vue-tree :tree="treeData" />
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
		};
	},
	async created() {
		const courseId = this.$route.params.courseId; // Get course ID from route
		try {
			const response = await axios.get(
				`http://localhost:3000/api/courses/${courseId}`
			);
			this.course = response.data;
			this.setTreeData();
		} catch (error) {
			console.error("Error fetching course:", error);
		}
	},
	methods: {
		setTreeData() {
			// Set the tree data where the root is the course and its prerequisites are branches
			const prerequisites = this.course.prerequisites || [];
			this.treeData = {
				id: this.course.id,
				name: this.course.name,
				children: prerequisites.map((prereq) => ({
					id: prereq,
					name: prereq,
				})),
			};
		},
	},
};
</script>

<style scoped>
/* Add custom styles if necessary */
</style>
