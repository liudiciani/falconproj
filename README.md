# FoundIt
#UMass CS326 Falcon Team's Semester Project

##Overview

This repository is for Falcon teammembers to commit code changes for our semester project.

###Unique ID Finding Web Application!

*Team Roles:*

**Andrew Raleigh** -  Originally from New Jersey, Andrew is a computer science student focusing on data science and search engines at UMass Amherst. He contributes towards backend database engineering. When he’s not exploring data science, Andrew can be found snowboarding mountains all over New England and training at the rec center. He is also an avid Manchester United and soccer fan.

**Jared Koester** - Jared's dream is to develop an operating system. He focuses on low-level programming and software systems in his studies at UMass. Having won a hackathon for his original pitch of findIt, then called Keytagg, he is now working on it's implementation by contributing ful stack development and guiding the overall implementation.

**Lisa Iudiciani** - Lisa is currently a computer science student with a focus in software engineering  at UMass Amherst. She will exercise her passion for the User Interface/User Experience fields by designing and developing an attractive, interactive and easily navigational interface. She will utilize her experience in HTML and CSS to ensure that the site is appealing and reflects the major feature of our application - simplicity. Not only does Lisa identify herself as a developer; she also responds to the titles of baker, dog hugger, and adequate guitar player.

**Aaron Kaplowitz** - Aaron is a UMass CS student from eastern Massachusetts.  He will be contributing to the entire stack for foundit, but will focus on the backend and leverage the communication between the UI and the database.  He loves food, bowling, theater, and short walks on long beaches.

**Tyler Zentz** - Tyler is currently in his third year at the University of Massachusetts Amherst, pursuing a degree in Computer Science.  With his new found knowledge of JavaScript he will help his team in all aspects of the creation of “foundit!”, while focusing primarily on frontend development. In his free time, Tyler enjoys exercising at the gym, playing pickup soccer, and strumming his acoustic guitar.

**Ben Danzig** - Ben is a Junior Computer Science student at UMass Amherst. He has experience with software engineering at his last internship in the Summer of 2015, and his language of choice is Java. He is responsible for preliminary research for Team Falcon, such as keeping up with market competition for “FoundIt!” and making sure that the product provides a unique service and has a competitive edge. In his free time, Ben likes to stay active by playing Basketball, Volleyball, and going hiking whenever possible.


##How To Run

1. Ensure that Node is installed on your machine.
2. Clone this repository to a destination folder of your choice
  - The folder will named **'falconproj'**. *cd* into that folder.
3. Visit private documentation for setting up the config directory and the default.json file
4. Run *node app.js* to start the server. 
4. Open your browser of choice and navigate to *localhost:3000*.
5. Welcome to FoundIt!

##Libraries

*connect-flash - Used to transfer messages across redirects.

*express - express.Router(); is used to handle all the routing in our application. This happens in the “user-routes.js” file and routes are handled via either the “router.get()” or “router.post()” methods.

*postgres/pg - In “user.js”, pg is used to connect to the database via the call to “pg.connect()”. Once connected to the database, we use pg to query the database via “client.query()”.

*express-handlebars - used to generate views.

*body-parser - TODO

*express-session - TODO.

##Views

TODO: Summary of each of the views and their purpose.

##Statefulness

We use session states to keep track of whether or not a user is an admin, and if the user is logged in. User session is initialized upon running the “/auth” route in user-routes.js when logging in. The user object is queried from the database using the “lookup” function in “user.js”. Once a user is logged in, they are added to the “online” array in “online.js”.

##Persistence

FoundIt uses a relational PostgreSQL database hosted by ElephantSQL. The primary table of our application is depicted below, with a single mock data user.

| uid | fname | lname | email | password | uurl | admin | phone |
| --- | ----- | ----- | ----- | -------- | ---- | ----- | ----- |
|1 | John | Doe | jdoe@umass.edu | falcon2 | 56qp2 | no | (415)-222-2222 |g