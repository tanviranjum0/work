const yup = require("yup");
const formSchema = yup.object({
  username: yup
    .string()
    .required("Username Required")
    .min(6, "Minimum 6 character required")
    .max(26, "Username cannot contain over 26 characters"),
  password: yup
    .string()
    .required("Password Required")
    .min(8, "Password 8 character required")
    .max(26, "Password cannot contain over 26 characters"),
});
const validateForm = (req, res) => {
  const formData = req.body;
  // console.log(req.body);
  formSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).send(err.errors);
      console.log(err.errors);
    })
    .then((valid) => {
      if (valid) {
        console.log("Form is good");
      }
    });
};

module.exports = validateForm;
