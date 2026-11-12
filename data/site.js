// Everything on the personal sections lives here. Edit the text, save, push.
// Photos and testimonials stay hidden until you add real ones.
window.SITE = {
  now: {
    updated: 'November 2026',
    items: [
      { label: 'Working on', text: 'Handling projects, support and QA on the project team at GenieX.' },
      { label: 'Learning', text: 'Getting sharper at TypeScript and at designing systems that stay easy to change.' },
      { label: 'Enjoying', text: 'Good coffee, long walks and a decent playlist while I code.' }
    ]
  },
  timeline: [
    { year: 'Feb 2026 to now', title: 'Technical Support, Project Team at GenieX', text: 'I joined GenieX in technical support. Since February 2026 I’ve been on the project team, handling projects and support and doing QA.' },
    { year: 'After graduating', title: 'Helpdesk Analyst at Citco, Business Systems Support', text: 'I started as a six-month intern at Citco in Clark, then stayed on a contract for another six months as a Helpdesk Analyst with the Business Systems Support (BSS) team, helping colleagues keep their systems and tools working.' },
    { year: '2024', title: 'Graduated from Bulacan State University', text: 'Finished my degree and started my career.' },
    { year: 'Before graduating', title: 'Intern at Accenture Philippines', text: 'My pre-graduation internship, and my first look at how a large technology company works.' }
  ],
  uses: [
    { label: 'Editor', text: 'VS Code' },
    { label: 'Browser', text: 'Chrome, with a lot of tabs open' },
    { label: 'Everyday stack', text: 'Next.js, TypeScript, Laravel, MySQL' },
    { label: 'Version control', text: 'Git and GitHub' },
    { label: 'Notes', text: 'Plain text files and a paper notebook' },
    { label: 'Desk', text: 'Two monitors, a good chair and a lot of coffee' }
  ],
  beyond: [
    { title: 'Music', text: 'Always something playing. It helps me think.' },
    { title: 'Games', text: 'A good story-driven game is my favorite way to switch off.' },
    { title: 'Food', text: 'Always up for trying a new place or cooking something simple at home.' },
    { title: 'Outdoors', text: 'Walks to clear my head after a long day of screens.' }
  ],
  work: {
    text: 'Want to talk projects, QA or tech, or have an idea to build? Reach out. Years on the support side taught me to listen first and fix second.',
    offers: ['Questions about my work or background', 'Ideas for small web projects', 'Or just saying hello']
  },
  photos: [
    // { src: 'assets/img/photo-1.jpg', alt: 'Short description', caption: 'Optional caption' }
  ],
  kind: [
    // { quote: 'What they said, in their words.', name: 'Their name', role: 'Their role or company' }
  ],
  notes: [
    { id: 'listen-first', date: 'November 2026', title: 'Listen before you fix',
      body: ['The first thing a person says about a problem is rarely the real problem. Working on a helpdesk taught me to slow down and ask what they were actually trying to do.',
             'Half the time the fix turns out to be different from what they first asked for.'] },
    { id: 'plain-words', date: 'October 2026', title: 'Say it so anyone can follow',
      body: ['If someone needs a dictionary to understand my answer, it’s not a good answer yet.',
             'Plain words and clear steps respect people’s time, and they make the next call shorter.'] },
    { id: 'write-it-down', date: 'September 2026', title: 'Write it down',
      body: ['A fix that lives only in my head will be needed again at the worst possible moment.',
             'A short note about what went wrong and what worked saves the next person, who is often me.'] }
  ]
};
