# FoundIt
### Unique ID Finding Web Application!
#### Current App State: "On Point"
##### Final Project Document: https://docs.google.com/document/d/1CZ4Bvojb6ceUhNWTm7lcgma1OrO8yH-rE66An8zWUmk/edit?usp=sharing
*Team Roles:*

**Andrew Raleigh** -  Originally from New Jersey, Andrew is a computer science student focusing on data science and search engines at UMass Amherst. He contributes towards backend database engineering. When he’s not exploring data science, Andrew can be found snowboarding mountains all over New England and training at the rec center. He is also an avid Manchester United and soccer fan.

**Jared Koester** - Jared's dream is to develop an operating system. He focuses on low-level programming and software systems in his studies at UMass. Having won a hackathon for his original pitch of findIt, then called Keytagg, he is now working on it's implementation by contributing ful stack development and guiding the overall implementation.

**Lisa Iudiciani** - Lisa is currently a computer science student with a focus in software engineering  at UMass Amherst. She will exercise her passion for the User Interface/User Experience fields by designing and developing an attractive, interactive and easily navigational interface. She will utilize her experience in HTML and CSS to ensure that the site is appealing and reflects the major feature of our application - simplicity. Not only does Lisa identify herself as a developer; she also responds to the titles of baker, dog hugger, and adequate guitar player.

**Aaron Kaplowitz** - Aaron is a UMass CS student from eastern Massachusetts.  He will be contributing to the entire stack for foundit, but will focus on the backend and leverage the communication between the UI and the database.  He loves food, bowling, theater, and short walks on long beaches.

**Tyler Zentz** - Tyler is currently in his third year at the University of Massachusetts Amherst, pursuing a degree in Computer Science.  With his new found knowledge of JavaScript he will help his team in all aspects of the creation of “foundit!”, while focusing primarily on frontend development. In his free time, Tyler enjoys exercising at the gym, playing pickup soccer, and strumming his acoustic guitar.

**Ben Danzig** - Ben is a Junior Computer Science student at UMass Amherst. He has experience with software engineering at his last internship in the Summer of 2015, and his language of choice is Java. He is responsible for preliminary research for Team Falcon, such as keeping up with market competition for “FoundIt!” and making sure that the product provides a unique service and has a competitive edge. In his free time, Ben likes to stay active by playing Basketball, Volleyball, and going hiking whenever possible.


## How To Run

1. Ensure that Node is installed on your machine.
2. Clone this repository to a destination folder of your choice
  - The folder will named **'falconproj'**. *cd* into that folder.
3. Visit private documentation for setting up the config directory and the default.json file
4. Run *node app.js* to start the server. 
4. Open your browser of choice and navigate to *localhost:3000*.
5. Welcome to FoundIt!

## Libraries

*connect-flash* - Used to transfer messages across redirects. - https://github.com/jaredhanson/connect-flash

*express* - express.Router(); is used to handle all the routing in our application. This happens in the “user-routes.js” file and routes are handled via either the “router.get()” or “router.post()” methods. - http://expressjs.com/en/index.html

*postgres/pg* - In “user.js”, pg is used to connect to the database via the call to “pg.connect()”. Once connected to the database, we use pg to query the database via “client.query()”. - https://github.com/brianc/node-postgres

*express-handlebars* - used to generate views. - https://github.com/ericf/express-handlebars

*config* - Config is used to hide security information about logging into and querying our database. - https://github.com/lorenwest/node-config

*body-parser* - Body parser allows us to send data back and forth between redirects. - https://github.com/expressjs/body-parser

*express-session* - Enables session support for our web application. - https://www.npmjs.com/package/express-session

*chance* - Chance.js is a minimalistic library used for random string generation. - https://github.com/victorquinn/chancejs

## Views
Summary of each of the views and their purpose.
NOTE: logout will redirect the user to the mainHome page.

**mainHome**: This view serves as the homepage of our webapp. A user or admin that is not logged in will be directed 
here, as well as a visitor. From the mainHome page, a visitor can access the login, signup, about, or team pages. The visitor also has the option to enter the unique url into the form to be directed to the corresponding profile.

**userhome**:This view serves as the home page of a user who is logged in and online. A user can view their account information as well as access their profile, the about and team pages, and logout. If the user is also an admin, they can access their admin home page from here...how convenient!

**admin**: This view serves as the home page of an administrator who is logged in and online. An admin can view the account information of all users in the database, as well as access their own user home, profile, about, team pages, and logout.

**about**: This view provides information about our webapp, explaining how it works, how to sign up, and the benefits of using it. It is accessible by users, admins, and visitors. 

**team**: This view provides information about the Falcons teammembers, including contact information. It is accessible by users, admins, as well visitors. 

**user-profile**: This view serves as the publicly visible unique profile page of a user. It displays their contact information so that the user can inform them of finding their item. This page is accessible by users, admins, and visitors. Logged in, online users can navigate back to their userhome or logout. Logged in, online users can navigate to their userhome, admin homepage, or logout. Visitors can navigate to our mainHome view. 

**login**: This view provides a log in form for users and admins. It is accessible by offline users, offline admins, and visitors, however failure to fill the form with credentials of an existing user/admin will prevent access to protected pages (such as userhome, admin, etc.).

**signup**: This view provides a sign up form for visitors to create an account. It is intended for visitors, however it is also accessible by offline users and offline admins. Filling the form with appropriate credentials (such as an email not already existing in the database) will create an account for the new user. The url generator will assign them with a unique url, which will be placed in the database accordingly. The user is then directed to the log in page to enter their credentials and access their homepage.


## Statefulness

We use session states to keep track of whether or not a user is an admin, and if the user is logged in. User session is initialized upon running the “/auth” route in user-routes.js when logging in. The user object is queried from the database using the “lookup” function in “user.js”. Once a user is logged in, they are added to the “online” array in “online.js”.

## Persistence

FoundIt uses a relational PostgreSQL database hosted by ElephantSQL. The primary table of our application is depicted below, with a single mock data user.

| uid | fname | lname | email | password | uurl | admin | phone | contact_info |
| --- | ----- | ----- | ----- | -------- | ---- | ----- | ----- | ------------ |
|1 | John | Doe | jdoe@umass.edu | falcon2 | 56qp2 | no | (413)-545-2222 | Thanks for finding my item! Call me at 908-666-666 |

The database keeps track of all users. It allows for users to log in and view their profile pages. The users table also keeps track of who is an admin, and each users individual unique url. If a user is an admin, he or she can view a dashboard page mentioned above. The database is queried each time a unique URL is passed as a path in an attempt to find a user whose items must have been lost.

Please note our database only allows a maximum of 7 users due to the hosting engine.