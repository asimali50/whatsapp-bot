/**
 * Simple in-memory session store.
 * Tracks conversation state per user phone number.
 * In production, replace this with Redis or a database.
 */

const sessions = new Map();

function get(phone) {
  return sessions.get(phone) || null;
}

function set(phone, data) {
  sessions.set(phone, data);
}

function clear(phone) {
  sessions.delete(phone);
}

function all() {
  return Object.fromEntries(sessions);
}

module.exports = { get, set, clear, all };
