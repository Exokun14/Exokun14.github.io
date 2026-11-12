// Add a project by adding one object to this list.
window.PROJECTS = [
  {
    "id": "this-site",
    "title": "This website",
    "year": "2026",
    "role": "Design and development",
    "seal": "C",
    "palette": [
      "#CFE0D8",
      "#8FB0A3",
      "#2F5D50"
    ],
    "summary": "A hand-built portfolio in plain HTML, CSS and JavaScript, painted as one landscape that moves from dawn to night as you scroll.",
    "details": "There is no framework and no build step. Projects load from a single JSON file and open as letters, each with a landscape generated from its name. Effects scale down on phones and low-power machines, a nightly GitHub Action fills the activity strip, and Playwright checks every page in light and dark on each push.",
    "tech": [
      "HTML",
      "CSS",
      "JavaScript",
      "GitHub Actions",
      "Playwright"
    ],
    "flow": [
      "projects.js",
      "main.js",
      "Letters",
      "GitHub Pages"
    ],
    "links": [
      {
        "label": "Live site",
        "url": "https://exokun14.github.io/"
      },
      {
        "label": "Repository",
        "url": "https://github.com/Exokun14/Exokun14.github.io"
      }
    ]
  },
  {
    "id": "project-one",
    "title": "Project name",
    "year": "2026",
    "role": "Full-stack developer",
    "seal": "P",
    "palette": [
      "#CFE0D8",
      "#8FB0A3",
      "#2F5D50"
    ],
    "summary": "One or two sentences: what it does, who uses it, and what you built.",
    "details": "Write a short paragraph here about the problem, your part in it, and how it turned out.",
    "tech": [
      "Next.js",
      "Laravel",
      "MySQL"
    ],
    "flow": [
      "Laravel API",
      "MySQL",
      "Next.js dashboard",
      "Electron client"
    ],
    "links": [
      {
        "label": "Repository",
        "url": "#"
      }
    ]
  },
  {
    "id": "project-two",
    "title": "Another project",
    "year": "2025",
    "role": "Full-stack developer",
    "seal": "A",
    "palette": [
      "#C9D6E6",
      "#8CA3C4",
      "#34476B"
    ],
    "summary": "Replace this with something you are proud of. Add an image path in an \"image\" field to show a screenshot.",
    "details": "Another short paragraph. Keep it honest and specific.",
    "tech": [
      "TypeScript",
      "MySQL"
    ],
    "flow": [
      "Next.js",
      "Laravel API",
      "MySQL"
    ],
    "links": [
      {
        "label": "Live demo",
        "url": "#"
      }
    ]
  },
  {
    "id": "project-three",
    "title": "A third project",
    "year": "2024",
    "role": "Developer",
    "seal": "T",
    "palette": [
      "#DDE3C2",
      "#B3BC86",
      "#47572E"
    ],
    "summary": "Add more projects by adding one entry to data/projects.js. No HTML needed.",
    "details": "Each entry becomes a slide on the home page and an envelope on the projects page.",
    "tech": [
      "Playwright",
      "Electron"
    ],
    "flow": [
      "Test runner",
      "Browser",
      "Reports"
    ],
    "links": [
      {
        "label": "Repository",
        "url": "#"
      }
    ]
  }
];
