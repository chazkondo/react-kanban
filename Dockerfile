# Built from Node latest Alpine
FROM node:10.0

ARG app_directory=/app
WORKDIR ${app_directory}

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

# Copy startup script
COPY start.sh .
RUN chmod +x start.sh

# Use startup script instead of direct node command
CMD ["./start.sh"]