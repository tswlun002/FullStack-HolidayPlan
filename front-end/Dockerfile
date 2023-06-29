# ==== CONFIGURE =====
# Use a Node 18 base image
FROM node:18-alpine 
# Set the working directory to /app inside the container
WORKDIR /app/front-end
# Copy app files
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json .
RUN npm i -g npm-check-updates && ncu -u && npm install --force
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
