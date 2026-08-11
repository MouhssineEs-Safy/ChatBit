import * as authService from './auth.service.js';

export const register = async (req, res, next) => {
  try {
    const { fullname, email, password, role } = req.body;
    const result = await authService.register({ fullname, email, password, role });
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

