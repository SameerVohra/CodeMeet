# CodeMeet

A collaborative code editor that enables multiple users to work together on a single project in real-time. With integrated video chat and support for compiling code in C, C++, and Python, CodeMeet is designed to enhance collaborative coding experiences.

## Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously, with live updates.
- **Video Chat**: Communicate with collaborators directly within the editor using the integrated video chat feature.
- **Multi-language Code Compiler**: Compile and run code in the following programming languages:
  - C
  - C++
  - Python

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO

## Installation

To get started with CodeMeet, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/SameerVohra/CodeMeet.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd CodeMeet
   ```

3. **Install dependencies**:

   For the backend:

   ```bash
   cd server
   npm install
   ```

   For the frontend:

   ```bash
   cd client
   npm install
   ```

4. **Run the application**:

   Start the backend server:

   ```bash
   cd server
   npm start
   ```

   Start the frontend application:

   ```bash
   cd client
   npm run dev
   ```

   The application should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

1. Open the application in your web browser.
2. Create or join a collaborative session by sharing a unique room code.
3. Use the video chat feature to communicate with your collaborators.
4. Write code in the editor and compile it using the provided options for supported languages.

## Acknowledgements
- [Socket.IO](https://socket.io/) for real-time communication
- [React](https://reactjs.org/) for building the user interface
- [Tailwind CSS](https://tailwindcss.com/) for styling

