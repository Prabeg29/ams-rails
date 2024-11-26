class Api::AuthController < ApplicationController
  ACCESS_TOKEN_EXPIRY = 1.day.from_now
  REFRESH_TOKEN_EXPIRY = 7.days.from_now

  skip_before_action :authenticate, only: [:register, :login, :generateAccessToken]

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

  def login
    @user = User.find_by(email: loginParams[:email])

    if @user.nil? || !@user.authenticate(loginParams[:password])
      render json: { success: false, message: "Invalid credentials" }, status: :unauthorized
      return
    end

    accessToken = encode({ userId: @user.id, email: @user.email, role: @user.role, exp: ACCESS_TOKEN_EXPIRY.to_i })
    refreshToken = encode({ userId: @user.id, email: @user.email, role: @user.role, exp: REFRESH_TOKEN_EXPIRY.to_i })

    setTokensAsHttpOnlyCookies(accessToken, refreshToken)

    render json: {
      success: true,
      message: "User logged in successfully",
      data: @user,
      type: "Bearer",
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  end

  def generateAccessToken
    if !cookies[:refreshToken]
      render json: { success: false, message: "Invalid token" }, status: :bad_request
      return
    end

    begin
      decodedToken = JWT.decode(cookies[:refreshToken], SECRET)
      @user = User.find_by(id: decodedToken["userId"])

      unless !!@user
        render json: { success: false, message: "Invalid token" }, status: :unauthorized
      end

      accessToken = encode({ userId: @user.id, email: @user.email, role: @user.role, exp: ACCESS_TOKEN_EXPIRY.to_i })

      cookies[:accessToken] = {
        value: "Bearer " + accessToken,
        httponly: true,
        secure: Rails.env.production?,
        expires: ACCESS_TOKEN_EXPIRY
      }
    rescue JWT::ExpiredSignature
      render json: { success: false, message: "Token expired" }, status: :unauthorized
    end
  end

  def logout
    cookies.delete(:accessToken)
    cookies.delete(:refreshToken)

    render json: { success: true, message: "Logged out successfully" }, status: :ok
  end

  private
    def registrationParams
      params.permit(
        :first_name,
        :last_name,
        :email,
        :password,
        :phone,
        :gender,
        :role,
        :address
      )
    end

    def loginParams
      params.permit(:email, :password)
    end
  
    def setTokensAsHttpOnlyCookies(accessToken, refreshToken)
      cookies[:accessToken] = {
        value: "Bearer " + accessToken,
        httponly: true,
        secure: Rails.env.production?,
        expires: ACCESS_TOKEN_EXPIRY
      }
  
      cookies[:refresh_token] = {
        value: refreshToken,
        httponly: true,
        secure: Rails.env.production?,
        expires: REFRESH_TOKEN_EXPIRY
      }
    end
end
