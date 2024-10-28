const { Joi, celebrate, Segments } = require("celebrate"); // Import Segments from celebrate
const validator = require("validator");

// Custom URL validation function
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// 1. Validation for creating a clothing item
const validateClothingItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "any.only":
        'The "weather" field must be one of the following: hot, warm, cold',
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});

// 2. Validation for creating a user
const validateUserCreation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": 'The "password" field must be at least 8 characters long',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 3. Validation for updating a user (fields are optional now)
const validateUserUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).optional().messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
  }),
});

// 4. Validation for user login (authentication)
const validateUserLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 5. Validation for user and clothing item IDs
const validateId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().length(24).hex().required().messages({
      "string.length": 'The "id" must be a 24-character hexadecimal string',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserCreation,
  validateUserUpdate, // Export the updated validation
  validateUserLogin,
  validateId,
};