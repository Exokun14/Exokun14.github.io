// Everything on the personal sections lives here. Edit the text, save, push.
// Photos and testimonials stay hidden until you add real ones.
window.SITE = {
  now: {
    updated: 'November 2026',
    items: [
      { label: 'Working on', text: 'Internal tools for a retail operations team: dashboards, request tracking and the small things that save people time.' },
      { label: 'Learning', text: 'Getting sharper at TypeScript and at designing systems that stay easy to change.' },
      { label: 'Enjoying', text: 'Good coffee, long walks and a decent playlist while I code.' }
    ]
  },
  timeline: [
    { year: '2026', title: 'Full-stack developer', text: 'Building and looking after tools that retail and operations teams use every day.' },
    { year: '2025', title: 'Taking on bigger projects', text: 'Started owning projects from the first conversation to launch and the support afterwards.' },
    { year: '2024', title: 'Working professionally', text: 'Moved from learning on my own to building real tools for real teams.' }
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
    text: 'I’m open to freelance projects and to the right full-time team. If you have a process that’s slow, a tool that’s clumsy or an idea that needs building, tell me about it.',
    offers: ['Internal tools and dashboards', 'Web apps from idea to launch', 'Improving or rescuing an existing system']
  },
  photos: [
    // { src: 'assets/img/photo-1.jpg', alt: 'Short description', caption: 'Optional caption' }
  ],
  kind: [
    // { quote: 'What they said, in their words.', name: 'Their name', role: 'Their role or company' }
  ],
  notes: [
    { id: 'start-boring', date: 'November 2026', title: 'Start with the boring version',
      body: ['Most tools I’ve built began as something almost embarrassingly plain. A list, a form, a button that does one thing.',
             'That’s on purpose. The plain version gets in front of real people quickly, and they tell me what actually matters. The clever ideas I had at my desk usually don’t survive that conversation.'] },
    { id: 'watch-the-work', date: 'October 2026', title: 'Watch the work before building anything',
      body: ['Before I write code I like to sit with the people who will use it and watch how they do the job today.',
             'The workarounds are the interesting part. A sticky note on a monitor or a spreadsheet nobody admits to using usually points at the real problem.'] },
    { id: 'easy-to-change', date: 'September 2026', title: 'Easy to change beats clever',
      body: ['I used to be proud of clever code. These days I’m prouder of code that someone else can open six months from now and change without fear.',
             'Plain names, small pieces and a bit of patience go a long way.'] }
  ]
};
