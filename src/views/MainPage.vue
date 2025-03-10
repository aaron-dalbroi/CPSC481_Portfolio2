<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="6">
				<v-card>
					<v-card-title> Welcome to the Home Page </v-card-title>
					<v-card-subtitle>
						This is a simple page using Vuetify.
					</v-card-subtitle>
					<v-card-actions>
						<!-- Add the @click event to trigger an action -->
						<v-btn color="primary" @click="handleClick">Click Me</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "HomePage",
	methods: {
		// Define the click handler method
		handleClick() {
			console.log("Button was clicked!");
			// You can add any logic here to handle the click event
		},
	},
};
</script>

<style scoped>
/* Your custom styles */
</style>
