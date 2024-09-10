import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, useState } from "react";
import { Input } from "@nextui-org/react";
import Cookies from "universal-cookie";
import { auth } from "../firebase";
import { useUser } from "../hooks/useUser";

import EyeSlashFilledIcon from "../assets/Icons/EyeSlashFilledIcon";
import EyeFilledIcon from "../assets/Icons/EyeFilledIcon";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserID } = useUser();
  const cookies = new Cookies();

  // Function to handle submit
  const handleSubmit = async () => {
    if (!validate("email")) {
      toast.error("Invalid input");
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      ).then(() => {
        setUserID(values.email);
        cookies.set("splito-500K-bSnjthd6R34VKoZS2B3", values.email, {
          path: "/",
          expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        });
      });

      setValues({
        email: "",
        password: "",
      });
      toast.success("Welcome");
      navigate("/user/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  // Toggle the password/confirm-password view
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Function to validate regex
  const validate = (name: string) => {
    switch (name) {
      case "email":
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.(com|in)$/;
        return regex.test(values[name]);
      default:
        break;
    }
  };

  const checkValidation = (name: keyof FormValues) => {
    if (values[name] === "") return false;
    return validate(name) ? false : true;
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onInputClear = (name: keyof FormValues) => {
    setValues({ ...values, [name]: "" });
  };

  return (
    <div className="w-screen h-screen grid place-items-center bg-custom-gradient">
      <div className="container mx-10 w-[400px] lg:max-w-[33.33%]  border-2  text-ds p-8 rounded-lg grid grid-flow-row justify-items-center backdrop-blur-lg">
        <h1 className="text-3xl my-2 font-nunito text-white">Welcome</h1>
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
          onChange={onChange}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => toggleVisibility()}
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
        <button
          onClick={handleSubmit}
          className="m-w-[40%] mt-5 px-8 py-2 mx-auto rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
        >
          LOG IN
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="mt-5 text-white font-nunito">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
