# Blog Project

This is a full-stack blog application where users can create, edit, and manage blogs. The application includes user authentication, profile management, and CRUD functionalities for blogs.

## Features

### 1. Register Interface  
Users can create a new account by providing their details.  

![Register Interface](screenshots/register-interface.png)

---

### 2. Login Interface  
Registered users can log in to access the application's features.  

![Register Interface](screenshots/login-interface.png) 

---

### 3. Main Page  
The main page displays a list of all blogs. Users can browse through the blogs but need to log in to create, edit, or delete blogs.  

![Main Interface](screenshots/main-interface.png) 


---

### 4. Blog Creation Page  
Users can create a new blog by providing a title, summary, image, and content. This feature is accessible only to logged-in users.  

![Create Interface](screenshots/create-interface.png) 


---

### 5. Specific Blog Page  
Displays the full content of a blog post.  
- If the logged-in user is the blog owner, **Edit** and **Delete** buttons appear.  
- Non-owners can only view the blog content.  

**Picture Suggestion**: Add a screenshot of the **specific blog page** with visible **Edit** and **Delete** buttons for the owner.  

---

### 6. Edit Page  
The edit functionality is restricted to the blog owner.  
- Users can update the title, summary, image, and content.  
- Other users cannot access this page.  

**Picture Suggestion**: Include a screenshot of the **edit page** with editable fields pre-filled with existing blog details.  

---

### 7. Profile Page  
Displays user-specific information, including:  
- Profile picture.  
- Options to delete the account or edit the profile picture.  
- **Editing the profile name is not allowed**.  

**Picture Suggestion**: Attach a screenshot of the **profile page**, highlighting the profile picture, delete account button, and edit profile picture option.  

---

## How to Use

### Prerequisites  
- Node.js  
- MongoDB  

### Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/blog-project.git
   ```
2. Navigate to the project folder:  
   ```bash
   cd blog-project
   ```
3. Install dependencies for both frontend and backend:  
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

### Running the Application  
1. Start the backend server:  
   ```bash
   npm run server
   ```
2. Start the frontend development server:  
   ```bash
   cd client
   npm start
   ```

---

## Tech Stack  
- **Frontend**: React  
- **Backend**: Node.js, Express  
- **Database**: MongoDB  
- **Authentication**: JWT  

---

## Screenshots  
Place all the above-mentioned screenshots under a `/screenshots` folder in your repository and reference them in the README using Markdown image syntax:  
```markdown
![Feature Name](screenshots/filename.png)
```

---

This structure makes your README clear and informative, helping users and contributors easily understand and navigate your project.