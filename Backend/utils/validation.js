const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedEditFields.includes(field)
    );
    throw new Error(
      `Invalid fields: ${invalidFields.join(
        ", "
      )}. Allowed fields are: ${allowedEditFields.join(", ")}`
    );
  }

  // Additional validation for specific fields
  if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
    throw new Error("Invalid email format");
  }

  if (req.body.age && (req.body.age < 18 || req.body.age > 100)) {
    throw new Error("Age must be between 18 and 100");
  }

  if (
    req.body.gender &&
    !["male", "female", "other"].includes(req.body.gender)
  ) {
    throw new Error("Gender must be male, female, or other");
  }

  if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
    throw new Error("Invalid photo URL format");
  }

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
