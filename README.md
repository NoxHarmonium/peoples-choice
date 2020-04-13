# agile-peoples-choice

## Development

Hot reload for local development:

```
$ yarn dev
```

## Environment Variables

```
export API_CLIENT_ID="11111-xxxxx.apps.googleusercontent.com"
export API_CLIENT_SECRET="some secret"
export API_REDIRECT_URI="http://localhost:${PORT:-3000}/api/token"
export JWT_SECRET="some random secret"
export DIRECTORY_DOMAIN="mycorp.com.au"
export EXCLUDED_EMAILS="hello@mycorp.com.au"
export ADMIN_EMAILS="elpresedente@mycorp.com.au"
export MAX_VOTES="3"
export WORKPLACE_NAME="My Corp"

export DYNAMO_USER_TABLE_NAME="PeoplesChoiceUserTable"
export DYNAMO_LEDGER_TABLE_NAME="PeoplesChoiceLedgerTable"

export AWS_ACCESS_KEY_ID_=SOME_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY_=SOME_SECRET_ACCESS_KEY
export AWS_REGION_=ap-southeast-2
```

## TODO

- Obfuscate votes
- Clean up very rough code (add linting etc.)

## Thanks

- Theming shamelessly copied and modified from: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/premium-themes/onepirate
- Confetti https://unsplash.com/photos/Xaanw0s0pMk Photo by Jason Leung on Unsplash
- Fireworks https://unsplash.com/photos/WPTHZkA-M4I Photo by Erwan Hesry on Unsplash
- Trophy - https://unsplash.com/photos/_XTY6lD8jgM Photo by Giorgio Trovato on Unsplash
- Multiple-trophys - https://pixabay.com/photos/trophies-show-award-trophy-prize-710169/ Image by Vilve Roosioks from Pixabay
