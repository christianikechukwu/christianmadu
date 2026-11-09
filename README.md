# Christian Madu — Student Portfolio & Task Manager

A responsive personal portfolio website built with **plain HTML5, CSS3 and vanilla JavaScript**, with no frameworks, libraries or build tools. It was built for the **COS 106 Lab** at MIVA Open University.

- **Live site:** https://christianikechukwu.github.io/christianmadu
- **Repository:** https://github.com/christianikechukwu/christianmadu

---

## About

The site introduces Christian Ikechukwu Madu, a Cybersecurity student at MIVA Open University. It shows his background, projects and contact details. It also includes a working task planner for managing study work.

## Pages

| Page | File | What it contains |
| --- | --- | --- |
| Home | `index.html` | Introduction, audio welcome message with transcript, highlights, FAQ |
| About | `about.html` | Profile, education timeline, skills, academic table |
| Projects | `projects.html` | Project gallery with detail pop-ups and a GPA calculator |
| Planner | `planner.html` | Task manager: add, complete, delete, filter and search tasks |
| Contact | `contact.html` | Contact details and a validated contact form with a receipt pop-up |

## Features

- **Semantic HTML5**: `header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `figcaption`, `table`, `caption`, `form`, `address`, `footer`
- **Responsive layout**: Flexbox, CSS Grid and media queries for desktop, tablet and mobile
- **Mobile navigation**: a collapsible menu on small screens
- **Scroll animations**: sections fade in as they scroll into view (IntersectionObserver)
- **Multimedia**: an audio welcome message with a text transcript you can show or hide
- **GPA calculator**: works on the Nigerian 5-point grading scale
- **Task management system**: tasks are saved in the browser with `localStorage`, so they stay after a page reload
- **Form validation**: live checks on name, email and message, using regular expressions
- **Accessible modals**: close with the Escape key or by clicking the backdrop

## Project Structure

```text
christianmadu/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── favicon.ico
├── css/
│   └── style.css        # All styles, layout and media queries
├── js/
│   ├── main.js          # Shared: nav toggle, footer year, scroll reveal, modal helper
│   ├── home.js          # Audio transcript toggle and FAQ
│   ├── projects.js      # Project modals and GPA calculator
│   ├── planner.js       # Task manager (localStorage)
│   └── contact.js       # Form validation and submission receipt
├── images/              # Profile photo and project screenshots
└── audio/
    └── welcome.ogg      # Welcome message
```

## Running Locally

No installation or build step is needed.

1. Clone the repository:
   ```sh
   git clone https://github.com/christianikechukwu/christianmadu.git
   cd christianmadu
   ```
2. Open `index.html` in any modern web browser.

You can also serve the folder with a simple local server, for example the VS Code **Live Server** extension, or:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

The site is hosted on **GitHub Pages** from the `main` branch root. Any change pushed to `main` is published to the live site automatically.

## Technologies

- HTML5
- CSS3 (custom properties, Flexbox, Grid, media queries, animations)
- JavaScript (ES5+, DOM manipulation, event handling, `localStorage`)
- Git & GitHub Pages

## Author

**Christian Ikechukwu Madu**
Cybersecurity Student, MIVA Open University
GitHub: [@christianikechukwu](https://github.com/christianikechukwu)

## License

This project was created for academic purposes (COS 106 Lab).
