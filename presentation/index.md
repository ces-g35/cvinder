---
theme: gaia
_class: lead
paginate: true
class: invert
marp: true
---

# **Cvinder**

Computer Engineering Essential

Group 35 Final Project Report

---

# Contents

- Members
- What is Cvinder?
- Requirements
    - Basic Requirements
    - Challenging Requirements
- Gant chart and Assigned task
- Stack

---

# Contents
- Setup
    - Environment variables
    - Run dev
    - Build production
        - Static only
        - Serve with express

---

# Members

- Supakarin Niansupornpun 6430385121
- Patcharapol Sankaew 6430250021
- Pannawich Lohanimit 6532120621
- Gongpob Phochanasom 6531302321

---

# **What is Cvinder?**

Want to find friends? Use Cvinder to find a match in your Mycourseville class.

A Tinder clone project for finding friends in class is an app that allows students to connect with each other based on shared interests, hobbies, and classes. The app would work similarly to Tinder, where users swipe right to connect with potential matches and swipe left to pass.

---

# Requirements

#### Basic Requirements

- The web application is a Single-page Web Application.
- The users log in to the web application using myCourseVille login.
- The web application help students to find friends in their class and his/her will not study alone they may want friends for group work or ask for help.
- The front-end of the web application does NOT use any libraries/frameworks/plugins other than what was used in Activity 7. Standard Web (JavaScript) APIs that can be used in most modern web browsers without loading additional libraries/frameworks can be used.
---

# Requirements

#### Basic Requirements

- The back-end of the web application does NOT use any libraries/frameworks/plugins other than what was used in Activity 8.
- All members contribute to the development and the contribution of each member is according to a "plan" agreed among the members of the group.

---

# Requirements

#### Challenging Requirements

- The web application displays and interacts with the user nicely on different screen sizes and orientations.
- The application has a nice look and feel GUI.
- The web application has a unique feature enhancing user experience (related to the main goal of the web application) via utilization of Web API.

---

# Stack
- Frontend
    - Failwindcss
    - Naked.js
- Backend
    - Express.js
    - DynamoDB 

---

# Setup

```bash
# install pnpm
npm i -g pnpm

# install dependencies
pnpm install
```

---

# Setup

#### Environment variables

| env | description | example |
|---|---|---|
|PORT| port for running| 3000 |
|NODE_ENV| environment | development |
|AWS_REGION| aws region |ap-southeast-1|
|AWS_ACCESS_KEY_ID| aws access key| None |

---

# Setup

#### Environment variables


| env | description | example |
|---|---|---|
|AWS_SECRET_ACCESS_KEY| aws secret access key | None |
|CLIENT_ID| mcv client | None|
|CLIENT_SECRET| mcv secret client |None |
|URL| host url |127.0.0.1:3000|

---

# Running


```bash
# for development
pnpm dev

# for build static
pnpm build

# for serve static with express
pnpm serve
```
