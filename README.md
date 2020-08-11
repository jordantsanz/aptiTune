# aptiTune

![Team Photo](Insert a Team Photo URL here)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

TODO: short project description, some sample screenshots or mockups

## Architecture

Front-end:
- Technologies:
  - React
  - Redux
- Information/Features:
  - Note and staff interface for lesson modules
  - Current lesson loaded in only; progress bar for that lesson
  - Sound input, compresses sound and sends to server
    - Write note for the response from server

Back-end:
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
  
React Tree: 
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

## Setup

yarn add react react-router-dom react-dom react-draggable
yarn add react-redux redux redux-thunk
yarn add express body-parser
yarn add cors path morgan mongoose

## Deployment

TODO: how to deploy the project

## Authors

TODO: list of authors

## Acknowledgments
