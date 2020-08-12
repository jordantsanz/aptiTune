# aptiTune

![Team Photo](Insert a Team Photo URL here)

## Architecture

### Front-end:
- Technologies:
  - React
  - Redux
- Information/Features:
  - Note and staff interface for lesson modules
  - Current lesson loaded in only; progress bar for that lesson
  - Sound input, compresses sound and sends to server
    - Write note for the response from server

### Back-end:
- Technologies:
  - Database: MongoDB
  - Routing: Express.js
- Information/Features:
  - Database holds each lesson module
  - Authentication
    - Through Google
    - Unique username stored with each user
      - Username serves as key, loads-in progress badges
  - Notes and rhythm options held in database; server matches from input given from front-end
    - Sends note output back to front-end
  
### React Tree: 
- App
  - HomePageWithNoUser
    - Auth: log-in/sign-up
  - HomePageWithUser
   - LessonList
    - Lesson
      - InformationPage
      - QuizPage
        -Staff
          -Note
  - UserPage
    - Badges
  - Writing
  
  
### Data Flow
- Client calls onLoad, sends request to load info 
- Server calls getLoadInfo, retreives info for loading home page without auth
- Client receives loaded page, *auth*, server sends back user info with badges
- User Loaded:
  - User page: routed; info about badges now located in client
  - Real time writing: tbd
  - Lessons:
    - Client calls getLesson(lessonID), server calls getLessonInfo() and sends back json
    - Lesson loaded
      - Go back: getHomePage (routing)
      - Continue to next part of lesson (info is in client from load-in)
      - On finish:
        - Call updateUserInfo(lessonID), server updates user info with completed lessons
        - Route back to homepage

## Setup

- yarn add react react-router-dom react-dom react-draggable
- yarn add react-redux redux redux-thunk
- yarn add express body-parser
- yarn add cors path morgan mongoose

## Deployment

Deployed with api on heroku, front-end on surge.sh. 

## Authors
Jacob Donoghue

# Acknowledgments
