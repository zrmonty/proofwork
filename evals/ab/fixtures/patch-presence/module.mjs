export const applyProfilePatch = (profile, patch) => ({ ...profile, name: patch.name, bio: patch.bio });
