module Api
  class UsersController < ApplicationController
    before_action :set_user, only: %i[ show update destroy ]

    def create
      @user = User.new(user_params)

      if @user.save
        render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    def index
      @users = User.all
  
      render json: @users.as_json(except: [:password, :password_digest])
    end
  
    def show
      render json: @user
    end
  
    def update
      if @group.update(group_params)
        render json: @group
      else
        render json: @group.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @group.destroy
    end
  
    private
      def user_params
        params.require(:user).permit(:first_name, :last_name, :email, :password, :gender, :role)
      end

      def set_user
        @user = User.find(params[:id])
      end
  end  
end