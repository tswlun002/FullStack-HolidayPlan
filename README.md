
#  FullStack-HolidayPlan
Allow user to add their holiday plan, 
and query if they have a question(s) related to the site.
Admins can respond to user questions.
Made this site to show the use of role-based and permission-based using spring boot with JWT and MYSQL back-end
And use ReactJS front-end


## Running Back-end
I use IntelliJ 
Or VS Code  but need to install  Java Development Kit (JDK), Extension Pack for Java,  and Spring Boot Extension Pack,
[see here](https://code.visualstudio.com/docs/java/java-spring-boot)

## Running Front-end
I use VS Code for ReactJS, use the following command on VS Code terminal
```
 npm run build  # to compile/build
 npm start      # to run site  
 npm run eject  # To clean up the environment
```
### Running using  docker 
Generate jar file using Maven, [more info, click here](https://www.jetbrains.com/help/idea/compiling-applications.html)
After generating the jar file, run the commands below:
```
$ cd front-end
$ docker build -t tswlun002/tour-back-end:0.0.1  # build front end image
$ cd ../back-end
$ docker build -t tswlun002/tour-back-end:0.0.1  # build back end image
$ cd ..
$ docker compose up   # run container/service
```
### OPEN following the link on your browser after running the above command successfully
[Holiday-Plan-App](http://localhost:3000)
After, the user can register and login

