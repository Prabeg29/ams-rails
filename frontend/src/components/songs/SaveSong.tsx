import * as Yup from "yup";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import { Song } from "../../types";
import songService from "../../services/songService";
import { AxiosError } from "axios";

interface SaveSongProps {
  mode: "EDIT" | "CREATE";
  onSuccess: () => void;
  artistId: number;
  song?: Song;
}

const validationSchema = Yup.object({
  title: Yup.string().required("* Required").max(255, "Title too long"),
	album_name: Yup.string().required("* Required").max(255, "Album name too long"),
	genre: Yup.mixed().oneOf(["rnb", "country", "classic", "rock", "jazz"], "Invalid genre").required("* Required"),
});

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
			<ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
		</div>
  </div>
);

const SaveSong: React.FC<SaveSongProps> = (props) => {
  const { mode, onSuccess, artistId, song } = props;

  const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
    setSubmitting(true);
    try {
      if (mode === "CREATE") {
        await songService.create(artistId, values)
      } else {
        const songId = song?.id;
        delete values.id
        await songService.update(artistId, songId, values);
      }

      // toast.success(response.data.message);
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Formik 
        initialValues={{
					title: song?.title || "",
					album_name: song?.album_name || "",
					genre: song?.genre || "rnb",
				}}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => {
          return (
            <Form className="w-full grid grid-cols-1 gap-3">
              <InputField label="Title" name="title" />
              <InputField label="Album Name" name="album_name" />
              
              <div className="flex items-center">
                <label className="w-1/4">Genre</label>
                <div className="flex space-x-3">
                  {["rnb", "country", "classic", "rock", "jazz"].map((genreOption) => (
                    <label key={genreOption} className="flex items-center cursor-pointer space-x-2">
                      <Field type="radio" name="genre" value={genreOption} className="form-radio text-blue-500" />
                      <span>{genreOption}</span>
                    </label>
                  ))}
                </div>
              </div>
  
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
        }
      </Formik>
    </div>
  );
};

export default SaveSong;
