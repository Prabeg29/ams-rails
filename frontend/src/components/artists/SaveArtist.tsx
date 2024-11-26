import * as Yup from "yup";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import { Artist } from "../../types";
import artistService from "../../services/artistService";
import { formatDateTimeToYMD } from "../../utils/common";

type SaveArtistProps = {
  mode: "CREATE" | "EDIT";
  onSuccess: () => void;
  artist?: Artist;
};

const InputField = ({
  label,
  name,
  type = "text",
  disabled = false,
}: {
  label: string;
  name: string;
  type?: string;
  disabled?: boolean;
}) => (
  <div>
    <div className="flex items-center">
      <label className="w-1/4">{label}</label>
      <div className="w-3/4">
        <Field
          name={name}
          type={type}
          disabled={disabled}
          className={`w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-blue-500 ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
    <div className="flex items-center">
      <div className="w-1/4"></div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  </div>
);

const SaveArtist: React.FC<SaveArtistProps> = (props) => {
  const { mode, artist, onSuccess } = props;

  const defaultValues = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    first_release_year: "",
    no_of_albums_released: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("* Required"),
    last_name: Yup.string(),
    email: Yup.string().email("* Invalid email address").required("* Required"),
    dob: Yup.date()
      .required("* Required")
      .test("valid-year", "* Invalid year in date of birth", (value) => {
        if (!value) return false;
        const year = value.getFullYear();
        return year >= 1900 && year <= new Date().getFullYear();
      }),
    gender: Yup.string()
      .oneOf(["male", "female", "other"])
      .required("* Required"),
    address: Yup.string(),
    phone: Yup.string().required("* Required"),
    first_release_year: Yup.number()
      .required("* Required")
      .integer("* Must be a whole number")
      .min(1900, "* Must be a valid year")
      .max(new Date().getFullYear(), "* Cannot be in the future"),
    no_of_albums_released: Yup.number()
      .required("* Required")
      .positive("* Must be a positive number")
      .integer("* Must be a whole number"),
  });

  const handleSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    setSubmitting(true);
    try {
      if (mode === "CREATE") {
        const response = await artistService.create(values);
      } else {
        delete values.id;
        console.log(values);
        await artistService.update(artist.id, values);
      }

      // toast.success(response.data.message);
      onSuccess();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Formik
        initialValues={mode === "EDIT" ? { ...artist, dob: formatDateTimeToYMD(artist?.dob as string) } : defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-full grid grid-cols-1 gap-3">
            <InputField label="First Name" name="first_name" />
            <InputField label="Last Name" name="last_name" />
            <InputField label="Email" name="email" type="email" />
            {mode === "CREATE" && (
              <InputField label="Password" name="password" type="password" />
            )}
            <InputField label="Date of Birth" name="dob" type="date" />
            <InputField label="Phone" name="phone" />
            <InputField label="Address" name="address" />

            <div>
              <div className="flex items-center">
                <label className="w-1/4">Gender</label>
                <div className="flex space-x-5">
                  {["male", "female", "other"].map((genderOption) => (
                    <label
                      key={genderOption}
                      className="flex items-center cursor-pointer space-x-2"
                    >
                      <Field
                        type="radio"
                        name="gender"
                        value={genderOption}
                        className="form-radio text-blue-500"
                      />
                      <span>{genderOption}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>

            <InputField
              label="First Release Year"
              name="first_release_year"
              type="number"
            />
            <InputField
              label="No. of Albums Released"
              name="no_of_albums_released"
              type="number"
            />

            <div>
              <button
                type="submit"
                className="w-full flex justify-center gap-2 align-middle py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-500"
                disabled={isSubmitting}
              >
                Save
                {isSubmitting && (
                  <div className="animate-spin border-2 border-t-transparent border-gray-300 rounded-full w-4 h-4 my-auto" />
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SaveArtist;
