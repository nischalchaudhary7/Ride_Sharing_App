# 🚗 ECU Ride Sharing App

The **ECU Ride Sharing App** is a full-stack web application designed to help students at **East Central University** easily find and share rides in the **Dallas–Fort Worth (DFW)** area. Whether you're a passenger looking for a ride or a driver heading somewhere with extra seats, this app makes it simple to connect, coordinate, and travel together.

This project was built with a focus on real-world usability, featuring smart matching based on location and time, Google Maps integration, a one-to-one chat system, and a fully functional admin panel for approvals, disputes, and emergencies.

---

## 🧩 What This App Can Do

Here’s what makes the ECU Ride Sharing App special:

- Secure Login & Signup  
  Users can sign up as either a **driver** or **passenger** with email/password authentication via Firebase.

- Role-Based Flow  
  After logging in, users select their role. Drivers must be approved by the admin before accessing the full dashboard.

- Google Maps for Location Selection  
  Users can drop pins for pickup and destination locations using Google Maps – improving accuracy and user experience.

-  Post or Request a Ride  
  - **Drivers** can post their ride with details like seats, pickup time, fare, and route.
  - **Passengers** can submit ride requests or search for available rides posted by drivers.

- Real-Time Notifications  
  Passengers and drivers receive instant updates when someone accepts a ride, posts a request, or sends a message.

- One-on-One Chat System  
  Once a ride is confirmed, passengers and drivers can chat directly within the app.

- Fare Estimation and Negotiation  
  Passengers can suggest a fare, and drivers have the option to accept or propose a counter offer.

- Smart Auto-Matching System 
  The app uses logic based on pickup location, destination, time, and seat availability to suggest matches between drivers and passengers.

- Admin Panel 
  Admins can:
  - Approve/reject driver applications
  - View all ride histories
  - Manage disputes, emergency alerts, and user reports
  - Block or review users if needed

- **Ride History and Feedback**  
  All users can view their previous rides and leave ratings or feedback.

- 🆘 **Emergency Contact System**  
  Users can contact admins in emergencies and send their real-time location.

---

## ⚙️ Tech Stack Used

| Technology       | Description                                 |
|------------------|---------------------------------------------|
| **React.js**     | Frontend framework for building UI          |
| **Firebase**     | Backend for authentication & data storage   |
| **Google Maps API** | Location selection and real-time directions |
| **Vite**         | Fast dev server and bundler                 |
| **CSS**          | Styling and layout                          |
| **JavaScript**   | Logic and interactivity                     |

---

## 📁 Project Folder Structure (Simplified)

ECU_Ridesharing_App/
├── Ride_app/
│ ├── src/
│ │ ├── pages/ # Dashboard, Login, Signup, Ride Requests, etc.
│ │ ├── components/ # Navbar, Sidebar, Cards, Buttons, etc.
│ │ ├── admin/ # Admin panel and admin-only views
│ │ ├── services/ # Firebase and helper functions
│ │ └── context/ # Global state (Auth, Roles)
│ ├── App.jsx
│ ├── main.jsx
│ ├── App.css / index.css
│ ├── .env # Firebase credentials (not uploaded)
├── .gitignore
├── README.md 
├── vite.config.js
├── package.json

yaml

---

## 🚀 Getting Started Locally

### 1. Clone the Repo

git clone https://github.com/nischalchaudhary7/Ride_Sharing_App.git
cd Ride_Sharing_App

2. Install All Dependencies

npm install

3. Set Up Firebase
Create a Firebase project from https://console.firebase.google.com

Enable Authentication (Email/Password)

Set up a Cloud Firestore database

Now create a .env file in the root and paste your Firebase credentials like this:

ini

VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id

4. Start the App

npm run dev
You’re good to go!


👨‍💻 About the Developer
Hi! I’m Nischal Chaudhary, a passionate software developer and student at East Central University. I love solving real-world problems with tech, and this ride-sharing app was designed to make daily transportation easier for our university community.

📬 Email: nischalc75@gmail.com

🔗 GitHub: @nischalchaudhary7

📄 License
This project is released under the MIT License. Feel free to fork, improve, and use it – just give credit where it’s due!

🤝 Want to Contribute?
Pull requests are welcome!
If you spot bugs or have suggestions, feel free to open an issue.
