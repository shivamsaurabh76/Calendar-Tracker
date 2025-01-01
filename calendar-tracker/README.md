# Calendar Tracker

The Calendar Tracker is a React-based web application designed to help companies track their communications with other organizations. It includes features for setting up companies and their communication parameters, managing user tasks, and optionally generating reports and analytics for better decision-making. The app leverages technologies like TailwindCSS for styling, Zustand for state management, and Recharts for data visualization.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Project Structure](#project-structure)
- [Author](#author)

---

## Features  

### Admin Module  
- **Company Management:**  
  - Add, edit, and delete company information.  
  - Fields include Name, Location, LinkedIn Profile, Emails, Phone Numbers, Comments, and Communication Periodicity.  

- **Communication Method Management:**  
  - Define communication methods with a name, description, sequence, and mandatory flag.  
  - Default methods include:  
    1. LinkedIn Post  
    2. LinkedIn Message  
    3. Email  
    4. Phone Call  
    5. Other  

---

### User Module  
- **Dashboard:**  
  - Grid-like view of all companies with columns for Name, Last Five Communications, and Next Scheduled Communication.  
  - Color-coded highlights:  
    - **Red:** Overdue communication.  
    - **Yellow:** Communication due today.  

- **Interactive Features:**  
  - Hover tooltips displaying notes or comments on past communications.  
  - Multi-select companies for bulk communication updates.  

- **Communication Action:**  
  - Log new communications by selecting type, date, and notes.  
  - Reset highlights (Red or Yellow) upon submission.  

- **Notifications:**  
  - Displays Companies added, updated or deleted by Admin.  

- **Calendar View:**  
  - Visualize past and upcoming communications using a calendar interface.  

---

### Reporting and Analytics Module  
- **Communication Frequency Report:**  
  - Visualize frequency of each communication method used over a selected time frame.  

- **Engagement Effectiveness Dashboard:**  
  - Track response rates and effectiveness of communication methods.  

- **Overdue Communication Trends:**  
  - Trendline displaying overdue communications over time.  

- **Downloadable Reports:**  
  - Export data as PDF or CSV files for offline analysis.  

- **Real-Time Activity Log:**  
  - Live feed of all communication activities sortable by date, user, or company.  

---

## ## Technologies Used  

### Frontend  
- **React 18.3.1** for UI development.  
- **Tailwind CSS 3.4.17** for responsive styling.  
- **Recharts** for data visualization.  

### State Management  
- **Zustand 5.0.2** for lightweight state management.  

### Additional Libraries  
- **React Query** for server-state management.  
- **React Hot Toast** for user notifications.  
- **Date-fns** for date manipulation.  
- **JSPDF and HTML2Canvas** for report generation.  

---

## Setup and Installation

### Prerequisites
- Node.js (v18 or later)
- npm

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/shivamsaurabh76/Calendar-Tracker.git  
   ```

2. Navigate to the project directory:
   ```bash
   cd calendar-tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the application in your browser at `http://localhost:5173`.

---

## Project Structure
```
Calendar-Tracker/
|-- public/
|-- src/
|   |-- components/
|   |   |-- AdminModule.tsx
|   |   |-- CalendarView.tsx
|   |   |-- CommunicationModal.tsx
|   |   |-- Dashboard.tsx
|   |   |-- ErrorBoundary.tsx
|   |   |-- NotificationPanel.tsx
|   |   |-- ReportingModule.tsx
|   |-- hooks/
|   |   |-- useNotification.ts
|   |-- store
|   |   |-- useStore.ts
|   |-- types
|   |   |-- index.ts
|-- App.css
|-- index.css
|-- App.tsx
|-- main.jsx
|-- package.json
|-- README.md
```

## Author

Developed with ❤️ by [Shivam Saurabh](https://github.com/shivamsaurabh76)