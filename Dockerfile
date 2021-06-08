# Stage-1 Dependencies
FROM node:10-jessie as dependencies
RUN mkdir /dependencies
WORKDIR /dependencies
COPY package*.json ./
RUN npm install

# RUN apk add --no-cache git
# See https://github.com/ethereum/web3.js/issues/1211
# RUN git config --global url."https://".insteadOf git://

# Stage-2 Runnable image
FROM node:10-jessie-slim
WORKDIR /usr/src/app
COPY --from=dependencies /dependencies/node_modules ./node_modules
COPY . .
RUN npm run build
# RUN npm run compile-server - > @todo: unsure if still used, causes build failures in 2021.
EXPOSE 8081
ENTRYPOINT ["npm", "run", "start"]
