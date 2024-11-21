class Api::SongsController < ApplicationController
  before_action :validateArtist, only: %i[create index show update destroy]
  before_action :setSong, only: %i[show update destroy]

  def create
    @song = Song.new(songParams.merge(artist_id: @authenticatedUser.artist.id))

    if !@song.save
      render json: { success: false, message: @song.errors }, status: :unprocessable_entity
      return 
    end

    render json: { success: true, message: "Song created successfully", data: @song }, status: :created
  end

  def index
    currentPage = params.fetch(:page, 1)
    perPage = params.fetch(:perPage, 2)

    genreFilters = ["rnb", "country", "classic", "rock", "jazz"]

    songsQuery = Song

    if params[:search].present?
      songsQuery = songsQuery.where("songs.title LIKE ? OR songs.album_name LIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
    end

    if params[:genre].present? && genreFilters.include?(params[:genre])
      songsQuery = songsQuery.where(genre: params[:genre])
    end

    data, paginationInfo = paginate(
      songsQuery,
      currentPage: currentPage,
      perPage: perPage,
      selectParams: "id, title, album_name, genre", 
    ).values_at(:data, :paginationInfo)

    render json: { success: true, message: "Songs fetched successfully", data: data, paginationInfo: paginationInfo }
  end

  def show
    render json: { success: true, message: "Song fetched successfully", data: @song }
  end

  def update
    @song.update!(songParams.merge(artist_id: @authenticatedUser.artist.id))

    render json: { success: true, message: "Song updated successfully", data: @song }
  end

  def destroy
    @song.destroy

    render json: { success: true, message: "Song dropped successfully" }
  end

  private
    def validateArtist
      unless params[:artist_id].to_i == @authenticatedUser.id
        render json: { success: false, message: "Resource belongs to a different user" }, status: :forbidden
      end
    end

    def setSong
      @song = Song.where(artist_id: @authenticatedUser.artist.id).find_by(id: params[:id])
      unless @song
        render json: { success: false, message: "Song with given id does not exist" }, status: :not_found
      end
    end

    def songParams
      params.permit(:title, :album_name, :genre)
    end
end
