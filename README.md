# Praxis Premium Website

This repository contains the source code for the Praxis Premium website. Praxis Premium is a [describe what Praxis Premium is - I will need to fill this in later once I have more information about the product itself].

## File Structure

The project is organized as follows:

- **`.bolt/`**: Configuration files for the Bolt development environment.
- **`public/`**: Contains static assets that are directly served by the web server (e.g., `index.html` before processing by Vite).
- **`src/`**: Contains the main source code for the application.
  - **`assets/`**: (Conventionally for static assets like images, fonts - create if needed or remove if not used)
  - **`components/`**: Contains reusable React components.
    - **`auth/`**: Components related to user authentication.
      - `AuthCard.tsx`
      - `AuthLayout.tsx`
      - `Login.tsx`
      - `SignUp.tsx`
    - **`ui/`**: General-purpose UI components.
      - `BenefitsList.tsx`
      - `CTAButtons.tsx`
      - `CircularProgress.tsx`
      - `FeatureCard.tsx`
      - `FormField.tsx`
      - `Logo.tsx`
      - `MetricCard.tsx`
      - `ProblemCard.tsx`
      - `SectionBadge.tsx`
      - `SectionHeader.tsx`
      - `SocialAuthButtons.tsx`
      - `SocialProof.tsx`
      - `StatsGrid.tsx`
    - `CallToAction.tsx`
    - `FeatureShowcase.tsx`
    - `Footer.tsx`
    - `Header.tsx`
    - `Hero.tsx`
    - `PerformanceScore.tsx`
    - `ProblemStatement.tsx`
    - `SolutionOverview.tsx`
  - **`hooks/`**: Custom React hooks.
    - `useScrollAnimation.ts`
  - `App.tsx`: The main application component, defines layout and routes.
  - `main.tsx`: The entry point of the React application.
  - `index.css`: Global stylesheets.
  - `vite-env.d.ts`: TypeScript definitions for Vite environment variables.
- **`.gitignore`**: Specifies intentionally untracked files that Git should ignore.
- **`eslint.config.js`**: Configuration for ESLint, the JavaScript linter.
- **`index.html`**: The main HTML page that serves as the entry point for the Vite application.
- **`package-lock.json`**: Records the exact versions of dependencies.
- **`package.json`**: Lists project metadata, dependencies, and scripts.
- **`postcss.config.js`**: Configuration for PostCSS.
- **`tailwind.config.js`**: Configuration for Tailwind CSS.
- **`tsconfig.app.json`**: TypeScript configuration specific to the application code.
- **`tsconfig.json`**: Root TypeScript configuration for the project.
- **`tsconfig.node.json`**: TypeScript configuration for Node.js specific parts (like build scripts).
- **`vite.config.ts`**: Configuration file for Vite.
- **`README.md`**: This file, providing information about the project.

This structure separates concerns by grouping components by function (auth, ui, general page components) and keeps configuration files at the root level.

## Features

The Praxis Premium website includes the following features:

- **Hero Section:** A compelling introduction to Praxis Premium.
- **Problem Statement:** Clearly articulates the problem Praxis Premium aims to solve.
- **Solution Overview:** Presents how Praxis Premium addresses the identified problem.
- **Feature Showcase:** Highlights the key features and benefits of the product.
- **Performance Score:** Displays metrics or scores to demonstrate the effectiveness of Praxis Premium.
- **Call to Action:** Encourages users to take the next step (e.g., sign up, learn more).
- **User Authentication:** Allows users to sign up and log in to the platform.
- **Responsive Design:** Ensures a seamless experience across various devices and screen sizes.
- **Scroll Animations:** Engaging animations that trigger on scroll to enhance user experience.

## What We Are Building

This project is building the official marketing and informational website for **Praxis Premium**. The primary goal of this website is to:

- Clearly communicate the value proposition of Praxis Premium.
- Educate potential users about its features and benefits.
- Serve as the primary online presence for the product.
- Drive user acquisition and engagement through clear calls to action and user registration.
- Provide a professional and engaging user experience that reflects the quality of the Praxis Premium product.

*(More specific details about what Praxis Premium itself does will be filled in once that information is available.)*

## Problem We Are Solving

*(This section will require more specific information about the Praxis Premium product itself. The content below is a placeholder and will need to be updated.)*

Praxis Premium aims to address the following pain points and needs for its target users:

- **[Problem 1]:** [Brief description of the first problem Praxis Premium solves]
- **[Problem 2]:** [Brief description of the second problem Praxis Premium solves]
- **[Problem 3]:** [Brief description of the third problem Praxis Premium solves, if applicable]

The website's role in this is to clearly articulate these problems so potential users can quickly identify if Praxis Premium is relevant to their needs.

## How We Are Solving It

*(This section will also require more specific information about the Praxis Premium product itself. The content below is a placeholder and will need to be updated.)*

Praxis Premium provides a comprehensive solution by:

- **[Solution Aspect 1]:** [Brief description of how Praxis Premium addresses Problem 1]
- **[Solution Aspect 2]:** [Brief description of how Praxis Premium addresses Problem 2]
- **[Solution Aspect 3]:** [Brief description of how Praxis Premium addresses Problem 3, if applicable]

This website showcases these solutions through clear explanations, feature demonstrations, and potentially performance metrics, guiding users towards understanding how Praxis Premium can benefit them.

## Running the Project Locally

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd praxis-premium-website
    ```

2.  **Install dependencies:**
    Make sure you have Node.js and npm (or yarn) installed.
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

4.  **Build for production:**
    To create a production build, run:
    ```bash
    npm run build
    # or
    # yarn build
    ```
    The production files will be located in the `dist/` directory.

5.  **Linting:**
    To check for linting errors, run:
    ```bash
    npm run lint
    ```
