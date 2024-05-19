# Tribe
A mobile app for a family or any closed group to handle their day-to-day needs.

## Tech Stack
- React Native
- TypeScript
- Ignite (boilderplate, Refer to Ignite@9 rest of the tools & frameworks used) <a href="https://shift.infinite.red/announcing-ignite-9-0-exp-ress-o-89ab5801937d" target="_blank">[↗]</a>
- [React Native DatePicker - react-native-date-picker](https://github.com/henninghall/react-native-date-picker)
- [Bun](https://www.bun.sh)

## Min Versions
Only Android API level >=21 (Android 5), iOS >= 11 are supported.

## Prerequisite
- Install Bun <a href="https://www.bun.sh" target="_blank">[↗]</a>
- Follow react native document to setup Android and iOS development environment. <a href="https://reactnative.dev/docs/environment-setup" target="_blank">[↗]</a>

## Steps to Setup
- Install dependencies `bun install`
- Run `npx pod-install` to install iOS dependencies
- Run Android app in simulator `bun run android` (or)
  Run iOS app in simulator `bun run ios`

## Themes
### colors
Palettes are configured [here](./app/theme/palettes.ts). As of now light & dark theme palettes are configred.
`useColors` hook expoese the colors based on the color scheme of the device.

## Courtesy
- Icons from Freepik.com 
    - <a href="https://www.freepik.com/icon/wallet_4504461#fromView=search&term=wallet+online&track=ais&page=1&position=56&uuid=2f2a87b6-cc3a-4aa6-8ecf-8faf8fd00371">Icon by Superndre</a>
    - <a href="https://www.freepik.com/icon/payment-method_1663219#fromView=search&term=payment&track=ais&page=1&position=64&uuid=1bcdb960-b053-4e54-a129-784d7bb3b49d">Icon by Freepik</a>
    - <a href="https://www.freepik.com/icon/calendar_12127241#fromView=search&term=filter+calendar&track=ais&page=1&position=5&uuid=e10a8b4c-c807-45d4-9521-b93a99de3493">Icon by TravisAvery</a>
    - <a href="https://www.freepik.com/icon/commission_8155668#fromView=search&term=loan&track=ais&page=1&position=16&uuid=07470a9f-13de-4b80-b564-daee4a8c2091">Icon by Freepik</a>
    - <a href="https://www.freepik.com/icon/expenses_5501384#fromView=search&page=1&position=1&uuid=ba4f3dc3-44fe-4ae2-b5c1-f2de022b60c5">Icon by surang</a>
    <a href="https://www.freepik.com/icon/tax_2168671#fromView=search&page=1&position=0&uuid=f6ceadcf-0397-4b05-9a98-b133d04aeb8a">Icon by Freepik</a>