ARG JWT_SIGNING_KEY
ARG DEFAULT_ROLE
ARG DEFAULT_PERMISSIONS
ARG DEFAULT_USER
ARG JWT_ACCESS_TOKEN_PERIOD
ARG JWT_REFRESH_TOKEN_PERIOD
ARG APP
ARG ADDRESS
ARG SOCIALS
ARG MAIL_HOST
ARG MAIL_USERNAME
ARG MAIL_PASSWORD
ARG MAIL_PROTOCOL
ARG MAIL_PORT
ARG VERIFICATION_EXPIRE_TIME
ARG MAIL_REGISTER_DETAILS
ARG MAIL_PASSWORD_DETAILS
ARG PASSWORD_EXPIRATION
FROM maven:3.8.3-openjdk-17
LABEL authors="l.tsewu"
WORKDIR /opt
ARG DEFAULT_ROLE
ARG DEFAULT_PERMISSIONS
ARG JWT_SIGNING_KEY
ARG DEFAULT_USER
ARG JWT_ACCESS_TOKEN_PERIOD
ARG JWT_REFRESH_TOKEN_PERIOD
ARG APP
ARG ADDRESS
ARG SOCIALS
ARG MAIL_HOST
ARG MAIL_USERNAME
ARG MAIL_PASSWORD
ARG MAIL_PROTOCOL
ARG MAIL_PORT
ARG VERIFICATION_EXPIRE_TIME
ARG MAIL_REGISTER_DETAILS
ARG MAIL_PASSWORD_DETAILS
ARG PASSWORD_EXPIRATION
ARG DATABASE_HOST_NAME
ARG DATABASE_NAME
ARG DATABASE_PORT
ARG MYSQL_USER
ARG MYSQL_PASSWORD

ENV jwt.signing.key=${JWT_SIGNING_KEY}
ENV role.default.names=${DEFAULT_ROLE}
ENV permission.default.names=${DEFAULT_PERMISSIONS}
ENV user.default.user=${DEFAULT_USER}
ENV jwt.access.accessToken.period=${JWT_ACCESS_TOKEN_PERIOD}
ENV jwt.refresh.accessToken.period=${JWT_REFRESH_TOKEN_PERIOD}
ENV app.details=${APP}
ENV app.address=${ADDRESS}
ENV app.socials=${SOCIALS}
ENV mail.host=${MAIL_HOST}
ENV mail.password=${MAIL_PASSWORD}
ENV mail.username=${MAIL_USERNAME}
ENV mail.protocol=${MAIL_PROTOCOL}
ENV mail.port=${MAIL_PORT}
ENV verification.expire.time=${VERIFICATION_EXPIRE_TIME}
ENV host.registration.mail=${MAIL_REGISTER_DETAILS}
ENV password.reset.expire.time=${PASSWORD_EXPIRATION}
ENV host.password.reset.mail=${MAIL_PASSWORD_DETAILS}
ENV DATABASE_HOST_NAME=${DATABASE_HOST_NAME}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
COPY target/*.jar /opt/app.jar
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar

