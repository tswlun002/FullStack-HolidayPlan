
#  [Holiday-Plan-App](http://localhost:3000)
Allow user to add their holiday plan, 
and query if they have a question(s) related to the site.
Admins can respond to user questions.
Made this site to show the use of role-based and permission-based using spring boot with JWT and MYSQL back-end
And use ReactJS front-end

### APP Configuration
I use IntelliJ Or VS Code  but need to install  Java Development Kit (JDK), Extension Pack for Java, 
and Spring Boot Extension Pack, [see here](https://code.visualstudio.com/docs/java/java-spring-boot)

I use VS Code for ReactJS, use the following command on VS Code terminal

Generate jar file using Maven, [more info, click here](https://www.jetbrains.com/help/idea/compiling-applications.html)

### Build application using Maven
```
 $ mvn clean install
```
### After build, run the commands below start the app:
```
$ make config         # config docker compose
$ make run            # run the docker compose for database, server and client container
$ make run-client     # run only the front-end docker compose part
$ make run-server     # run only the back-end docker compose part
$ make run-db         # run only the mysql database docker compose part
$ make clean          #clean container and txt file
```
### OPEN following the link on your browser after running the above command successfully
[Holiday-Plan-App](http://localhost:3000)

### LOGINS
- LOGIN AS USER
  - Need to register first
  - Verify account, verification will be sent to you email address
  - After successful registered, you can use credintials to login
  - If forgotten password, use forgot password button on login screen to reset password
- LOGIN AS ADMIN
  -  Use following defaulted admin credentials
  ```
  username: holidayplans.lt@gmail.com
  password: 123456
  ```
### FUNCTIONS OF THE APP
- ADMIN FUNCTIONS
  - Login using default user details
  - Respond to user query
  - Manage users like Add user, update user details(except password), delete user  and add or delete roles and permissions to user
  - Manage roles like add role, update role, delete role and add or delete permissions to role
  - Manage permission like add and delete permissions
  - Update their profile/account detail except emails
  - logout 
- USER FUNCTIONS
  -  Register itself
  -  Get email verification
  -  Reset Password and get email to reset password
  -  Login
  -  Add or delete Holiday plan card
  -  Update Holiday plan card priority
  -  Submit query
  -  Can see their queries
  -  Can delete their query at any query state(active or solved)
  -  Update their account details
  -  Logout




    
   

