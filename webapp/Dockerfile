# First stage: Build the React app
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /webapp

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /webapp/node_modules/.bin:$PATH

# Copy package.json and yarn.lock to the working directory
COPY package.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the app
RUN npm run build

# Second stage: Serve the React app with Nginx
FROM nginx:1.15

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to Nginx's html directory
COPY --from=build-stage /webapp/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
