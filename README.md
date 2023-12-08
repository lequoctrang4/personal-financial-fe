# personal-financial-fe

- Financial App Front-End Using TypeScript in React-Native Expo

npm cache clean --force
expo start --clear

npm install -g eas-cli
eas build -p android

<h1>buid android: </h1>

eas build:configure

eas build -p android --profile preview

https://docs.expo.dev/build-reference/apk/

cd android
./gradlew clean
./gradlew :app:bundleRelease

npx expo prebuild --skip-dependency-update react-native,react

APP_ENV=development expo start

"URL": "https://api.personalfinancial.bankhub.dev",
"REDIRECT_URI": "https://internship-bk.com",
"IOS_CLIENT_KEY": "257055393742-o6315qp5560ihv26nhouonskq4ae3drj.apps.googleusercontent.com",
"ANDROID_CLIENT_KEY": "257055393742-aujm3bstpbb2kaibgu0kji81m43q92vg.apps.googleusercontent.com",
"WEB_CLIENT_KEY": "257055393742-81b9n67o0hcgfnn2i73lg04bn3r6ehq1.apps.googleusercontent.com",

npx react-native run-android --variant=release -- --warning-mode all

npx expo run:android --variant release

npx expo run:ios --configuration Release

yarn start -- --reset-cache
npx expo start --no-dev --minify

npx expo customize metro.config.js

release {
            storeFile file('your_key_name.keystore')
            storePassword 'Lequoctrang4'
            keyAlias 'your_key_alias'
            keyPassword 'Lequoctrang4'
            }