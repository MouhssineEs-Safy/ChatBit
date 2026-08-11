import * as messagesService from './messages.service.js';

/**
 * Handles GET /api/conversations/:id/messages
 */
export const getHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit, offset } = req.query;

    const { messages, pagination } = await messagesService.getHistory(req.user, id, {
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: messages,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};
