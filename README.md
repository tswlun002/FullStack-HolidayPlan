
#  FullStack-HolidayPlan
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

### After generating the jar file, run the commands below start the app:
```
$ make config    # config docker compose
$ make run       # run the docker compose

$ make run-client # run only the front-end docker compose part
$ make run-server  # run only the back-end docker compose part
$ make run-db       # run only the mysql database docker compose part
$ make clean     #clean container and txt file
```
### OPEN following the link on your browser after running the above command successfully
[Holiday-Plan-App](http://localhost:3000)
After, the user can register and login

