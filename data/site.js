// Everything on the personal sections lives here. Edit the text, save, push.
// Photos and testimonials stay hidden until you add real ones.
window.SITE = {
  now: {
    updated: 'November 2026',
    items: [
      { label: 'Working on', text: 'Taking projects through the full cycle at GenieX: coordinating, documenting, testing, deploying and training clients.' },
      { label: 'Latest climb', text: 'Mt. Arayat quad peak on November 7.' },
      { label: 'On repeat', text: 'Benson Boone and Olivia Rodrigo.' }
    ]
  },
  cycle: [
    { title: 'Coordinate', text: 'Keep project status clear and keep everyone, including the developers, on the same page.' },
    { title: 'Document', text: 'Write things down so nothing lives only in someone’s head.' },
    { title: 'Test', text: 'QA every update, by hand and with automation.' },
    { title: 'Deploy', text: 'Release the update, including on the client’s own environment.' },
    { title: 'Demo and train', text: 'Show clients how it works and train their team to use it.' }
  ],
  timeline: [
    { year: 'Feb 2026 to now', title: 'Technical Support, Project Team at GenieX', text: 'I joined Genie Technologies Incorporated in technical support. Since February 2026 I’ve been on the project team, where I handle the full project cycle: coordinating with developers, writing documentation, testing, deploying, and running demos and training for clients.' },
    { year: 'Aug 2024 to Aug 2025', title: 'Helpdesk Analyst at Citco, Business Systems Support', text: 'I started as a six-month intern at Citco in Clark, then stayed on a six-month contract as a Helpdesk Analyst with the Business Systems Support (BSS) team, helping colleagues keep their systems and tools working. Citco also trained me in networking, Linux, AWS and programming.' },
    { year: '2024', title: 'Graduated from Bulacan State University', text: 'Bachelor of Science, major in Information and Communications Technology.' },
    { year: '2024', title: 'Intern at Accenture Philippines', text: 'My pre-graduation internship, and my first look at how a large technology company works.' }
  ],
  learning: [
    { title: 'Degree', text: 'BS in Information and Communications Technology, Bulacan State University' },
    { title: 'Citco training', text: 'Networking, Linux, AWS and programming' },
    { title: 'Certification', text: 'Microsoft Office' }
  ],
  beyond: [
    { title: 'Music', text: 'Benson Boone, Olivia Rodrigo and soft pop rock.' },
    { title: 'Games', text: 'Mobile Legends, Clash of Clans, RimWorld, Skyrim, GTA, Red Dead Redemption 2 and League of Legends.' },
    { title: 'Hiking', text: 'My favorite way to reset. The trail log is just below.' }
  ],
  // Newest first. tough: 1 (easy) to 4 (hardest) sets the peak height. Optional: photo, alt, masl (elevation in metres).
  trails: [
    { date: 'Nov 7, 2026', name: 'Mt. Arayat', tag: 'Quad peak', tough: 3, note: 'Quad peak, my latest and the toughest of the three.' },
    { date: 'Jun 12, 2026', name: 'Mt. Makiling', tag: 'Traverse', tough: 2, note: 'A major hike, done as a traverse.' },
    { date: 'May 1, 2026', name: 'Mt. Romelo', tag: 'Minor hike', tough: 1, note: 'A minor hike, and my mother mountain.' }
  ],
  work: {
    text: 'Want to talk projects, QA or tech, or have a small web project in mind? I’m open to freelance work too. Reach out.',
    offers: ['Freelance projects', 'Questions about my work or background', 'Or just saying hello']
  },
  photos: [
    // { src: 'assets/img/photo-1.jpg', alt: 'Short description', caption: 'Optional caption' }
  ],
  kind: [
    // { quote: 'What they said, in their words.', name: 'Their name', role: 'Their role or company' }
  ],
  notes: [
    { id: 'listen-first', kanji: '聴', date: 'November 2026', title: 'Listen before you fix',
      body: ['The first thing a person says about a problem is rarely the real problem. Working on a helpdesk taught me to slow down and ask what they were actually trying to do.',
             'Half the time the fix turns out to be different from what they first asked for.'] },
    { id: 'plain-words', kanji: '簡', date: 'October 2026', title: 'Say it so anyone can follow',
      body: ['If someone needs a dictionary to understand my answer, it’s not a good answer yet.',
             'Plain words and clear steps respect people’s time, and they make the next call shorter.'] },
    { id: 'think-like-an-owner', kanji: '主', date: 'September 2026', title: 'Think like an owner',
      body: ['I try to treat every project as if it were mine. That means caring about the whole outcome, not just my part of it.',
             'It changes the questions I ask: not “is my task done?” but “will this actually work for the people using it?”'] }
  ],
  // Gallery: the paintings. Add your own photos to `photos` above and they show up under the Photos tab.
  paintings: [
    { src: 'assets/img/art-wave.webp', title: 'The wave', alt: 'Ink painting of a large curling ocean wave' },
    { src: 'assets/img/art-crane.webp', title: 'Crane', alt: 'Ink painting of a crane with wings spread in flight' },
    { src: 'assets/img/art-mountain.webp', title: 'Mountain', alt: 'Ink painting of a mountain peak with ridges' },
    { src: 'assets/img/art-torii.webp', title: 'Torii', alt: 'Ink painting of a torii gate' },
    { src: 'assets/img/art-koi.webp', title: 'Koi', alt: 'Ink painting of a koi fish swimming' },
    { src: 'assets/img/art-sakura.webp', title: 'Sakura', alt: 'Ink painting of a cherry blossom branch' },
    { src: 'assets/img/art-pine.webp', title: 'Pine', alt: 'Ink painting of a gnarled pine tree branch' },
    { src: 'assets/img/art-bamboo.webp', title: 'Bamboo', alt: 'Ink painting of bamboo stalks' },
    { src: 'assets/img/art-enso.webp', title: 'Ensō', alt: 'Ink brush circle, an enso' },
    { src: 'assets/img/art-ninetail.webp', title: 'Nine tails', alt: 'Ink painting of a nine-tailed fox sitting' },
    { src: 'assets/img/art-kitsune.webp', title: 'Kitsune', alt: 'Ink painting of a fox mask with cherry blossoms and tassels' },
    { src: 'assets/img/art-kitsune-red.webp', title: 'Kitsune, in red', alt: 'White fox mask with red markings, tassels and bells', color: true },
    { src: 'assets/img/art-dragon-sword.webp', title: 'Dragon and sword', alt: 'Ink painting of a dragon coiled around a sword' },
    { src: 'assets/img/art-katana-stand.webp', title: 'Katana', alt: 'Ink painting of a katana resting on a stand' },
    { src: 'assets/img/art-samurai-stand.webp', title: 'Samurai, standing', alt: 'Ink painting of a samurai in armour standing with hands on a sword' },
    { src: 'assets/img/art-samurai-kneel.webp', title: 'Samurai, kneeling', alt: 'Ink painting of a samurai kneeling with a sword at his side' },
    { src: 'assets/img/art-samurai-draw.webp', title: 'Samurai, drawing', alt: 'Ink painting of a samurai drawing a sword' }
  ],
  // Guestbook: visitors sign by opening a GitHub issue titled "[Guestbook] ..." in this repo.
  guestbook: { repo: 'Exokun14/Exokun14.github.io', prefix: '[Guestbook]' },
  // Hire me page. No prices are listed on purpose; add a `from` field to a service if you want one.
  services: [
    { title: 'Web apps and dashboards', text: 'Internal tools, dashboards and trackers that replace spreadsheets and chat threads. Built with the people who use them, and kept simple enough that they actually get used.', tags: ['Next.js', 'React', 'TypeScript', 'Laravel', 'MySQL'] },
    { title: 'QA and test automation', text: 'Manual testing on every update, plus automated checks so the same bug does not come back. Clear bug reports that developers can act on.', tags: ['Playwright', 'Robot Framework', 'Selenium'] },
    { title: 'Project delivery', text: 'Coordinating developers and clients, writing the documentation, deploying, then running the demo and training the client team.', tags: ['Coordination', 'Documentation', 'Deployment', 'Client training'] },
    { title: 'Desktop and workflow tools', text: 'Small desktop tools that turn a risky, many-step job into one window, like a backup and migration tool that needs no command line.', tags: ['C#', 'WPF', 'PowerShell', 'Electron'] },
    { title: 'Support and documentation', text: 'Helpdesk and customer support experience, and the habit of writing things down so nothing lives only in one person’s head.', tags: ['Troubleshooting', 'Customer support', 'Knowledge base'] }
  ],
  skills: [
    { title: 'Projects', text: 'Status coordination, working with developers, documentation, client demos and training' },
    { title: 'Support', text: 'Customer support and troubleshooting' },
    { title: 'QA', text: 'Manual testing, plus automation with Playwright, Robot Framework and Selenium' },
    { title: 'Cloud', text: 'AWS and CloudFormation' },
    { title: 'Programming', text: 'C#, Java, Python and web development, with or without AI' },
    { title: 'Web', text: 'Next.js, React, TypeScript, Tailwind, Laravel, PHP, MySQL' },
    { title: 'Linux', text: 'Ubuntu and Arch Linux' }
  ]
};
