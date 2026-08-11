import * as usersService from './users.service.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await usersService.getMe(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

