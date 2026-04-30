import { query } from '../../db/index.js';

/**
 * Log an action to the audit_logs table
 * @param {number} userId - The ID of the user performing the action
 * @param {string} action - Description of the action
 * @param {string} entityType - The type of entity (e.g., 'reservation', 'guest', 'room')
 * @param {number} entityId - The ID of the entity
 * @param {string} details - Additional details in JSON or text format
 */
export const logAction = async (userId, action, entityType, entityId, details) => {
  try {
    await query(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [userId || null, action, entityType, entityId, details]
    );
  } catch (err) {
    console.error('Failed to log action:', err);
  }
};
