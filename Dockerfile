FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose ports for Gateway (9000), Auth (9001), File (9002), Attendance (9003), and Employee (9004)
EXPOSE 9000 9001 9002 9003 9004

# Default CMD
CMD ["npm", "run", "start:gateway"]
