# 🔬 LabTrack

LabTrack is a web-based platform that streamlines collaboration between students and professors — from discovering and applying for research openings to tracking progress and showcasing completed work.

---

## 🚀 Features

* 🔐 Secure user authentication (Register / Login / Forgot Password)
* 👤 Role-based profiles (Student / Professor)
* 📤 Resume & document upload support
* 🔬 Research Opportunity Board with live search and filters
* 📝 Student application system with SOP submission
* 📋 Professor-side application review and status management
* 📁 Resource Vault for project files and materials
* 📊 Milestone & Progress Dashboard
* 🏆 Showcase Wall for completed research
* 🔔 Real-time Notification Center
* 📧 Automated email notifications via Nodemailer
---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas, Mongoose
* **Frontend:** EJS, Bootstrap, jQuery, React, AngularJS
* **File Uploads:** Multer
* **Authentication:** Express Sessions, bcrypt
* **Email:** Nodemailer

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pracooljain/labtrack
cd labtrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add:

```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
EMAIL=your_email
EMAIL_PASS=your_app_password
PORT=3000
```
### 4. Create required folders
```
public/uploads/resumes/
```

### 5. Run the application
```bash
node app.js
```

### 6. Access the app
```
http://localhost:3000
```
---

## 📁 Project Structure

```
labtrack/
├── models/        # Mongoose schemas
├── routes/        # Express route handlers
├── views/         # EJS templates
├── public/        # Static assets (CSS, JS, uploads)
├── middleware/    # Auth middleware
├── config/        # DB connection and mailer
└── app.js         # Application entry point
```

---

## 🔐 Security

* Sensitive data stored in `.env` (not tracked in Git)
* Passwords hashed using bcrypt
* Session-based authentication with MongoDB session store

---

## 👥 Contributors

* Prakul Jain
* Agrani Anupam
* Rahul Geboy

---

## 📌 Future Enhancements

* Real-time notifications using WebSockets
* Enhanced admin analytics dashboard
* Mobile-responsive improvements

---

## 📄 License
 using WebSockets
* Enhanced admin analytics dashboard
* Mobile-responsive improvements

---

## 📄 License
 using WebSockets
* Enhanced admin analytics dashboard
* Mobile-responsive improvements

---

## 📄 License

This project is intended for academic and learning purposes.
