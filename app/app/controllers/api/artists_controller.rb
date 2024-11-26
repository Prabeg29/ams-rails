require "csv"

class Api::ArtistsController < ApplicationController
  before_action :setArtist, only: [:show, :update, :destroy]

  def create
    ActiveRecord::Base.transaction do
      user = User.create!(userParams.merge(role: "artist"))
      artist = Artist.create!(artistParams.merge(user_id: user.id))

      render json: {
        success: true, 
        message: "Artists created successfully",
        data: user.attributes.merge(
          first_release_year: artist.first_release_year,
          no_of_albums_released: artist.no_of_albums_released
        )
      }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def index
    currentPage = params.fetch(:page, 1)
    perPage = params.fetch(:perPage, 5)

    genderFilters = ["male", "female", "other"]

    usersWithArtistsQuery = User.joins(:artist)

    if params[:search].present?
      usersWithArtistsQuery = usersWithArtistsQuery.where("users.email LIKE ? OR CONCAT(users.first_name, " ", users.last_name) LIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
    end

    if params[:gender].present? && genderFilters.include?(params[:gender])
      usersWithArtistsQuery = usersWithArtistsQuery.where(gender: params[:gender])
    end

    data, paginationInfo = paginate(
      usersWithArtistsQuery,
      currentPage: currentPage,
      perPage: perPage,
      selectParams: "users.id, users.first_name, users.last_name, users.email, users.phone, users.dob, users.gender, users.address, artists.first_release_year, artists.no_of_albums_released"
    ).values_at(:data, :paginationInfo)

    render json: { 
      success: true,
      message: "Artists fetched successfully",
      data: data,
      paginationInfo: paginationInfo
    }
  end

  def show
    render json: { success: true, message: "Artist fetched successfully", data: @artist }
  end

  def update
    ActiveRecord::Base.transaction do
      @artist.update!(userParams.merge(role: "artist"))
      @artist.artist.update!(artistParams)

      render json: { success: true, message: "Artist updated successfully", data: @artist }
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end
  
  def destroy
    @artist.destroy
    render json: { success: true, message: "Artist dropped successfully" }
  end

  def csvExport
    usersWithArtistsQuery = User.joins(:artist)
      .select("users.id, users.first_name, users.last_name, users.email, users.phone, users.dob, users.gender, users.address, artists.first_release_year, artists.no_of_albums_released")

    csvData = CSV.generate(headers: true) do |csv|
      csv << ["First Name", "Last Name", "Email", "Phone", "DOB", "Gender", "Address", "First Release Year", "No of Albums Released"]
    
      usersWithArtistsQuery.find_each(batch_size: 100) do |artist|
        csv << [
          artist.first_name, 
          artist.last_name, 
          artist.email, 
          artist.phone, 
          artist.dob, 
          artist.gender,
          artist.address, 
          artist.first_release_year, 
          artist.no_of_albums_released
        ]
      end
    end

    send_data csvData, filename: "artists_#{Date.today}.csv", type: "text/csv", disposition: "attachment"
  end

  def csvImport
    if params[:file].blank?
      render json: { success: false, message: "No file uploaded" }, status: :bad_request
      return
    end

    usersData = []
    artistsData = []

    csvFile = File.open(params[:file])

    begin
      CSV.foreach(csv_file, headers: true) do |row|
        userParams = {
          first_name: row["First Name"],
          last_name: row["Last Name"],
          email: row["Email"],
          phone: row["Phone"],
          dob: row["DOB"],
          gender: row["Gender"],
          address: row["Address"]
        }

        artistParams = {
          first_release_year: row["First Release Year"],
          no_of_albums_released: row["No of Albums Released"]
        }

        usersData << userParams
        artistsData << artistParams
      end

      User.upsert_all(users_data, unique_by: :email)

      upsertedUsersIds = User.where(email: usersData.map { |user| user[:email] }).pluck(:email, :id).to_h

      artistsData.each_with_index do |artistData, index|
        artistsData[index][:user_id] = upsertedUsersIds[usersData[index][:email]]
      end

      Artist.upsert_all(artistsData, unique_by: :user_id)
      
      render json: { success: true, message: "CSV imported successfully" }, status: :ok
    rescue CSV::MalformedCSVError => e
      render json: { success: false, message: "Invalid CSV file format: #{e.message}" }, status: :unprocessable_entity
    rescue => e
      render json: { success: false, message: "An error occurred: #{e.message}" }, status: :internal_server_error
    end
  end

  private
    def userParams
      params.permit(:first_name, :last_name, :email, :password, :phone, :dob, :gender, :address)
        .reverse_merge(role: "artist")
    end

    def artistParams
      params.permit(:first_release_year, :no_of_albums_released)
    end

    def setArtist
      @artist = User.joins(:artist)
        .select("users.id, users.first_name, users.last_name, users.email, users.phone, users.dob, users.gender, users.address, artists.first_release_year, artists.no_of_albums_released")
        .find_by(users: { id: params[:id], role: "artist" })
      
      unless @artist
        render json: { success: false, message: "Artist with given id does not exist" }, status: :not_found
        return
      end
    end
end
