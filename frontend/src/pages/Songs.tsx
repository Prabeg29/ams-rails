import { useParams } from "react-router";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";

import { Song } from "../types";
import http from "../utils/http";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../hooks/useModal";
import SaveSong from "../components/songs/SaveSong";
import Pagination from "../components/common/Pagination";

const Songs = () => {
  const params = useParams();
  const { user } = useAuth();
	let artistId = params.id as number | undefined;

  if (!artistId) {
    artistId = user.id as number;
  }

  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const { modal, triggerModal, closeModal } = useModal();

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await http.get(`/artists/${artistId}/songs`);

      setSongs(response.data.data);
      setCurrentPage(response.data.paginationInfo.currentPage);
      setLastPage(response.data.paginationInfo.lastPage);
      setPerPage(response.data.paginationInfo.perPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchSongs();
  }, [currentPage, perPage, fetchSongs]);

  const closeAndRefetch = () => {
		closeModal();
		fetchSongs();
	};

	const addSongModal = () => {
		triggerModal("Add Song", <SaveSong mode="CREATE" onSuccess={closeAndRefetch} artistId={artistId} />);
	};

  const editSongModal = (selectedSong: Song) => {
		triggerModal("Edit Song", <SaveSong mode="EDIT" onSuccess={closeAndRefetch}  artistId={artistId} song={selectedSong} />);
	};

  // const deleteSongModal = (selectedSong: Song) => {
	// 	triggerModal("Delete Song", <DeleteSong song={selectedSong!} onSuccess={closeAndRefetch} />);
	// };

  return (
    <div className="flex flex-col h-full w-full items-center">
      {modal}
      <div className="flex w-full justify-between items-center h-[75px]">
        <h1 className="text-2xl font-bold text-gray-700">Songs</h1>
        <button
          className="rounded-md px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          onClick={addSongModal}
        >
          Add Songs
        </button>
      </div>
      {isLoading ? (
        <p>Loading</p>
      ) : songs.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No songs found</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-md">
          <table className="min-w-full border">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Album</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Genre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-2 text-sm text-gray-800">
                    {song.title}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-800">{song.album_name}</td>
                  <td className="px-6 py-2 text-sm text-gray-800">{song.genre}</td>
                  <td>
                    <button
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
                      onClick={() => editSongModal(song)}
                    >
                      <FaPencil />
                    </button>
                    <button
                      className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
                      // onClick={() => deleteSongModal(song)}
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

export default Songs;
