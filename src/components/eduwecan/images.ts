/**
 * EduWeCan photography registry.
 * Every entry has been visually verified (downloaded and inspected)
 * against its intended use — warm, bright, genuine education moments
 * that suit the calm pastel editorial tone, not corporate stock shots.
 */
function unsplash(id: string, w = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;
}

export const ewcImg = {
  // Bright library, students laughing together over laptops — hero.
  hero: unsplash("photo-1523240795612-9a054b0db644", 1600),
  // Three women laughing together, laptops on a café table.
  collaborate: unsplash("photo-1522202176988-66273c2fd55f"),
  // Four students warmly studying together at a table.
  studyGroup: unsplash("photo-1543269865-cbf427effbad"),
  // Diverse students writing in a bright classroom.
  classroom: unsplash("photo-1571260899304-425eee4c7efc"),
  // Teacher instructing a colorful, lively classroom.
  mentor: unsplash("photo-1509062522246-3755977927d7"),
  // Library aisle, student silhouette with backpack among colorful books.
  library: unsplash("photo-1427504494785-3a9ca7044f45"),
  // Young students diligently writing at their desks.
  youngLearners: unsplash("photo-1588072432836-e10032774350"),

  // Portraits for testimonials.
  portrait1: unsplash("photo-1573496359142-b8d87734a5a2", 400),
  portrait2: unsplash("photo-1519085360753-af0119f7cbe7", 400),
  portrait3: unsplash("photo-1472099645785-5658abf4ff4e", 400),
  portrait4: unsplash("photo-1594744803329-e58b31de8bf5", 400),
} as const;
