import documentsData from '../seed-data/documents.js';
import conversationsData from '../seed-data/conversations.js';
import messagesData from '../seed-data/messages.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Delete existing entries in reverse order of dependencies
  await knex("messages").del();
  await knex("conversations").del();
  await knex("documents").del();

  // Insert seed data
  await knex("documents").insert(documentsData);
  await knex("conversations").insert(conversationsData);
  await knex("messages").insert(messagesData);
}