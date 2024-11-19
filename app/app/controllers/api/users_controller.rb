module Api
  class UsersController < ApplicationController
    include PaginationHelper

    before_action :set_user, only: [:show, :update, :destroy]

    def create
      @user = User.new(user_params)

      if !@user.save
        render json: { success: false, message: @user.errors }, status: :unprocessable_entity
        return 
      end

      render json: { success: true, message: "User created successfully", data: @user }, status: :created
    end
  
    def index
      currentPage = params.fetch(:page, 1)
      perPage = params.fetch(:perPage, 2)

      roleFilters = ["artist_manager", "artist"]
      genderFilters = ["male", "female", "others"]

      usersQuery = User

      if params[:search].present?
        usersQuery = usersQuery.where("users.email LIKE ? OR CONCAT(users.first_name, ' ', users.last_name) LIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
      end

      if params[:role].present? && roleFilters.include?(params[:role])
        usersQuery = usersQuery.where(role: params[:role])
      end

      if params[:gender].present? && genderFilters.include?(params[:gender])
        usersQuery = usersQuery.where(gender: params[:gender])
      end

      result = paginate(
        usersQuery,
        currentPage: currentPage,
        perPage: perPage,
        selectParams: 'id, first_name, last_name, email, phone, dob, gender, role, address', 
        countParam: 'id'
      )

      render json: { 
        success: true,
        message: "Users fetched successfully",
        data: result[:data],
        paginationInfo: result[:paginationInfo]
      }
    end
  
    def show
      render json: { success: true, message: "User fetched successfully", data: @user }
    end
  
    def update
      if !@user.update(user_params)
        render json: { message: @user.errors }, status: :unprocessable_entity
        return
      end
        render json: { success: true, message: "User updated successfully", data: @user }
    end
  
    def destroy
      @user.destroy
      render json: { success: true, message: "User deleted successfully" }
    end
  
    private
      def user_params
        params.require(:user).permit(:first_name, :last_name, :email, :password, :gender, :role)
      end

      def set_user
        @user = User.where(id: params[:id])
          .select('id, first_name, last_name, email, phone, dob, gender, role, address')

        unless @user
          render json: { message: "User with given id does not exist" }, status: :bad_request
        end
      end
  end  
end
