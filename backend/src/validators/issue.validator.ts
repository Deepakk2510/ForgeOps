import { body } from "express-validator";

export const createIssueValidator = [
  body("repository")
    .notEmpty()
    .withMessage("Repository is required"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"]),

  body("labels")
    .optional()
    .isArray(),
];

export const updateIssueValidator = [
  body("status")
    .optional()
    .isIn(["Open", "In Progress", "Closed"]),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"]),

  body("labels")
    .optional()
    .isArray(),
];