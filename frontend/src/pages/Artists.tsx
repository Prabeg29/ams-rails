import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { FiDownload } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";

import http from "../utils/http";
import { Artist } from "../types";
import { useModal } from "../hooks/useModal";
import Pagination from "../components/common/Pagination";
import SaveArtist from "../components/artists/SaveArtist"; 
import DeleteArtist from "../components/artists/DeleteArtist";

const Artists = () => {
  const navigate = useNavigate();

  const [artists, setArtits] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const { modal, triggerModal, closeModal } = useModal();

  const fetchArtists = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await http.get(`/artists?page=${currentPage}&perPage=${perPage}`);

      setArtits(response.data.data);
      setCurrentPage(response.data.paginationInfo.currentPage);
      setLastPage(response.data.paginationInfo.lastPage);
      setPerPage(response.data.paginationInfo.perPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    fetchArtists();
  }, [currentPage, perPage, fetchArtists]);

  const closeAndRefetch = () => {
		closeModal();
		fetchArtists();
	};

  const addArtistModal = () => {
    triggerModal("Add Artist", <SaveArtist mode="CREATE" onSuccess={closeAndRefetch} />)
  };

  const exportToCSV = async () => {
    setIsLoading(true);
    try {
      await http.post("/artists/csvExport");
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const editArtistModal = (selectedArtist: Artist) => {
    triggerModal("Edit Artist", <SaveArtist mode="EDIT" onSuccess={closeAndRefetch} artist={selectedArtist} />);
  };

  const deleteArtistModal = (selectedArtist: Artist) => {
		triggerModal("Delete Artist", <DeleteArtist artist={selectedArtist!} onSuccess={closeAndRefetch} />);
  };

  const navigateToSongsPage = (id: number) => {
		navigate(`/artists/${id}/songs`);
	};

  return (
    <div className="flex flex-col h-full w-full items-center">
      {modal}
      <div className="flex w-full justify-between items-center h-[75px]">
        <h1 className="text-2xl font-bold text-gray-700">Artists</h1>

        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center rounded-md px-3 py-2 text-sm border hover:border-blue-500 hover:text-blue-500 "
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin border-2 border-t-transparent border-gray-300 rounded-full w-4 h-4 my-auto" />
            ) : (
              <FiDownload />
            )}
          </button>

          <button
						onClick={addArtistModal}
						className="rounded-md px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md"
					>
						Add Artist
					</button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center col-span-full h-48">
          <div className="animate-spin border-4 border-t-transparent border-gray-300 rounded-full w-12 h-12"></div>
        </div>
      ) : artists.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No artists found</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-md">
          <table className="min-w-full border">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Gender</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">First Release Year</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">No. of Albums Released</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id} className="hover:bg-gray-50 transition-all">
                  <td
                    className="px-6 py-2 text-sm text-blue-500 hover:underline cursor-pointer"
                    onClick={() => navigateToSongsPage(artist.id)}
                  >
                    {artist.first_name} {artist.last_name}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-800">{artist.email}</td>
                  <td className="px-6 py-2 text-sm text-gray-800">
                    {artist.gender === "male" ? "Male" : artist.gender === "female" ? "Female" : "Other"}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-800">{artist.first_release_year}</td>
                  <td className="px-6 py-2 text-sm text-gray-800">{artist.no_of_albums_released}</td>
                  <td>
                    <button
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
                      onClick={() => editArtistModal(artist)}
                    >
                      <FaPencil />
                    </button>
                    <button
                      className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
                      onClick={() => deleteArtistModal(artist)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Artists;
