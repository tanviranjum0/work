import {
  VStack,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Input,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, useFormik } from "formik";
import * as yup from "yup";
import TextField from "./TextField";
import { ArrowBackIcon } from "@chakra-ui/icons";
const Login = () => {
  const navigate = useNavigate();
  // const formik = useFormik({
  //   initialValues: {
  //     username: "",
  //     password: "",
  //   },
  //   validationSchema: yup.object({
  //     username: yup
  //       .string("Enter a valid username")
  //       .min(2, "Username must be at least 6 characters long")
  //       .required("Username is required"),
  //     password: yup
  //       .string("Enter a valid password")
  //       .min(8, "Password must be at least 8 characters long")
  //       .required("Password is required"),
  //   }),
  //   onSubmit: (values, actions) => {
  //     alert(JSON.stringify(values, null, 2));
  //     actions.resetForm();
  //   },
  // });
  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={yup.object({
        username: yup
          .string("Enter a valid username")
          .min(2, "Username must be at least 6 characters long")
          .required("Username is required"),
        password: yup
          .string("Enter a valid password")
          .min(8, "Password must be at least 8 characters long")
          .required("Password is required"),
      })}
      onSubmit={(values, actions) => {
        const vals = { ...values };

        // alert(JSON.stringify(values, null, 2));
        actions.resetForm();
        fetch("http://localhost:4000/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vals),
        })
          .catch((err) => {
            return;
          })
          .then((res) => {
            if (!res || !res.ok || res.status >= 400) {
              return;
            } else {
              res.json();
            }
          })
          .then((data) => {
            if (!data) {
              return;
            } else {
              console.log(data);
            }
          });
      }}
    >
      {(formik) => (
        <VStack
          onSubmit={formik.handleSubmit}
          w={{ base: "90%", md: "500px" }}
          m={"auto"}
          justify={"center"}
          h={"100vh"}
          spacing={"1rem"}
          as={Form}
        >
          <Heading>Log In</Heading>
          <TextField
            name="username"
            placeContent={"Enter Username"}
            label={"Username"}
          ></TextField>
          <TextField
            name="password"
            label={"Password"}
            placeContent={"Enter password"}
          ></TextField>
          {/* <FormControl
            isInvalid={formik.errors.username && formik.touched.username}
          >
            <FormLabel fontSize={"lg"}>Username</FormLabel>
            <Input
              name="username"
              placeContent={"Enter Username"}
              size={"lg"}
              {...formik.getFieldProps("username")}
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            ></Input>
            <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
          </FormControl> */}
          {/* <FormControl
            isInvalid={formik.errors.password && formik.touched.password}
          >
            <FormLabel fontSize={"lg"}>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeContent={"Enter Password"}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              onChange={formik.handleChange}
              {...formik.getFieldProps("password")}
              size={"lg"}
            ></Input>
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl> */}

          {/* _______ */}
          {/* <FormControl>


       <FormLabel fontSize={"lg"}>Email</FormLabel>
       <Input
         name="Username"
         placeContent={"Enter Username"}
         size={"lg"}
       ></Input>
       <FormErrorMessage>Invalid username</FormErrorMessage>
     </FormControl> */}
          <ButtonGroup>
            <Button colorScheme="teal" type="submit">
              Log In
            </Button>
            <Button onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </ButtonGroup>
        </VStack>
      )}
    </Formik>
  );
};

export default Login;
