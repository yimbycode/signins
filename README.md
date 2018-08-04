# 👋 YIMBY Signin generator

This is the pro-housing, YIMBY signin generator for events, built in [next.js](https://github.com/zeit/next.js/), and hosted on [now](https://zeit.co/now).

## Running

To run, you need a salesforce username and login to send the info for. Since all this website really does is send signup info to salesforce, it will fail immediately if the login details aren't provided.

```sh
export SALESFORCE_USER=<salesforce_email>
export SALESFORCE_PASS=<salesforce_pass><salesforce_secret_key> # You need both, it'll look like: pass + secret_key with no space.
yarn dev
```

## Deploying

Deploying is easy. Merge your code into master and it'll get deployed automatically by [travis](https://travis-ci.org/yimbycode/signins) + now. Boom. Done. 
