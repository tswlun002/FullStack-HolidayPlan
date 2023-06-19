FROM maven:3.8.3-openjdk-17
LABEL authors="l.tsewu"
WORKDIR /opt
ENV jwt.signing.key=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
ENV role.default.name=USER
ENV permission.default.names=USER_READ,USER_WRITE,QUERY_READ,QUERY_WRITE
COPY target/*.jar /opt/app.jar
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar