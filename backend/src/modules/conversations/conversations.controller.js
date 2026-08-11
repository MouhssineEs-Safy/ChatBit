import * as conversationsService from './conversations.service.js';

/**
 * Handles POST /api/conversations
 */
export const create = async (req, res, next) => {
  try {
    const { subject } = req.body || {};
    const conversation = await conversationsService.createConversation(req.user, { subject });

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles GET /api/conversations
 */
export const list = async (req, res, next) => {
  try {
    const conversations = await conversationsService.listConversations(req.user);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};
