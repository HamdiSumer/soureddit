FROM node:14

# Set the working directory within the container
WORKDIR /app

# Install the required Node.js modules
RUN npm install

# Copy the Node.js backend files into the container
COPY . /app/

# Expose the appropriate port for the Node.js backend
EXPOSE 3000

# Run the Node.js server
CMD ["node", "app.js", "sleep 100"]