# Jobing.az (Cyprus Branch) - AI Development Guide

## Project Overview

This is the **Cyprus-specific** branch of the Jobing.az platform. 
This branch operates purely on **Node.js (Express.js)** and is entirely independent of the .NET rewrite. 
It will **never be merged** with the main Azerbaijan or .NET branches, as it serves a different country with different geographical data, integrations, and language requirements.

## Tech Stack

*   **Backend:** Node.js, Express.js (ES Modules)
*   **Database:** MongoDB (via Mongoose)
*   **Templating:** EJS
*   **Styling:** TailwindCSS
*   **Architecture:** MVC Pattern (`src/Controllers`, `src/Models`, `src/Views`, `src/Routes`)

## Key Rules & Guidelines for Cyprus Branch

1.  **Localization & Geography:**
    *   Do not use Azerbaijan cities (Baku, Ganja, etc.) or Azerbaijani job boards.
    *   All new logic regarding geography must reflect **Cyprus** (Nicosia, Limassol, Larnaca, Paphos, etc.).
    *   Default languages may shift from `az` to `tr`, `en`, or `el` depending on the user's future requests. Keep `i18n` logic flexible.
2.  **Architecture & Coding Standards:**
    *   This is an Express MVC app. Do not attempt to enforce .NET Clean Architecture rules here.
    *   Use modern JavaScript (ES6+), async/await, and ES modules (`import`/`export`).
    *   Keep Controllers thin; move heavy business logic or API integrations to `src/Services/` or `src/Helpers/`.
3.  **No .NET:**
    *   The `dotnet` folder has been removed. Do not write or suggest C# code.
4.  **Automation & Scrapers:**
    *   The background jobs (cron) located in `src/Helpers/Automation.js` currently target `.az` sites. Any modifications to automation must target Cyprus-specific endpoints or job boards as requested by the user.

## Code Generation Guidelines

*   Write clean, self-documenting code.
*   Preserve existing EJS structures unless explicitly asked to redesign.
*   Avoid adding unnecessary abstractions.
*   Do not modify `Enums.js` or `Locales` without considering the Cyprus context.
