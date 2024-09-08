import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import EyeSlashFilledIcon from "../components/Icons/EyeSlashFilledIcon";
import EyeFilledIcon from "../components/Icons/EyeFilledIcon";
import { ChangeEvent, useState } from "react";
import { Input } from "@nextui-org/react";

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
  //   const { setCurrentUser } = useContext(AuthContext);
  //   const cookies = new Cookies();

  // Function to handle submit
  const handleSubmit = async () => {
    if (!validate("email")) {
      toast.error("Invalid input");
      return;
    }

    try {
      const response = await axios
        .post(`/employee/login`, values)
        .then((response) => response.data);

      const user = {
        firstName: response["Name"]?.split(" ")[0] || "",
        lastName: response["Name"]?.split(" ")[1] || "",
        department: response["Department"] || "",
        role: response["Role"] || "",
        emailID: response["EmailId"] || "",
        image: response["Image"] || null,
      };

      const token = response["Token"];
      cookies.set("cric-rigel-bSq5Q2snkVKoZS2B3jlK", token, {
        path: "/",
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);
      toast.success("Logged in");
      setValues({
        email: "",
        password: "",
      });
      return user.department === "All"
        ? navigate("/auth/select-department")
        : navigate(`/${user.department.toLowerCase()}/dashboard`);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        toast.error("Server down");
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network down");
      } else if (error.response?.status === 404) {
        toast.error("Employee not found!!");
      } else if (error.response?.status === 401) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("Error");
      }
      console.log("Error submitting form", error);
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
        const regex =
          /^[A-Za-z0-9._%+-]+@(lawsikho\.in|skillarbitra\.ge|ipleaders\.in|dataisgood\.com)$/;
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
    <div className="w-screen h-screen grid place-items-center  bg-custom-gradient">
      <div className="container mx-10 w-[400px] lg:max-w-[33.33%]  border-2  text-ds p-8 rounded-lg grid grid-flow-row justify-items-center backdrop-blur-md">
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
        <Link
          to="/auth/forgot-password"
          className="mt-5 text-white font-nunito"
        >
          Forgot password?
        </Link>
        <button
          onClick={handleSubmit}
          className="m-w-[40%] mt-5 px-8 py-2 mx-auto rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
