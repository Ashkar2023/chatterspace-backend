FROM node:21-alpine3.18

COPY . /message-svc

WORKDIR /message-svc

EXPOSE 5000

RUN npm install

CMD ["npm","start"]

# # Stage 1: Builder
# FROM node:14 AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2: Final
# FROM node:14
# WORKDIR /app
# COPY --from=builder /app /app
# CMD ["npm", "start"]

# In this example, the target: builder means Docker will stop after the "Builder" 
# stage and use the image generated up to that point. 
# This is useful for optimizing the final image, 
#reducing its size, or separating the build environment from the runtime environment.