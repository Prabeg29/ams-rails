module Api
  class ArtistsController < ApplicationController
    include PaginationHelper

    before_action :validate_role, only: [:create, :update]
    before_action :set_artist, only: [:show, :update, :destroy]

    def create
      ActiveRecord::Base.transaction do
        user = User.create!(user_params)
        artist = Artist.create!(artist_params.merge(user_id: user.id))

        render json: { 
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
      perPage = params.fetch(:perPage, 2)

      genderFilters = ["male", "female", "other"]

      usersWithArtistsQuery = User.where(role: :artist).includes(:artist)

      if params[:search].present?
        usersWithArtistsQuery = usersWithArtistsQuery.where("users.email LIKE ? OR CONCAT(users.first_name, ' ', users.last_name) LIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
      end

      if params[:gender].present? && genderFilters.include?(params[:gender])
        usersWithArtistsQuery = usersWithArtistsQuery.where(gender: params[:gender])
      end

      data, paginationInfo = paginate(
        usersWithArtistsQuery,
        currentPage: currentPage,
        perPage: perPage,
        selectParams: 'id, first_name, last_name, email, phone, dob, gender, role, address'
      ).values_at(:data, :paginationInfo)

      artists = data.map do |user|
        user.attributes.merge(
          first_release_year: user.artist.first_release_year,
          no_of_albums_released: user.artist.no_of_albums_released
        )
      end
      
      render json: { 
        success: true,
        message: "Artists fetched successfully",
        data: artists,
        paginationInfo: paginationInfo
      }
    end

    def show
      render json: {
        success: true,
        message: "Artist fetched successfully",
        data: @user.attributes.merge(
          first_release_year: @user.artist.first_release_year,
          no_of_albums_released: @user.artist.no_of_albums_released
        )
      }
    end

    def update
      ActiveRecord::Base.transaction do
        @user.update!(user_params)
        @user.artist.update!(artist_params)

        userAsArtist = @user.attributes.merge(
          first_release_year: @user.artist.first_release_year,
          no_of_albums_released: @user.artist.no_of_albums_released
        )

        render json: { success: true, message: "Artist updated successfully", data: userAsArtist }
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
    
    def destroy
      @artist.destroy
      render json: { success: true, message: "Artist dropped successfully" }
    end

    private
      def user_params
        params.permit(
          :first_name,
          :last_name,
          :email,
          :password,
          :phone,
          :dob,
          :gender,
          :address,
          :role
        )
      end

      def artist_params
        params.permit(
          :first_release_year,
          :no_of_albums_released
        )
      end

      def validate_role
        if user_params[:role] != "artist"
          render json: { message: "role must be 'artist'" }, status: :unprocessable_entity
        end
      end

      def set_artist
        @user = User.joins(:artist).find_by(users: { id: params[:id], role: "artist" })
        @artist = @user&.artist
  
        unless @user
          render json: { success: false, message: "Artist with given id does not exist" }, status: :bad_request
        end
      end
  end
end
