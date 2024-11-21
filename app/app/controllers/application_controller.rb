class ApplicationController < ActionController::API
  include ActionController::Cookies
  include PaginationHelper

  SECRET = "super-secret-la"

  before_action :authenticate

  def encode(payload)
    JWT.encode(payload, SECRET)
  end

  def authenticate
    token = ""
    
    if request.headers["Authorization"] && !request.headers["Authorization"].split(" ")[1].empty?
      token = request.headers["Authorization"].split(" ")[1]
    elsif cookies[:accessToken]
      token = cookies[:accessToken].split(" ")[1]
    else
      render json: { success: false, message: "Token not provided" }, status: :unauthorized
      return
    end
  
    begin
      decodedToken = JWT.decode(token, SECRET)[0]
      @authenticatedUser = User.find_by(id: decodedToken["userId"])

      unless !!@authenticatedUser
        render json: { success: false, message: "Invalid token" }, status: :unauthorized
      end
    rescue JWT::ExpiredSignature
      render json: { success: false, message: "Token expired" }, status: :unauthorized
    end
  end
end
