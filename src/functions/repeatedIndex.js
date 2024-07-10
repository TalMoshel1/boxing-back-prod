export function generateUniqueIndex() {
    return Math.random().toString(36).substr(2, 9); // Generate a random string of 9 characters
  }