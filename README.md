# Pledge to Vote 2026

**Live Site: [pledgetovote2026.com](https://pledgetovote2026.com/)**

A full-stack web application designed to encourage voter participation in the 2026 U.S. Midterm Elections. This project serves as a non-partisan digital hub where users can make a symbolic pledge to vote, view collective progress, and feel part of a national movement.

![Pledge to Vote 2026 Screenshot](https://pledgetovote2026.com/social-share-card.png)

## The Story Behind the Project

In today's political climate, inspiring civic engagement is more important than ever. I wanted to build more than just a portfolio piece; I wanted to create a tool that could have a positive impact. This project was born from the idea that a simple, symbolic act—like making a pledge—can create a powerful sense of community and shared purpose. By visualizing the collective effort of thousands of individuals, the application aims to motivate and empower citizens to make their voices heard.

This project is a demonstration of my ability to build a complete, production-ready application from the ground up, incorporating a dynamic frontend, a robust backend, a database, and real-time features.

## Features

This application is packed with features designed to create an engaging and interactive user experience:

* **Pledge Form:** A clean and simple form for users to pledge to vote by providing their state and zip code. Includes real-time validation to ensure the state and zip code match.
* **Live National Pledge Counter:** The total number of pledges is updated in real-time for all users to see, providing instant feedback and a sense of growing momentum.
* **Interactive Heatmap of the U.S.:** A visually compelling map of the United States that dynamically colors each state based on the number of pledges it has. Hovering over a state reveals a tooltip with its specific pledge count.
* **Dynamic Goal Thermometer:** A progress bar that visually tracks the total number of pledges against a scaling goal, gamifying the experience.
* **Countdown Timer:** An urgent reminder of the time remaining until the 2026 Midterm Elections, counting down the days, hours, minutes, and seconds.
* **Personalized, Sharable Images:** After a user makes a pledge, a custom image is dynamically generated on the server (e.g., "I PLEDGED TO VOTE in Illinois!") for the user to see.
* **Social Media Integration:** When sharing the site link on platforms like X or Facebook, a custom, high-quality "social card" appears, ensuring the shared post is engaging and professional.
* **Live User Count:** A real-time counter shows how many users are currently active on the site, creating a sense of a live, active community.
* **Fully Mobile-Responsive:** The entire application is designed to provide a seamless and intuitive experience on all devices, from desktops to mobile phones.

## Tech Stack

This project was built using a modern, full-stack JavaScript architecture, demonstrating proficiency across the entire development lifecycle.

### Frontend
* **Framework:** React (with Vite for a fast development experience)
* **Styling:** CSS3 with a focus on responsive design using Media Queries.
* **Mapping Library:** `react-simple-maps` and `d3-scale` for the interactive map visualization.
* **Real-time Communication:** `socket.io-client` to connect to the WebSocket server for the live user count.

### Backend
* **Framework:** Node.js with Express for building a robust and scalable REST API.
* **Database:** MongoDB Atlas with Mongoose for elegant data modeling and interaction.
* **Dynamic Image Generation:** The `sharp` library is used on the server to create personalized images on the fly.
* **Real-time Communication:** `socket.io` to manage persistent WebSocket connections and broadcast live data to all connected clients.

### Deployment
* **Hosting:** The frontend (Static Site) and backend (Web Service) are independently deployed and managed on **Render**.
* **Domain:** Custom domain managed through **Namecheap**.

---

This project was a really fun journey in full-stack development, and I'm proud of the result! Thank you for checking it out!