import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { Input } from "@nextui-org/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "universal-cookie";
import { auth, db } from "../firebase";
import { useUser } from "../hooks/useUser";

import EyeSlashFilledIcon from "../assets/Icons/EyeSlashFilledIcon";
import EyeFilledIcon from "../assets/Icons/EyeFilledIcon";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserID } = useUser();
  const cookies = new Cookies();

  // Function to handle submit
  const handleSubmit = async () => {
    if (
      !validate("password") ||
      !validate("confirmPassword") ||
      !validate("email")
    ) {
      toast.error("Invalid input");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      cookies.set("splito-bSnjthd6R34VKoZS2B3", values.email, {
        path: "/",
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      });
      await updateProfile(res.user, {
        displayName: values.name,
      });
      await setDoc(doc(db, "users", values.email), {
        uid: res.user.uid,
        displayName: values.name,
        email: values.email,
        totalLent: 0,
        totalBorrowed: 0,
        groups: [],
        expenses: [],
        friends: [values.email],
      });
      setUserID(values.email);
      setValues({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      toast.success("Welcome");
      navigate("/user/dashboard");
    } catch (error: any) {
      if (error.code == "auth/email-already-in-use") {
        toast.error("Email already in use");
      }
      if (error.code == "auth/invalid-email") {
        toast.error("Invalid email");
      }
      console.log(error);
    }
  };

  // Function to validate regex
  const validate = (name: string) => {
    switch (name) {
      case "password":
        return values[name].match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/
        );
      case "confirmPassword":
        return values[name] === values["password"];
      case "email":
        return values[name].match(/^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.(com|in)$/);
      default:
        break;
    }
  };

  // Toggle the password/confirm-password view
  const toggleVisibility = (passwordType: string) => {
    if (passwordType === "password") {
      setIsVisible(!isVisible);
    } else if (passwordType === "confirm-password") {
      setIsConfirmVisible(!isConfirmVisible);
    }
  };

  const checkValidation = (name: keyof FormValues) => {
    if (values[name] === "") return false;
    return validate(name) ? false : true;
  };

  // To check each password criteria
  const passwordValidate = (password: string) => {
    const lengthRegex = /^.{8,16}$/;
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[@$!%*?&#]/;

    if (!lengthRegex.test(password)) {
      return "Password must be between 8 and 16 characters long.";
    }
    if (!lowercaseRegex.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!uppercaseRegex.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!digitRegex.test(password)) {
      return "Password must contain at least one digit.";
    }
    if (!specialCharRegex.test(password)) {
      return "Password must contain at least one special character.";
    }

    return "Password is valid.";
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onInputClear = (name: keyof FormValues) => {
    setValues({ ...values, [name]: "" });
  };

  return (
    <div className="w-screen h-screen grid place-items-center bg-slate-500">
      <div className="container mx-10 w-[400px] lg:max-w-[33.33%]  border-2  text-ds p-8 rounded-lg grid grid-flow-row justify-items-center backdrop-blur-lg">
        <h1 className="text-3xl my-2 font-nunito text-white">Welcome</h1>
        <Input
          isRequired
          isClearable
          name="name"
          value={values.name}
          type="text"
          variant="underlined"
          label="Your Name"
          onChange={onChange}
          onClear={() => onInputClear("email")}
          classNames={{
            label: "text-white",
            innerWrapper: "",
            inputWrapper: "bg-transparent",
            input: "bg-transparent text-white",
          }}
        />
        <Input
          isRequired
          isClearable
          name="email"
          value={values.email}
          type="email"
          variant="underlined"
          isInvalid={checkValidation("email")}
          label="Email"
          onChange={onChange}
          onClear={() => onInputClear("email")}
          errorMessage="Invalid email"
          classNames={{
            label: "text-white",
            innerWrapper: "",
            inputWrapper: "bg-transparent",
            input: "bg-transparent text-white",
          }}
        />
        <Input
          isRequired
          name="password"
          value={values.password}
          label="Password"
          variant="underlined"
          isInvalid={checkValidation("password")}
          onChange={onChange}
          errorMessage={passwordValidate(values.password)}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => toggleVisibility("password")}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          classNames={{
            label: "text-white",
            innerWrapper: "",
            inputWrapper: "bg-transparent",
            input: "bg-transparent",
          }}
        />
        <Input
          isRequired
          name="confirmPassword"
          value={values.confirmPassword}
          label="Confirm Password"
          variant="underlined"
          isInvalid={checkValidation("confirmPassword")}
          onChange={onChange}
          errorMessage="Passwords do not match"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => toggleVisibility("confirm-password")}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isConfirmVisible ? "text" : "password"}
          classNames={{
            label: "text-white",
            innerWrapper: "",
            inputWrapper: "bg-transparent",
            input: "bg-transparent",
          }}
        />
        <button
          onClick={handleSubmit}
          className="m-w-[40%] mt-5 px-8 py-2 mx-auto rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
        >
          SIGN UP
        </button>
        <p>
          Have an account?{" "}
          <Link to="/login" className="mt-5 text-white font-nunito">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
