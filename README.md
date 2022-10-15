## Installation
- git clone https://github.com/ramiro1287/rather-labs.git
- cd backend-chanllenge
- docker-compose up

### If occurs an error during the installation install nodejs v16 and install the libs
- npm install

## Urls
- http://0.0.0.0:8080/orders/{pair}?depth={1,25,500}   GET

- http://0.0.0.0:8080/trader?depth={1,25,500}   POST
body: pair(string), type(ask or bid), amount(double), limit(string-optional)
