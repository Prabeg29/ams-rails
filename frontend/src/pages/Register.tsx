import * as Yup from "yup";
import { Link, useNavigate } from "react-router";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import authService, { RegisterProps } from "../services/authService";
import { toast } from "react-toastify";

const registrationSchema = Yup.object({
  first_name: Yup.string().required("* Required"),
  last_name: Yup.string().required("* Required"),
  email: Yup.string().email("Invalid email address").required("* Required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("* Required"),
  phone: Yup.string(),
  dob: Yup.string(),
  gender: Yup.string().required("* Required"),
  address: Yup.string(),
});

const Register =  () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterProps, { setSubmitting }: FormikHelpers<RegisterProps>) => {
    setSubmitting(false);

    try {
      await authService.register(values);

      navigate("/login");
    } catch(err) {
      toast.error(err.response?.data?.error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Register</h2>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "", 
            email: "",
            password: "",
            phone: "",
            dob: "",
            gender: "",
            address: "",
            role: ""
          }}
          validationSchema={registrationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
									<label htmlFor="first_name" className="block text-gray-700 mb-1">
										First Name
									</label>
									<Field
										name="first_name"
										type="text"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									/>
									<ErrorMessage name="first_name" component="div" className="text-red-500 text-xs mt-1" />
								</div>

                <div>
									<label htmlFor="last_name" className="block text-gray-700 mb-1">
										Last Name
									</label>
									<Field
										name="last_name"
										type="text"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									/>
									<ErrorMessage name="last_name" component="div" className="text-red-500 text-xs mt-1" />
								</div>
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Email</label>
                <Field 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  type="email" 
                  name="email" 
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Password</label>
                <Field 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  type="password" 
                  name="password" 
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Date of Birth</label>
                <Field 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  type="date" 
                  name="dob" 
                />
                <ErrorMessage name="dob" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
									<label htmlFor="phone" className="block text-gray-700 mb-1">
										Phone
									</label>
									<Field
										type="text"
										name="phone"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									/>
									<ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
								</div>

								<div>
									<label htmlFor="address" className="block text-gray-700 mb-1">
										Address
									</label>
									<Field
										type="text"
										name="phone"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									/>
									<ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
								</div>
							</div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
									<label htmlFor="gender" className="block text-gray-700 mb-1">
										Gender
									</label>
									<Field
										as="select"
										name="gender"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									>
										<option value="">Select Gender</option>
										<option value="male">Male</option>
										<option value="female">Female</option>
										<option value="other">Other</option>
									</Field>
									<ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
								</div>

								<div>
									<label htmlFor="dob" className="block text-gray-700 mb-1">
										Role
									</label>
									<Field
										as="select"
										type="role"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									>
                    <option value="">Select Role</option>
										<option value="m">Artist Manager</option>
										<option value="f">Artist</option>
									</Field>
									<ErrorMessage name="dob" component="div" className="text-red-500 text-xs mt-1" />
								</div>
							</div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-600">Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
