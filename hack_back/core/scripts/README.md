```markdown
# Meals

**Meals** is an innovative app designed to modernize the meal management process in hostel messes by replacing the traditional coupon system with a digital solution. This app provides a streamlined experience for both students and hostel staff, improving convenience, security, and food management.

## The Problem with the Traditional Coupon System

The traditional coupon system in hostels presents several challenges:

1.  **Inconvenience:** Students must physically go to the hostel off...
2.  **Limited Tracking:** It's difficult to track which meals were consumed and by whom accurately.
3.  **Lack of Transparency:**  It’s hard for staff to see what students are eating.
4. **No Meal History**: There is no record of which meals have been eaten.

## The Solution: A Digital Approach

Our app addresses these issues with a user-friendly digital solution that offers the following benefits:

*   **Real-time Tracking:** Students can easily log their meals, and the system automatically tracks consumption.
*   **Secure Food Management:** Staff can monitor food intake and identify potential issues like overconsumption or misuse of food.
*   **Enhanced Transparency:**  Students and staff can view a detailed meal history for each user.
*   **Simplified Reporting**: Provides clear data on food consumption patterns, aiding in resource allocation and planning.

## Technologies Used

The project utilizes the following technologies:

*   **Flutter:** The primary framework for building the mobile application.
*   **Cloud Firestore:**  A NoSQL cloud database to store user meal data and preferences.
*   **Firebase Authentication:**  For user authentication and authorization.
*   **flutter_animated:** For rendering animated UI elements
*   **QR Code Dart Scan:** For scanning QR codes for efficient food tracking

## Project Structure

The project is structured as follows:

1.  **`lib/`**: Contains the core application logic.
    *   **`src/`**: Contains the business logic and data access layer.
        *   **`adminDash.dart`**: Handles user authentication and authorization, as well as displaying admin dashboard screens.
        *   **`main.dart`**: The main entry point for the application.
    *   **`screens/`**: Contains UI elements (widgets) for different views of the application.
        *   **`login.dart`**: Login screen.
        *   **`register.dart`**: Registration screen.
        *  **`settings.dart`**: Settings screen.
    *   **`utils/`**: Contains helper functions and data transformation logic.
    *   **`widgets/`:** Contains reusable UI components.
        *   **`reusable.dart`**: Reusable UI elements for the app.
        *  **`qr_code_dart_scan.dart`**: For scanning QR Codes to track meals

2. **`lib/graph/`**: Contains data structures and utility functions related to food tracking.
    *   **`indivisualBar.dart`**: Stores data for meal consumption.
    *   **`barData.dart`**: Data structure to hold information about the food consumption.

3.  **`lib/firebase_core/`**: Contains Firebase-related libraries and configurations.
4. **`lib/flutter/`**: Contains Flutter related code, including the main application code.

## Setup Instructions

1.  **Prerequisites:** Ensure you have Flutter installed and configured.
2.  **Clone Repository:** Clone the repository to your local machine: `git clone [repository URL]`
3.  **Navigate into Project Directory:** Change directory into the project folder.
4.  **Install Dependencies:** Run `flutter pub add cloud_firestore firebase_auth`

## Usage Examples

*   **Login:** Open the `login.dart` file and enter your credentials to log in.
*   **Register:** Open the `register.dart` file and provide your details to register a new user.
*   **Settings:** Open the `settings.dart` file and configure your preferences.
*  **Track meals**: Open the `main.dart` and enter meal information into the settings.

## Further Development

Further development of this application can be focused on:

*   Adding more complex data visualization.
*   Integrating with external food delivery services.
*   Implementing a rewards system for consistent user engagement.
*   Improving security features, such as two-factor authentication.