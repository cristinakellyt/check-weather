# Check Weather

This is an in-progress project where I used Vue3.js to create an application where the user can see the weather information of a location by searching it by name. It also allows users to save cities and view their current weather on the home page.

## Table of contents

- [Overview](#overview)
  - [Expected Behaviour](#expected-behaviour)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
- [Project Setup](#project-setup)

## Overview

### Expected Behaviour

- General
  -The user should be able to search for a city and receive suggestions based on what it was typed in search bar
  -The user can see how the app works by clicking in the info icon based on the top right header
  -When one city is selected, the app redirects the user to the view of the weather information and forecast
  -When plus icon is clicked, it means the user can track this city, so a card with current weather information is added in the home page
  -It is possible to remove the tracked city from the list by clicking in the remove button in the end of the weather view page

### Links

- Live Site URL: [https://ck-check-weather.netlify.app/](https://ck-check-weather.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- Tailwind CSS
- Vue3.js
- Typescript
- Pinia
- Local Storage
- Axios

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```
