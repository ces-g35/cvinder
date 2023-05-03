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
- Gantt chart and Assigned task
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

<style scoped> 
li {
    font-size: 28px;
}
</style>

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

| env               | description      | example        |
| ----------------- | ---------------- | -------------- |
| PORT              | port for running | 3000           |
| NODE_ENV          | environment      | development    |
| AWS_REGION        | aws region       | ap-southeast-1 |
| AWS_ACCESS_KEY_ID | aws access key   | None           |

---

# Setup

#### Environment variables

| env                   | description           | example        |
| --------------------- | --------------------- | -------------- |
| AWS_SECRET_ACCESS_KEY | aws secret access key | None           |
| CLIENT_ID             | mcv client            | None           |
| CLIENT_SECRET         | mcv secret client     | None           |
| URL                   | host url              | 127.0.0.1:3000 |

---

<style scoped>
table {
    font-size: 18px;
}
table th:first-of-type {
    width: 10%;
}
table th:nth-of-type(2) {
    width: 12%;
}

</style>

# Gantt Chart

<!-- http://localhost:8000/presentation/index.html#13 -->

| Task              | Assignee   |  20   |  21   |  22   |  23   |  24   |  25   |  26   |  27   |  28   |  29   |  30   |   1   |   2   |   3   |
| ----------------- | ---------- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Authentication    | Peam       |       |   X   |   X   |       |       |       |       |       |       |       |       |       |       |       |
| Chat              | Tar        |       |       |       |       |       |       |       |       |   X   |   X   |   X   |       |       |       |
| Match             | Peam       |       |       |   X   |   X   |   X   |   X   |   X   |       |       |       |       |       |       |       |
| Chat/Conversation | Tar        |       |       |       |   X   |   X   |   X   |   X   |   X   |       |       |       |       |       |       |
| Chat/Overview     | Tar        |       |       |       |       |       |   X   |   X   |   X   |   X   |       |       |       |       |       |
| Home page         | Meen       |       |   X   |   X   |       |       |       |       |       |       |       |       |       |       |       |
| Register / Login  | Meen       |       |       |   X   |   X   |       |       |       |       |       |       |       |       |       |       |
| Profile           | Gong       |   X   |   X   |   X   |   X   |   X   |   X   |   X   |       |       |       |       |       |       |       |
| Test & Fix bugs   | Everyone   |       |       |       |       |       |       |       |       |   X   |   X   |   X   |   X   |   X   |   X   |
| Deployement       | Everyone   |       |       |       |       |       |   X   |   X   |   X   |   X   |   X   |   X   |   X   |   X   |   X   |
| Documentations    | Tar & Peam |       |       |       |       |       |       |       |       |       |       |   X   |       |       |       |
| Presentaion       | Tar & Peam |       |       |       |       |       |       |       |       |       |       |       |   X   |       |       |

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
