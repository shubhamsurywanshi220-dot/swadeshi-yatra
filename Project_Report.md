# Swadeshi Yatra - Technical Project Report

---

## TABLE OF CONTENTS
| Section | Particulars | Page No. |
| :--- | :--- | :--- |
| **1.** | **INTRODUCTION** | **1** |
| 1.1 | Introduction | 1 |
| 1.2 | Need for the System | 2 |
| 1.3 | Project Description | 2 |
| 1.4 | Objectives of the Project | 3 |
| 1.5 | Scope of the Project | 3 |
| **2.** | **LITERATURE SURVEY** | **4** |
| 2.1 | Existing and Proposed System | 4 |
| 2.2 | Feasibility Study | 6 |
| 2.3 | Tools and Technologies Used | 7 |
| 2.4 | Hardware and Software Requirements | 9 |
| **3.** | **SOFTWARE REQUIREMENT SPECIFICATION** | **10** |
| 3.1 | Users | 10 |
| 3.2 | Functional Requirements | 12 |
| 3.3 | Non-Functional Requirements | 13 |
| **4.** | **SYSTEM DESIGN** | **15** |
| 4.1 | System Architecture | 15 |
| 4.2 | Database Design | 16 |
| 4.3 | Context Diagrams | 18 |
| **5.** | **DETAILED DESIGN** | **19** |
| 5.1 | Data Flow Diagram (DFD) | 19 |
| 5.2 | Activity Diagram | 20 |
| 5.3 | Use Case Diagram | 22 |
| 5.4 | Sequence Diagram | 23 |
| **6.** | **IMPLEMENTATION** | **25** |
| 6.1 | Project Structure | 25 |
| 6.2 | Key Code Snippets | 26 |
| 6.3 | Screen Descriptions | 35 |
| **7.** | **SOFTWARE TESTING** | **40** |
| 7.1 | Unit Testing | 40 |
| 7.2 | Automation/Integration Testing | 41 |
| 7.3 | Test Cases | 41 |
| **8.** | **CONCLUSION** | **43** |
| **9.** | **SCOPE FOR PHASE-II** | **45** |
| **10.** | **BIBLIOGRAPHY** | **47** |
| **11.** | **APPENDIX A: USER MANUAL** | **48** |
| **12.** | **APPENDIX B: SDG COMPLIANCE** | **51** |
| **13.** | **APPENDIX C: WORK BREAKDOWN STRUCTURE** | **53** |
| **14.** | **APPENDIX D: PLAGIARISM REPORT** | **57** |

---

## 1. INTRODUCTION

### 1.1 Introduction
India is a land of immense cultural diversity and historical significance. However, most modern travel applications prioritize heavily commercialized tourist hubs, often leaving indigenous cultures, rural artisans, and eco-friendly initiatives in the shadows. **Swadeshi Yatra** is a digital initiative built to bridge this gap. It serves as a comprehensive travel companion that emphasizes "Vocal for Local" by guiding travelers toward hidden gems and local businesses while ensuring their safety and promoting sustainability.

### 1.2 Need for the System
The modern traveler seeks authenticity, yet finding reliable information about rural destinations or local artisans is difficult.
- **Support for Local Economy**: Mainstream apps take high commissions or only list large hotel chains. Swadeshi Yatra focuses on small-scale local businesses.
- **Safety Concerns**: Solo travelers often lack an integrated emergency response system when visiting remote "Swadeshi" locations.
- **Eco-Consciousness**: There is no centralized platform that specifically tiers locations based on their "Eco-Friendly" practices in the Indian context.

### 1.3 Project Description
The project is a full-stack solution comprising:
1.  **Mobile Application**: Built with React Native (Expo) for cross-platform availability. It features a rich, dark-themed UI and specialized navigation for a premium user experience.
2.  **Backend API**: A Node.js and Express server that handles complex filtering, user authentication, and safety logs.
3.  **Database**: A MongoDB instance storing vast amounts of data on tourist spots, reviews, and emergency contacts.

### 1.4 Objectives of the Project
- **Digital Empowerment**: Bring local artisans and heritage sites into the mainstream digital economy.
- **Safety Integration**: Provide an instant SOS feature that captures real-time location.
- **Sustainable Tourism**: Implementation of "Eco-Badges" to incentivize sustainable travel.
- **Advanced Discovery**: Develop search capabilities filtered by State, City, and Specific Category (e.g., Forts, Temples, Beaches).

### 1.5 Scope of the Project
The current implementation (Phase I) covers core directory features, user profiles, favorites, SOS alerts, and a review system. It establishes the technical foundation for future AI-driven expansions.

---

## 2. LITERATURE SURVEY

### 2.1 Existing and Proposed System
- **Existing Systems**: Platforms like Google Maps or TripAdvisor are broad but lack specialized focus on "Swadeshi" values. Small businesses often get buried under sponsored results.
- **Proposed System**: Swadeshi Yatra removes commercial bias. It categorizes places based on cultural significance and eco-impact. It introduces a manual navigation helper to bypass common mobile app crashes, ensuring high reliability for travelers.

### 2.2 Feasibility Study
- **Technical Feasibility**: The MERN stack (MongoDB, Express, React, Node) provides the necessary flexibility for rapid updates and high traffic.
- **Economic Feasibility**: By using open-source frameworks and scalable cloud databases (MongoDB Atlas), the operational cost remains minimal compared to traditional legacy systems.
- **Operational Feasibility**: The system is designed with a low learning curve, making it accessible to both young tech-savvy travelers and older cultural tourists.

### 2.3 Tools and Technologies Used
- **Frontend Layer**: React Native (0.81), Expo (v54), Axios for network requests.
- **Logic Layer**: Node.js, Express.js.
- **Data Layer**: MongoDB, Mongoose (ODM).
- **Styling**: Vanilla CSS concepts applied to Native StyleSheets, dynamic ThemeContext for dark/light mode parity.

### 2.4 Hardware and Software Requirements
- **Development Hardware**: Minimum 8GB RAM, Duo Core Processor (i5 recommended for emulators).
- **Deployment Platform**: Linux-based server (Render/Vercel) for backend, Expo Go for mobile testing.

---

## 3. SOFTWARE REQUIREMENT SPECIFICATION (SRS)

### 3.1 Users
- **Standard Traveler**: Browses places, adds reviews, saves favorites, and triggers SOS.
- **Local Business (Future Role)**: Manages their specific listing and artisan profile.
- **System Admin**: Moderates reviews and updates the directory of hidden gems.

### 3.2 Functional Requirements
1.  **Smart Directory**: Dynamic filtering by State/City/Category.
2.  **SOS Module**: One-tap emergency contact functionality.
3.  **Authentication**: Secure login and registration (JWT-based).
4.  **Community Feedback**: Star ratings and text reviews for every location.
5.  **Local Persistence**: Saving user preferences and favorites for offline reference.

### 3.3 Non-Functional Requirements
- **Performance**: Directory search results must populate within 500ms.
- **Security**: Passwords must be hashed using industry-standard salts.
- **Usability**: The app must maintain a consistent "Premium" aesthetic with micro-animations.

---

## 4. SYSTEM DESIGN

### 4.1 System Architecture
We follow a **Layered Architecture**:
1.  **Presentation Layer**: React components handling user interactions.
2.  **Application Layer**: Express routes managing the business logic (e.g., filtering logic).
3.  **Data Layer**: MongoDB storing core entities.

### 4.2 Database Design
- **Users**: `{ name, email, favorites: [PlaceID], visitHistory: [...] }`
- **Places**: `{ name, coordinates, category, ecoScore, description, images }`
- **Reviews**: `{ placeID, author, rating, text, timestamp }`

---

## 5. DETAILED DESIGN

### 5.1 Data Flow Diagram (DFD)
- **Level 0**: Shows the user interacting with the Swadeshi Yatra system as a single entity.
- **Level 1**: Breaks down flows between the Directory, Review System, and SOS Controller.

### 5.2 Activity Diagram
- **Search Activity**: Start -> Input Query -> Backend Filter -> Result found? (Yes: Show List, No: Show Placeholder) -> End.
- **SOS Activity**: Trigger -> Capture GPS -> Log to Server -> Notify Emergency Contacts -> End.

### 5.3 Use Case Diagram
Includes actors like "Traveler" and "Local Vendor" with use cases: `Browse Directory`, `Rate Place`, `Trigger SOS`, `Manage Profile`.

---

## 6. IMPLEMENTATION

### 6.1 Project Structure
- `/backend`: Scalable REST API.
- `/mobile`: React Native source code with atomic component structure (`/components`, `/screens`, `/context`).

### 6.2 Key Code Snippets
The core of the app uses a **Manual Navigation Helper** to ensure stability:
```javascript
const navigation = {
  navigate: (screen, params) => {
    setRouteParams(params);
    setCurrentScreen(screen);
  }
};
```

---

## 7. SOFTWARE TESTING

### 7.1 Unit Testing
Testing of individual Model schemas (Place.js, User.js) to ensure data integrity during database writes.

### 7.2 Automation Testing
Integration tests between the Axios client in the mobile app and the local Express server endpoints.

### 7.3 Test Cases
| ID | Requirement | Input | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC1 | Filters | City: "Jaipur" | Only places in Jaipur shown | Passed |
| TC2 | SOS | Click SOS | Location logged & Alert sent | Passed |
| TC3 | Login | Correct Credentials | Redirect to Home | Passed |

---

## 8. CONCLUSION
Swadeshi Yatra successfully combines modern technology with traditional Indian values. It provides a reliable, safe, and sustainable way for travelers to explore India while directly supporting the local "Swadeshi" economy.

---

## 9. SCOPE FOR PHASE-II
- **Augmented Reality (AR)**: Virtual tours of historical sites.
- **AI Itinerary Planner**: Personalized travel plans based on user "Eco-scores".
- **Multilingual Support**: Making the app available in major Indian regional languages.

---

## 10. BIBLIOGRAPHY
- React Native Documentation (reactnative.dev)
- MERN Stack Best Practices (MongoDB.com)
- Government of India Tourism Guidelines (IncredibleIndia.org)

---

## 11. APPENDIX A: USER MANUAL
1.  **Installation**: Open Expo Go and scan the project QR code.
2.  **Exploring**: Go to the "Explore" tab to filter by state and category.
3.  **Eco-Friendly**: Look for the green badge to find sustainable options.
4.  **SOS**: Access the red SOS icon in any major screen for emergency help.

---

## 12. APPENDIX B: SDG COMPLIANCE
Swadeshi Yatra aligns with the United Nations Sustainable Development Goals:
- **Goal 8**: Decent Work and Economic Growth (by supporting local businesses).
- **Goal 12**: Responsible Consumption and Production (by promoting eco-friendly travel).

---

## 13. APPENDIX C: WORK BREAKDOWN STRUCTURE (WBS)
- **Phase 1**: Requirements Gathering & UI Mockups.
- **Phase 2**: Backend API & Database Setup.
- **Phase 3**: Core Feature Integration (SOS, Directory).
- **Phase 4**: Testing & Project Report Formulation.

---

## 14. APPENDIX D: PLAGIARISM REPORT
*(Placeholder: Content verified for original implementation by the development team)*
