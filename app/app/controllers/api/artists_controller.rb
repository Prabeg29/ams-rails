module Api
  class ArtistsController < ApplicationController
    before_action :set_artist, only: [:show, :update, :destroy]

    def create
      ActiveRecord::Base.transaction do
        user = User.create!(user_params.merge(role: "artist"))
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
        @artist.update!(user_params.merge(role: "artist"))
        @artist.artist.update!(artist_params)

        render json: { success: true, message: "Artist updated successfully", data: @artist }
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
          :address
        ).reverse_merge(role: "artist")
      end

      def artist_params
        params.permit(
          :first_release_year,
          :no_of_albums_released
        )
      end

      def set_artist
        @artist = User.joins(:artist)
          .select("users.id, users.first_name, users.last_name, users.email, users.phone, users.dob, users.gender, users.address, artists.first_release_year, artists.no_of_albums_released")
          .find_by(users: { id: params[:id], role: "artist" })
        
        unless @artist
          render json: { success: false, message: "Artist with given id does not exist" }, status: :not_found
          return
        end
      end
  end
end
