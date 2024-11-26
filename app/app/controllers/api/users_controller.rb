class Api::UsersController < ApplicationController
  before_action :setUser, only: [:show, :update, :destroy]

  def create
    ActiveRecord::Base.transaction do
      user = User.create!(userParams)

      if user.role == "artist"
        artist = Artist.create!(user_id: user.id)
      end

      render json: { success: true, message: "User created successfully", data: user }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { success: false, errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def index
    currentPage = params.fetch(:page, 1)
    perPage = params.fetch(:perPage, 5)

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

    data, paginationInfo = paginate(
      usersQuery,
      currentPage: currentPage,
      perPage: perPage,
      selectParams: "id, first_name, last_name, email, phone, dob, gender, role, address"
    ).values_at(:data, :paginationInfo)

    render json: { 
      success: true,
      message: "Users fetched successfully",
      data: data,
      paginationInfo: paginationInfo
    }
  end

  def show
    render json: { success: true, message: "User fetched successfully", data: @user }
  end

  def update
    if !@user.update(userParams)
      render json: { message: @user.errors }, status: :unprocessable_entity
      return
    end
      render json: { success: true, message: "User updated successfully", data: @user }
  end

  def destroy
    hasAnotherSuperAdmin = User.where("role = 'super_admin'").where("id != ?", @user.id).count

    if @user.role == "super_admin" && hasAnotherSuperAdmin == 0
      render json: { success: false, message: "Cannot destroy the single super admin" }
      return
    end
    
    @user.destroy
    render json: { success: true, message: "User deleted successfully" }
  end

  private
    def userParams
      params.permit(:first_name, :last_name, :email, :password, :phone, :dob, :gender, :role,  :address)
    end

    def setUser
      @user = User
        .select("id, first_name, last_name, email, phone, dob, gender, role, address")
        .find_by(id: params[:id])

      unless @user
        render json: { message: "User with given id does not exist" }, status: :not_found
        return
      end
    end
end
