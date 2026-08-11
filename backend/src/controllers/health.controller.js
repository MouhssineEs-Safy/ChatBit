/**
 * Health check controller.
 * Returns HTTP 200 with service status.
 */
export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ChatBit API is healthy',
    timestamp: new Date().toISOString(),
  });
};
