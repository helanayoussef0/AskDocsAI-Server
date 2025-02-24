/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
      .createTable("documents", (table) => {
        table.increments("id").primary();
        table.string("filename").notNullable();
        table.text("content").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .createTable("conversations", (table) => {
        table.increments("id").primary();
        table
          .integer("document_id")
          .unsigned()
          .references("documents.id")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.enum("status", ["active", "completed", "error"]).defaultTo("active");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .createTable("messages", (table) => {
        table.increments("id").primary();
        table
          .integer("conversation_id")
          .unsigned()
          .references("conversations.id")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.text("content").notNullable();
        table.enum("role", ["user", "assistant"]).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema
      .dropTable("messages")
      .dropTable("conversations")
      .dropTable("documents");
  }