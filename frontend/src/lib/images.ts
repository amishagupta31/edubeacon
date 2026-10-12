/**
 * Edubeacon Photography Registry
 * All images sourced from Unsplash — education, technology, and professional settings.
 */
function unsplash(id: string, params = "auto=format&fit=crop&q=80") {
  return `https://images.unsplash.com/${id}?${params}`;
}

export const img = {
  // Hero: Modern conference / education summit wide shot
  heroMain: unsplash("photo-1524178232363-1fb2b075b655", "auto=format&fit=crop&q=80&w=1600"),
  // Education leadership conference keynote
  conferenceKeynote: unsplash("photo-1540575467063-178a50c2df87", "auto=format&fit=crop&q=80&w=1400"),
  // School / classroom technology session
  smartClassroom: unsplash("photo-1580582932707-520aed937b7b", "auto=format&fit=crop&q=80&w=1200"),
  // STEM lab / robotics
  stemLab: unsplash("photo-1485827404703-89b55fcc595e", "auto=format&fit=crop&q=80&w=1200"),
  // Education exhibition floor
  exhibitionFloor: unsplash("photo-1531058020387-3be344556be6", "auto=format&fit=crop&q=80&w=1400"),
  // Networking professionals
  networking: unsplash("photo-1573497620053-ea5300f94f21", "auto=format&fit=crop&q=80&w=1200"),
  // Panel discussion on stage
  panelDiscussion: unsplash("photo-1475721027785-f74eccf877e2", "auto=format&fit=crop&q=80&w=1400"),
  // Workshop / training session
  workshop: unsplash("photo-1552664730-d307ca884978", "auto=format&fit=crop&q=80&w=1200"),
  // Magazine / editorial visual
  magazine: unsplash("photo-1504711434969-e33886168f5c", "auto=format&fit=crop&q=80&w=800"),
  // Award ceremony
  awards: unsplash("photo-1531415074968-036ba1b575da", "auto=format&fit=crop&q=80&w=1200"),
  // Curated meeting / roundtable
  roundtable: unsplash("photo-1558403194-611308249627", "auto=format&fit=crop&q=80&w=1200"),
  // School leaders meeting
  leadersMeeting: unsplash("photo-1517048676732-d65bc937f952", "auto=format&fit=crop&q=80&w=1200"),
  // EdTech / tablet in classroom
  edtech: unsplash("photo-1593079831268-3381b0db4a77", "auto=format&fit=crop&q=80&w=1200"),
  // AI / innovation lab
  aiLab: unsplash("photo-1531482615713-2afd69097998", "auto=format&fit=crop&q=80&w=1200"),
  // Video thumbnail: energetic session
  videoThumb: unsplash("photo-1550305080-4e029753abcf", "auto=format&fit=crop&q=80&w=800"),
  // Conference audience
  audience: unsplash("photo-1505373877841-8d25f7d46678", "auto=format&fit=crop&q=80&w=1400"),
  // Recruitment hero — custom composite portrait (local asset, RGBA 1536×1024).
  recruitmentHero: "/images/recruitment-hero.png",
  teacherPortrait: unsplash("photo-1544717305-2782549b5136", "auto=format&fit=crop&q=80&w=700"),
  teacherHeroPortrait: unsplash("photo-1645664747204-31fee58898dc", "auto=format&fit=crop&q=80&w=1600"),
  indianClassroom: unsplash("photo-1709290749293-c6152a187b14", "auto=format&fit=crop&q=80&w=900"),
  teacherClassroom: unsplash("photo-1509062522246-3755977927d7", "auto=format&fit=crop&q=80&w=900"),

  // Speaker Portraits — diverse education professionals
  speakerW1: unsplash("photo-1573496359142-b8d87734a5a2", "auto=format&fit=crop&q=80&w=600"),
  speakerM1: unsplash("photo-1560250097-0b93528c311a", "auto=format&fit=crop&q=80&w=600"),
  speakerW2: unsplash("photo-1580489944761-15a19d654956", "auto=format&fit=crop&q=80&w=600"),
  speakerM2: unsplash("photo-1519085360753-af0119f7cbe7", "auto=format&fit=crop&q=80&w=600"),
  speakerW3: unsplash("photo-1573497491765-dccce02b29df", "auto=format&fit=crop&q=80&w=600"),
  speakerM3: unsplash("photo-1500648767791-00dcc994a43e", "auto=format&fit=crop&q=80&w=600"),
  speakerM4: unsplash("photo-1472099645785-5658abf4ff4e", "auto=format&fit=crop&q=80&w=600"),
  speakerW4: unsplash("photo-1594744803329-e58b31de8bf5", "auto=format&fit=crop&q=80&w=600"),
} as const;
