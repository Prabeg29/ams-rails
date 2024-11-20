class ApplicationController < ActionController::API
  include ActionController::Cookies

  SECRET = "super-secret-la"

  before_action :authenticate

  def encode(payload)
    JWT.encode(payload, SECRET)
  end

  def authenticate
    token = ""
    
    if request.headers["Authorization"] && !request.headers["Authorization"].split(" ")[1].empty?
      token = request.headers["Authorization"].split(" ")[1]
    elsif
      token = cookies[:accessToken].split(" ")[1]
    else
      render json: { success: false, message: "Token not provided" }, status: :unauthorized
    end
  
    begin
      decodedToken = JWT.decode(token, SECRET)
      @user = User.find_by(id: decodedToken["userId"])

      unless !!@user
        render json: { success: false, message: "Invalid token" }, status: :unauthorized
      end
    rescue JWT::ExpiredSignature
      render json: { success: false, message: "Token expired" }, status: :unauthorized
    end
  end
end
