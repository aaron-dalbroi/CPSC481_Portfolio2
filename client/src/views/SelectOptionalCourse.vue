<template>
    <v-container>
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
				Select Optional Course
			</v-toolbar-title>

		</v-app-bar>
      <!-- Header -->
      <v-row align="center" class="mb-4">

      </v-row>
  
      <VCardTitle> Select From Valid Courses </VCardTitle>
  
      <!-- Courses Section -->
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="(category, index) in courses" :key="index">
          <v-expansion-panel-title>{{ category.name }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-expansion-panels multiple>
              <v-expansion-panel
                v-for="(course, idx) in category.courses"
                :key="idx"
              >
                <template v-slot:title>
                  <v-row align="center" no-gutters>
                    <v-col>{{ course.name }}</v-col>
                    <v-col cols="auto">
                      <v-btn icon @click.stop="selectCourse(course)">
                        <v-icon>mdi-check-circle-outline</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
                <v-expansion-panel-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-card v-if="course.description" class="description-card">
                            <v-card-text>
                                <div class="description-box">
                                    <p>{{ course.description }}</p>
                                </div>
                            </v-card-text>
                        </v-card>
                        <br>
                        <v-chip small class="mt-2">{{ course.offered }}</v-chip>
                        <v-btn small color="primary" @click="viewDetails(course)">
                          Prerequisite View
                        </v-btn>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </template>
  
  <script>
    export default {
      data() {
        return {
          faculties: ['Engineering', 'Computer Science', 'Physics'],
          courses: [
            {
              name: 'Engineering',
              courses: [
                {
                  name: 'ENEL 503',
                  description: 'Introduction to the fundamentals of image processing and computer vision. Image/video acquisition and raw data matrix manipulation; image processing operations and compression methods; object detection, isolation, and classification; 3D tracking and ego-motion with projective transformations.',
                  offered: 'Winter 2025, Spring 2025',
                },
                {
                  name: 'ENEL 555',
                  description: 'Detailed course info',
                  offered: 'Winter 2025, Spring 2025',
                },
                {
                  name: 'ENCM 449',
                  description: 'Detailed course info',
                  offered: 'Winter 2025, Spring 2025',
                },
              ],
            },
            {
              name: 'Computer Science',
              courses: [],
            },
            {
              name: 'Physics',
              courses: [{ name: 'PHYS 554', description: 'Quantum mechanics' }],
            },
          ],
        }
      },
      methods: {
        goBack() {
          console.log('Go back')
        },
        viewDetails(course) {
          console.log('View details for', course.name)
        },
        selectCourse(course) {
          console.log('Selected course:', course.name)
        },
      },
    }
  </script>
  
  <style scoped>
    .v-container {
      max-width: 600px;
    }
  </style>
  