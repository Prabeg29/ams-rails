import * as Yup from "yup";
import { Link } from "react-router";
import { toast } from "react-toastify"; 
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import { useAuth } from "../hooks/useAuth";
import authService, { LoginProps } from "../services/authService";

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("* Required"),
  password: Yup.string().required("* Required"),
});

const Login = () => {
  const { login }  = useAuth();

  const handleSubmit = async (values: LoginProps, { setSubmitting }: FormikHelpers<LoginProps>) => {
    setSubmitting(false);

    try {
      const { data: { data: user } } = await authService.login(values);

      login(user);
    } catch (err) {
      toast.error(err.response?.data?.error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Email</label>
                <Field 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  type="email" 
                  name="email" 
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Password</label>
                <Field 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  type="password" 
                  name="password" 
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-600">Don't have an account? <Link to="/register">Register</Link></p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
