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
    <!-- Help Button -->
    <v-btn icon @click="helpDialog = true">
      <v-icon color="white">mdi-help-circle-outline</v-icon>
    </v-btn>
          <!-- Help Dialog -->

    <v-dialog v-model="helpDialog"  max-width="500">
      <v-card>
        <v-card-title class="headline">Need Help?</v-card-title>

        <v-card-text>
          <h3 class="mb-3">
                      1. Find the course you want to take.  
                      </h3>
                      <h3 class="mb-3">
                      2. Click on the course name to view its details. 
                      </h3>
                      <h3 class="mb-3">
                      3. Click the checkmark icon to select the course.
                      </h3>


          
        </v-card-text>

        <v-card-text>


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
    <!-- Header -->
    <v-row align="center" class="mb-4">

    </v-row>

    <VCardTitle> Select From Valid Courses (More Courses Coming Soon!)</VCardTitle>

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
import axios from "axios";

  export default {
    

    data() {
      
      return {
          helpDialog: false,
        faculties: ['Art', 'Computer History', 'Music'],
        courses: [
          {
            name: 'Engineering',
            courses: [
              {
                name: 'SENG 533',
                description: 'Learn software testing and evaluation techniques',
                offered: ' Winter 2027',
              },

            ],
          },
          {
            name: 'Mathematics',
            courses: [],
          },
          {
            name: 'Music',
            courses: [],
          },
        ],
      }
    },
    methods: {
      goBack() {
        console.log('Go back')
      },
      selectCourse(course) {
        console.log('Selected course:', course.name);
        //Go back to the previous page
        // Write a flag to the local storage to indicate that a course has been selected
          localStorage.setItem('non-major-field-flag', true);
          this.$router.go(-1);
      },
    },
    
  async created() {
    // try {
    //   //const courseId = "STAT300"; // set default to STAT300
    //   console.log("Route params:", this.$route.params); // Debugging
    //   const courseId = this.$route.params.courseId;
    //   const response = await axios.get(
    //     `http://localhost:3000/api/courses/${courseId}`
    //   );
    //   this.course = response.data;
    //   console.log("Course data:", courseId);

    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }


  }
  }
</script>

<style scoped>
  .v-container {
    max-width: 600px;
  }
</style>
