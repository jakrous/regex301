# Use the official Nginx image as the base image
FROM nginx:latest

# Copy the build folder contents to the Nginx HTML folder
COPY dist /usr/share/nginx/html

# Copy custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80
