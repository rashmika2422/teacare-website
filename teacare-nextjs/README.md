# Teacare Events Pvt. Ltd. - Corporate Website

Welcome to the Teacare Events website repository. This is a premium, high-performance web application built with **Next.js** (React) and styled with modern, custom CSS utilizing advanced JavaScript `IntersectionObserver` animations.

This website is specifically designed for high-end corporate event planning, featuring a dark-themed aesthetic with vibrant golden-orange (`#f39c12`) accents and deep gray (`#0f141c`) backgrounds.

---

## 🏗️ Project Structure & Component Breakdown

This project is component-driven. Below is a guide to help any developer or administrator understand what each part of the codebase does:

### 1. `app/` Directory (Pages & Routing)
Next.js uses the App Router. Every folder inside `app/` represents a route (page) on the website.
*   **`app/page.tsx`**: The **Main Landing Page**. This file imports and stacks all the core sections (Hero, About summary, Experience, Services, Gallery, Estimator, Testimonials).
*   **`app/about/page.tsx`**: The **Dedicated About Us Portal**. A separate page detailing the company's history, milestones, and corporate philosophy. Features a beautiful multimedia canvas layout.
*   **`app/contact/page.tsx`**: The **Dedicated Contact Us Portal**. A separate page for the executive communication suite, including contact forms and location details.
*   **`app/admin/page.tsx`**: The **Admin Portal**. (Currently a structural shell) intended for internal management.
*   **`app/globals.css`**: The **Global Stylesheet**. Contains all the custom CSS, responsive breakpoints, particle keyframes, and advanced gradient overlays used across the entire site. No external heavy CSS libraries like Tailwind are used; it's purely bespoke CSS for maximum performance and design control.
*   **`app/layout.tsx`**: The **Root Layout**. Wraps every page, ensuring global fonts (Playfair Display, Poppins) and FontAwesome icons are loaded everywhere.

### 2. `components/` Directory (UI Building Blocks)
These are reusable pieces of the website imported into the pages above.
*   **`AnimUtils.tsx`**: The core animation engine. Contains the `useScrollReveal` hook and `SectionHeading` component that powers the staggered fade-in and slide-up effects when a user scrolls down the page.
*   **`Header.tsx`**: The top navigation bar. It includes logic to change its background from transparent to solid when the user scrolls down, and handles mobile menu toggling.
*   **`Hero.tsx`**: The massive introductory section on the home page. Features dynamic floating gold particles, mouse parallax (the background shifts slightly when you move the mouse), and animated number counters (e.g., 150+ Events).
*   **`About.tsx`**: The brief summary of the company shown on the home page, featuring animated value chips.
*   **`Experience.tsx`**: The statistics dashboard on the home page. Includes progressive animated bars to show metrics like "99.8% Punctuality".
*   **`Services.tsx`**: The core offerings section. It displays interactive cards that open a beautiful blurred modal when clicked. It also contains the **Visual Excellence** video/image showcase grid.
*   **`Gallery.tsx`**: The 3D perspective gallery. When you hover over the event showcases, the cards physically tilt (rotateX/Y) based on your mouse position.
*   **`Estimator.tsx` & `Appointment.tsx`**: Interactive forms allowing clients to calculate rough event costs and book calendar slots.
*   **`Testimonials.tsx`**: Client reviews displayed in an elegant grid.
*   **`Contact.tsx`**: The layout containing the contact form and contact details (phone, email, hours).
*   **`Footer.tsx`**: The bottom copyright banner and social media links.

### 3. `public/assets/images/` Directory
Contains all the high-quality JPG, PNG, and MP4 files used for the website's backgrounds, galleries, and multimedia sections.

---

## 🔗 How to Link Social Media Icons (Facebook, Instagram, LinkedIn, Twitter)

If you need to update the social media icons at the bottom of the website to point to your actual company profiles, follow these steps:

1.  Open the file: **`components/Footer.tsx`**
2.  Look for this block of code around **Line 6**:
    ```javascript
    {['facebook', 'instagram', 'linkedin', 'twitter'].map(s => (
      <a key={s} href="#" style={{ ... }}>
        <i className={`fa-brands fa-${s}`} />
      </a>
    ))}
    ```
3.  Currently, the links are generated automatically from an array and all point to `href="#"`. To add real links, replace that block of code with individual `<a>` tags for each platform like this:

    ```javascript
    {/* Replace the .map() function with this explicit structure */}
    
    <a href="https://www.facebook.com/your-facebook-page" target="_blank" rel="noopener noreferrer" style={{ /* keep existing styles here */ }}>
      <i className="fa-brands fa-facebook" />
    </a>
    
    <a href="https://www.instagram.com/your-instagram-profile" target="_blank" rel="noopener noreferrer" style={{ /* keep existing styles here */ }}>
      <i className="fa-brands fa-instagram" />
    </a>
    
    <a href="https://www.linkedin.com/company/your-company-page" target="_blank" rel="noopener noreferrer" style={{ /* keep existing styles here */ }}>
      <i className="fa-brands fa-linkedin" />
    </a>
    
    <a href="https://twitter.com/your-twitter-handle" target="_blank" rel="noopener noreferrer" style={{ /* keep existing styles here */ }}>
      <i className="fa-brands fa-twitter" />
    </a>
    ```
    *Note: Adding `target="_blank"` and `rel="noopener noreferrer"` is best practice to ensure the link opens in a new tab safely.*

---

## 🖼️ How to Change Images (e.g., "Our Crew" Photo)

If you want to swap out images like the "Our Crew" team photo in the About Us portal, follow these steps:

1.  **Add Your New Image to the Project**:
    *   Find the new image you want to use (e.g., `new-team-photo.jpg`).
    *   Copy that image into your project's images folder located exactly here: `public/assets/images/`

2.  **Open the Relevant Code File**:
    *   For the "Our Crew" photo, open `app/about/page.tsx` in your code editor.

3.  **Find the Image Filename in the Code**:
    *   Search for the `div` with the class name `"crew-bg"`. Inside that `div`, you will see this line containing the current image filename:
        ```javascript
        backgroundImage: "url('/assets/images/fb4242ad-7e56-48ec-9ba2-8a8b0981f3fb.JPG')"
        ```

4.  **Swap the Filename**:
    *   Delete the old filename and type in the exact name of your new image file. It should look like this:
        ```javascript
        backgroundImage: "url('/assets/images/new-team-photo.jpg')"
        ```
5.  Save the file and refresh your browser. The new image will instantly appear inside the styled container with all gradients intact!

---

## 📝 How to Change Text Anywhere on the Site

Because this website is built with Next.js (React), different parts of the website are split into different files called **Components**.

1.  **Locate the Component File**: Open the file corresponding to the section you want to edit:
    *   **Top Banner / Hero Text**: `components/Hero.tsx`
    *   **"Corporate Hospitality" Summary**: `components/About.tsx`
    *   **Stats (e.g., 99.8% Punctuality)**: `components/Experience.tsx`
    *   **Service Offerings**: `components/Services.tsx`
    *   **Event Showcases**: `components/Gallery.tsx`
    *   **Interactive Event Planner**: `components/Estimator.tsx`
    *   **Client Reviews**: `components/Testimonials.tsx`
    *   **Footer Details**: `components/Footer.tsx`
    *   **About Us Portal text**: `app/about/page.tsx`
    *   **Contact Portal text**: `app/contact/page.tsx`

2.  **Search for the Text**:
    *   Press **`Cmd + F`** (Mac) or **`Ctrl + F`** (Windows) to open the search bar in your code editor.
    *   Type in the exact text you want to change (e.g., search for *"Extraordinary Events"*).

3.  **Edit the Text Safely**:
    *   Carefully delete the old text and type your new text.
    *   **Rule 1**: Do not delete the HTML/React tags (e.g., only change the text *between* `<h1>Old Text</h1>` to `<h1>New Text</h1>`).
    *   **Rule 2**: If the text is inside quotes (like `desc: 'Some description here'`), make sure you leave the `'` quotes intact on the outside.
    *   **Rule 3**: If you need to type an apostrophe (like in the word "company's"), it is best to type it as `&apos;` in the code, or wrap the whole sentence in double quotes `""`.

4.  Save the file. The development server will automatically detect the changes, and you will see your new text in the browser immediately!

---

## 🚀 How to Run the Project Locally

1. Open your terminal and navigate to the project directory:
   `cd /Users/rashmika/Documents/Teacare_website/teacare-nextjs`
2. Install dependencies (if you haven't already):
   `npm install`
3. Start the development server:
   `npm run dev`
4. Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

## 📦 How to Build for Production

When you are ready to host the website (e.g., on Vercel, Netlify, or a custom server):
1. Run the build command:
   `npm run build`
2. Start the production server:
   `npm start`

---

## 🛠️ Recent Implementations & Maintenance (July 2026)

The following major updates and fixes were recently applied to the platform:

### Mobile View Optimization & Bug Fixes
- **Experience Section Layout:** Fixed a critical rendering issue where text blocks were appearing as massive empty spaces. Repositioned the "Why Choose Us" text strictly above the image grid for a natural mobile scrolling experience.
- **Hero Badge Scaling:** Fixed a bug causing the "Premier Corporate Event Specialists" badge to overlap with the headline. The badge was transitioned to a block container with specific mobile scaling (`0.48rem` font size, `0px` letter spacing, `nowrap`) to guarantee a sleek, single-line fit on narrow devices like the Lumia 550.
- **Hero Background Positioning:** Adjusted the mobile hero background focal point to `65%` to clearly display the food/event presentation elements on smaller screens.
- **Heading Order Adjustments:** Restored the "What We Offer" heading back to its logical position directly above the services grid, removing mobile duplication and visual confusion.

### Design Aesthetics & Animations
- **Advanced 3D Animations:** Upgraded the scroll-reveal engine. Elements now unfurl smoothly into place with a premium 3D `rotateX` transition. Removed an unreliable blur filter that was causing text to freeze on older mobile browsers.
- **Light-Gray Dark Theme Transition:** Softened the entire dark mode aesthetic. Replaced the extremely dark, pitch-black/blue backgrounds with an elegant, softer slate-gray scale (e.g., `#2c313a`, `#22272e`). This enhances readability while maintaining a highly premium corporate feel.
- **Continuous Background Drift:** Added a slow, subtle background pan to the main Hero section (`heroDrift`) to make the site feel alive without requiring user interaction.
- **Dynamic Button Shines:** Added a continuous, sweeping light-shine animation (`sweepingShine`) to all primary CTA buttons for higher user engagement.
- **Enhanced 3D Hover Physics:** Applied a deeper hover lift and a richer golden drop-shadow glow to service and statistic cards.
