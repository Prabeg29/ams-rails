import { useState } from "react";
import { toast } from "react-toastify";

import { User } from "../../types";
import userService from "../../services/userService";

interface Props {
	user: User;
	onSuccess: () => void;
}

const DeleteUser: React.FC<Props> = (props) => {
  const { user, onSuccess } = props;
	const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await userService.delete(user.id);
      toast.success("User deleted successfully.");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error);
    } finally {
      setLoading(false);
    }
	};

	return (
		<div className="flex flex-col">
			<p>You are about to delete {user.email}</p>
			<div className="mt-4 flex justify-end">
				<button
					disabled={loading}
					onClick={confirmDelete}
					className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default DeleteUser;
