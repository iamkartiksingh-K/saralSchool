# salaraSchool
saralSchool is a learning management system built using strapi(CMS), Next.js, React.js and TypeScript.
There are two types of users, an instructor and a student. Instructor can create courses(both live and recorded) and students can purchase a course and learn from it.

### Getting Started
To run the strapi instance  
```
npm install
npm run develop
```

To run next.js 
``` 
npm install
npm run dev
```

### Technology used
1. [Next.js](https://nextjs.org/) for both frontend and backend.
2. [Strapi](https://strapi.io/) as the CMS.
3. [TypeScript](https://www.typescriptlang.org/) to get the type safety.
4. [Zod](https://zod.dev/) for schema validation in forms.
5. [shadcn](https://ui.shadcn.com/) for components.
6. [cloudinary](https://cloudinary.com/) for storing media.
7. [sendgrid](https://sendgrid.com/en-us) for email.
8. [TailwindCSS](https://tailwindcss.com/docs/installation) for styling.

### Project Structure
- **src**
    - **app**
        - **api** (backend)
            - **courseProgress** (contains routes to retrieve or modify the course progress of particular user in a course)
            - **courses** (various routes to manipulate courses)
                - **[id]** (course_id )
                    - **addStudent** (route to add student to a course from instructor dashboard)
                    - **buyCourse** (route to enroll a student in a course, also check if a user is in course with course_id = id)
                    - **lectures** (routes to manipulate lectures)
                        - **[lecture_id]** (route to get or update a lecture for instructor)
                        - **reorder** (route to change the positions of the lectures when reordering the lectures in instructor dashboard)
                        - **route.ts** (post a lecture)
                    - **route.ts** (get and update a course)
                - **allCourses**
                    - **[instructor_id]** (route to get all the courses of a particular instructor)
                - **myCourses**
                    - **[course_id]** (route to get a specific course bought by student)
                    - **route.ts** (get all the courses bought by student)
                - **route.ts** (create course for instructor and get course for all users)
            - **users**
                - **find** (route to get a particular user)
                - **login**
                - **logout** 
                - **me** (get information about the current user who is logged in)
                - **signup** (signup a new user)
                - **updateUser** (update user details)
        - **courses**
            - **[course_id]** (view a specific course in the app publically)
        - **instructor** (dashboard for instructor)
        - **login** (login page)
        - **myCourses** (course dashboard for the user)
            - **[course_id]** (view for single course)
        - **signup** (signup page)
        - **page.tsx** (homepage contains all courses)
        - **providers** (contains all the context providers)
    - **components**
        - **ui** (contains components from shadcn)
        - ..other files (custom components)
    - **contexts**
        - **userDataContext.tsx** (contains data of current user)
    - **lib**
        - **disableNavFooter.tsx** (pages in which nav and footer needs to be disabled)
        - **types** (custome types)
        - **utils** (utility functions)
    - **schema** (contains schema for signup and login form for zod validation)
    - **middleware.ts** (middleware)

### Current issues
1. Make the homepage look better.
2. Make all the pages look consistent.
3. sendgrid is not working correctly.

### Helpful resources
1. To create queries to strapi follow this : https://docs.strapi.io/dev-docs/api/rest/populate-select
2. To customize cloudinary video player : https://cloudinary.nuxtjs.org/components/cldvideoplayer
3. Missing strapi docs : https://missingstrapidocs.com/guide/utils/publish-programmatically.html

### Future development
1. Add the ability to create text content in lectures, you just need to add a text field in the lecture collection. Currently, there are two view based on the type of lecture, instead of limiting contentLink to only live lecture, include it in recorded lecture also. What I will suggest is do not make different view for both live and recorded lecture in lecture dashboard instead allow everything in live lecture but limit the recorded course to only include video, contentLink and text lecture.
2. Add the dashboard to create a blog.
3. Make the homepage more personalized.
