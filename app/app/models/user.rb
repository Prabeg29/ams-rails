class User < ApplicationRecord
  has_secure_password

  has_one :artist, dependent: :destroy

  enum gender: {
    other: 0,
    male: 1,
    female: 2
  }

  enum role: {
    super_admin: 0,
    artist_manager: 1,
    artist: 2
  }

  validates :first_name, :email, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: true
  validates :password, length: { minimum: 6 }, on: :create
  validates :phone, length: { maximum: 20 }, allow_nil: true
  validates :gender, inclusion: { in: genders.keys, message: "must be one of: #{genders.keys.join(", ")}" }, allow_nil: false
  validates :role, inclusion: { in: roles.keys.reject { |role| role == "super_admin" }, message: "must be one of: #{roles.keys.reject { |role| role == "super_admin" }.join(", ")}" }, allow_nil: false

  PERMISSIONS = {
    "super_admin": {
      "user": [:create, :read, :update, :delete],
      "artist": [:read],
      "song": [:read]
    },
    "artist_manager": {
      "artist": [:create, :read, :update, :delete, :csv_import, :csv_export],
      "song": [:read]
    },
    "artist": {
      "song": [:create, :read, :update, :delete]
    }
  }.freeze

  def hasPermission?(resource, action)
    permissions = PERMISSIONS[role.to_sym]
    return false unless permissions

    allowedActions = permissions[resource.to_sym]
    allowedActions&.include?(action) || false
  end

  def as_json(options = {})
    super(options.merge({ except: [:password, :password_digest, :created_at, :updated_at] }))
  end
end
