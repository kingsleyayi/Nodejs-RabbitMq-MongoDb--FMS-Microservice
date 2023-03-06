import { body, ValidationChain } from "express-validator";

export const userRegistrationValidator: ValidationChain[] = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("Please enter name.")
    .trim()
    .isString()
    .withMessage("Please enter valid name."),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password.")
    .trim()
    .isString()
    .withMessage("Please enter valid password."),
  body("address")
    .not()
    .isEmpty()
    .withMessage("Please enter address.")
    .trim()
    .isString()
    .withMessage("Please enter valid address."),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email.")
    .trim()
    .isEmail()
    .withMessage("Please enter valid Email."),
];

export const userLoginValidator: ValidationChain[] = [
  body("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password.")
    .trim()
    .isString()
    .withMessage("Please enter valid password."),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email.")
    .trim()
    .isEmail()
    .withMessage("Please enter valid Email."),
];
