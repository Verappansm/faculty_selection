# Faculty Course Selection System

A MERN stack application designed to streamline the faculty course selection process. This system allows faculty members to submit their preferences for courses they wish to teach each semester, while considering various constraints and requirements. The system also provides an admin panel to view the selected courses and generate reports.

## Live Demo

- **Frontend** (Vercel): [faculty-selection.vercel.app](https://faculty-selection.vercel.app)
- **Backend** (Render): [faculty-selection-backend.render.com](https://faculty-selection.onrender.com/)

## Features

- **Faculty Dashboard**: 
  - Faculty members can select courses they wish to teach based on their preferences and constraints.
  - Selection of courses is dynamic with real-time feedback on available slots, domains, and selection limits.
  
- **Admin Panel**: 
  - Admins can view the courses selected by each faculty and download reports in Excel format.
  - Detailed analysis of faculty preferences and course selections.
  
- **Automated Constraints Handling**:
  - Faculty members are bound by rules such as the number of courses they can select based on their employee ID and domain constraints.
  - Ensures that no more than 2 courses are selected from a single domain and enforces specific minimum and maximum course selection rules based on faculty IDs.

- **Login System**:
  - Admins and faculty can securely log in to the platform.
  - JWT-based authentication ensures a secure and scalable login mechanism.

## Tech Stack

- **Frontend**:
  - React.js: For building the dynamic user interface.
  - Vercel: For deployment of the frontend.

- **Backend**:
  - Node.js: JavaScript runtime environment.
  - Express.js: Web framework for building the REST API.
  - Render: For hosting the backend.
  - MongoDB: NoSQL database to store faculty and course data, with Mongoose ODM for object modeling.

- **Authentication**:
  - JWT (JSON Web Tokens): Used for secure authentication and authorization of users (faculty and admin).
  
- **State Management**:
  - React State & Context API: For managing application state across components.
  
- **Excel Generation**:
  - XLSX: A library to export data into Excel sheets for faculty course selections and course analytics.


## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/faculty-selection.git
cd faculty-selection
```  

### 2. Install Dependencies
*Backend (API)*
Navigate to the backend directory:

```bash
cd backend
npm install
```

*Frontend*
Navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create a .env file in the root of your backend folder and add the following variables:

```ini
MONGO_URI="your-mongodb-uri"
PORT=5000
REACT_APP_BACKEND_URL="http://localhost:5000"  # For local development
```

### 4. Start the Application
*Backend*
Run the backend server:

```bash
cd backend
node server.js
```

*Frontend*
Run the frontend development server:

```bash
cd frontend
npm start
```

### 5. Access the Application

Visit `http://localhost:3000` in your browser to use the application.

## Future Enhancements  


- AI-based Course Assignment: An AI-powered recommendation system to automatically assign courses to faculty based on their past preferences and qualifications.
- Real-Time Analytics Dashboard: A dashboard that displays the real-time status of course selections and faculty preferences, with options for filtering and sorting.
- Notifications: Integration with email services to send notifications to faculty about their course assignments or any changes to their selections. 

## Contributing  

1. Fork the repo  
2. Create a new branch (`feature-branch`)  
3. Commit changes  
4. Open a pull request  

## License  

MIT License  
