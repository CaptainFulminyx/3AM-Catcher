export const mockPosts = [
  {
    id: "1",
    user: {
      id: "u1",
      username: "nocturnaldev",
      avatar: null,
      initials: "ND",
    },
    content:
      "what if instead of resumes, hiring was just 'show me a problem you stayed up until 3am trying to solve' — the answer itself tells you everything about the person",
    tags: ["#idea", "#collab"],
    postTime: "3:17 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
    reactions: { felt: 42, wantIn: 18, tellMore: 27 },
    userReaction: null,
    reflectionStatus: "Still Obsessed",
    comments: 6,
  },
  {
    id: "2",
    user: {
      id: "u2",
      username: "solarsailor",
      avatar: null,
      initials: "SS",
    },
    content:
      "been thinking: loneliness isn't about being alone. it's about being around people who don't care what you think at 2am. that's the real metric for a good relationship",
    tags: ["#rant"],
    postTime: "2:41 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 113).toISOString(),
    reactions: { felt: 189, wantIn: 3, tellMore: 44 },
    userReaction: "felt",
    reflectionStatus: "Still Obsessed",
    comments: 31,
  },
  {
    id: "3",
    user: {
      id: "u3",
      username: "pixel_anarchist",
      avatar: null,
      initials: "PA",
    },
    content:
      "okay hear me out: an app where musicians can jam LIVE with strangers at night. no profiles, no followers. just a room, a key, a tempo. you're gone by morning. someone build this with me???",
    tags: ["#collab", "#creative", "#idea"],
    postTime: "1:58 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    reactions: { felt: 76, wantIn: 94, tellMore: 52 },
    userReaction: null,
    reflectionStatus: null,
    comments: 19,
  },
  {
    id: "4",
    user: {
      id: "u4",
      username: "glasshalfcode",
      avatar: null,
      initials: "GH",
    },
    content:
      "i rewrote my entire portfolio at 4am and it's the most honest thing i've ever made. deleted the 'professional' version. this one has typos and i'm keeping them",
    tags: ["#creative"],
    postTime: "4:02 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    reactions: { felt: 312, wantIn: 7, tellMore: 88 },
    userReaction: "felt",
    reflectionStatus: "Meh",
    comments: 44,
  },
  {
    id: "5",
    user: {
      id: "u5",
      username: "voidwalker__",
      avatar: null,
      initials: "VW",
    },
    content:
      "genuine question: does anyone else feel MORE like themselves between midnight and 5am than at any other point in the day? not insomnia. just... alignment",
    tags: ["#question"],
    postTime: "3:44 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    reactions: { felt: 601, wantIn: 0, tellMore: 130 },
    userReaction: null,
    reflectionStatus: "Still Obsessed",
    comments: 97,
  },
  {
    id: "6",
    user: {
      id: "u6",
      username: "entropymachine",
      avatar: null,
      initials: "EM",
    },
    content:
      "shower thought but make it 3am: every city has a different silence. NYC silence sounds like distant sirens and AC units. rural silence sounds like your own heartbeat. i want to record them all",
    tags: ["#creative", "#idea"],
    postTime: "2:59 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    reactions: { felt: 228, wantIn: 41, tellMore: 76 },
    userReaction: null,
    reflectionStatus: null,
    comments: 22,
  },
  {
    id: "7",
    user: {
      id: "u7",
      username: "burnttoast404",
      avatar: null,
      initials: "BT",
    },
    content:
      "started writing a short story. it became a screenplay. then a product spec. now it's a manifesto. i don't know what i'm building but i can't stop",
    tags: ["#rant", "#collab"],
    postTime: "4:31 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    reactions: { felt: 155, wantIn: 62, tellMore: 103 },
    userReaction: null,
    reflectionStatus: "Burn It",
    comments: 14,
  },
]

export const mockGraveyardPosts = [
  {
    id: "g1",
    user: { id: "u3", username: "pixel_anarchist", initials: "PA" },
    content:
      "p2p encrypted notes that self-destruct after being read once. no server. no logs. just two people and a secret",
    tags: ["#idea"],
    postTime: "3:03 AM",
    buriedAt: "6 days ago",
    revivals: 14,
  },
  {
    id: "g2",
    user: { id: "u8", username: "midnightfern", initials: "MF" },
    content:
      "what if there was a dating app but you only match with people who are awake RIGHT NOW. no algorithm. just: are you also not sleeping?",
    tags: ["#idea", "#collab"],
    postTime: "2:17 AM",
    buriedAt: "12 days ago",
    revivals: 89,
  },
]