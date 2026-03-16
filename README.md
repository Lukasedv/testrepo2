# testrepo2

A minimal static web project that serves a "Hello, World!" HTML page. This repository is a simple demonstration project showing a basic HTML page with no build tools or external dependencies required.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Project Description

**testrepo2** is a lightweight static web project consisting of a single HTML page. It requires no backend, no build step, and no package manager — open the file in a browser and you're done.

---

## Features

- Single-file static HTML page (`index.html`)
- No dependencies or build tools required
- Compatible with any modern web browser

---

## Prerequisites

To view or develop this project locally, you only need:

| Requirement | Version | Notes |
|---|---|---|
| A modern web browser | Any current release | Chrome, Firefox, Edge, Safari, etc. |
| A text editor *(optional)* | Any | VS Code, Vim, Notepad++, etc. |
| A local HTTP server *(optional)* | Any | Only needed if you want to serve over HTTP instead of opening the file directly |

No Node.js, Python, Docker, or other runtimes are required.

---

## Getting Started

### Option 1 — Open directly in a browser (simplest)

1. Clone the repository:

   ```bash
   git clone https://github.com/Lukasedv/testrepo2.git
   cd testrepo2
   ```

2. Open `index.html` in your browser:

   ```bash
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows (Command Prompt)
   start index.html
   ```

   You should see a page displaying **"Hello, World!"**.

### Option 2 — Serve with a local HTTP server (optional)

If you prefer to serve the file over HTTP, you can use any simple HTTP server. Examples:

**Python 3:**

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080> in your browser.

**Node.js (`npx`):**

```bash
npx serve .
```

Then follow the URL printed in your terminal.

---

## Project Structure

```
testrepo2/
├── index.html   # The single Hello World HTML page
└── README.md    # This file
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository and create a new branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Branch naming convention: `feature/<short-description>` or `fix/<short-description>`.

2. **Make your changes.** Keep each commit focused and descriptive.

3. **Open a Pull Request** against the `main` branch. Include a brief description of what changed and why.

4. **Update this README** if your change affects setup steps, project structure, or available features.

> **Note:** There are currently no automated tests for this project. If you add functionality that warrants testing, please include appropriate tests in your PR.

---

## License

This project does not currently specify a license. Please contact the repository maintainer [@Lukasedv](https://github.com/Lukasedv) for usage permissions.
