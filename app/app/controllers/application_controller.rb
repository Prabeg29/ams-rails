class ApplicationController < ActionController::API
  include ActionController::Cookies
  include PaginationHelper

  SECRET = "super-secret-la"

  before_action :authenticate
  before_action :authorize, only: [:index, :create, :show, :update, :destroy, :csvExport, :csvImport]

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

  def authorize
    resource = controller_name.singularize
    action = action_name.to_s

    actionMap = {
      "index"     => :read,
      "show"      => :read,
      "create"    => :create,
      "update"    => :update,
      "destroy"   => :delete,
      "csvImport" => :csv_import,
      "csvExport" => :csv_export,
    }

    unless @authenticatedUser.hasPermission?(resource, actionMap[action])
      render json: { success: false, error: "Unauthorized to perform this action" }, status: :forbidden
      return
    end
  end
end
