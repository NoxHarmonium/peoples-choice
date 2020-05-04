![peoples-choice logo](public/logo.png?raw=true "people's choice")

[![Deploy to Vercel](https://vercel.com/button)](/import/project?template=https://github.com/noxharmonium/peoples-choice/tree/master/)

## Summary

Feeling grateful? Want to recognise a colleague?

People's Choice is a web application that
lets people vote for their colleagues.

## Requirements

### G Suite

The candidates are pulled from G Suite via the [Admin SDK](https://developers.google.com/admin-sdk/directory).

If your workplace uses G Suite
(likely if you read your work emails via the Gmail interface)
then you are probably good to go.

### Google Cloud Project

Create a Google Cloud project and do the following:

- Activate the Admin SDK (https://developers.google.com/admin-sdk/directory)
- Create an OAuth client ID and record the secret
  - Application Type: Web Application
  - Authorised JavaScript origins
    - http://localhost:3000
    - https://<project_name>.now.sh
  - Authorised redirect URIs
    - http://localhost:3000/api/token
    - https://<project_name>/api/token
- Export the client ID as the API_CLIENT_ID environment variable
- Export the secret as the the API_CLIENT_SECRET environment variable

### DynamoDB Table

- Create a DynamoDB table in AWS with a partition key called "email" with type "string
- Export the name of the DynamoDB table as the DYNAMO_USER_TABLE_NAME environment variable
- Create an IAM user for your application and export the access key and secret as the "AWS_ACCESS_KEY_ID\_" and "AWS_SECRET_ACCESS_KEY\_" environment variables. Note the trailing underscores which are needed to avoid conflicting with variables exposed by the Vercel deployment.

## Development

Hot reload for local development:

```
$ yarn dev
```

To analyse build size:

```
$ ANALYZE=true yarn build
```

## Environment Variables

```
export API_CLIENT_ID="11111-xxxxx.apps.googleusercontent.com"
export API_CLIENT_SECRET="some secret"
export JWT_SECRET="some random secret"
export DIRECTORY_DOMAIN="mycorp.com.au"
export EXCLUDED_EMAILS="hello@mycorp.com.au"
export ADMIN_EMAILS="elpresedente@mycorp.com.au"
export MAX_VOTES="3"
export WORKPLACE_NAME="My Corp"
export OBFUSTICATION_PEPPER="QmAyxZJv6EM85EBW79aXPkt^N"

export DYNAMO_USER_TABLE_NAME="PeoplesChoiceUserTable"

export AWS_ACCESS_KEY_ID_=SOME_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY_=SOME_SECRET_ACCESS_KEY
export AWS_REGION_=ap-southeast-2
```

## Thanks

- Theming shamelessly copied and modified from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/premium-themes/onepirate
- Confetti https://unsplash.com/photos/Xaanw0s0pMk Photo by Jason Leung on Unsplash
- Fireworks https://unsplash.com/photos/WPTHZkA-M4I Photo by Erwan Hesry on Unsplash
- Trophy - https://unsplash.com/photos/_XTY6lD8jgM Photo by Giorgio Trovato on Unsplash
- Multiple-trophys - https://pixabay.com/photos/trophies-show-award-trophy-prize-710169/ Image by Vilve Roosioks from Pixabay
- Trophy Clip Art for Banner Logo https://freesvg.org/golden-trophy-with-glaze-vector-clip-art By OpenClipart
