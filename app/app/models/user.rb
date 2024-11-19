class User < ApplicationRecord
  has_secure_password

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

  validates :first_name, :last_name, :email, :password, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: true
  validates :password, length: { minimum: 6 }
  validates :phone, length: { maximum: 20 }, allow_nil: true
  validates :gender, inclusion: { in: genders.keys, message: "must be one of: #{genders.keys.join(', ')}" }, allow_nil: false
  validates :role, inclusion: { in: roles.keys, message: "must be one of: #{roles.keys.join(', ')}" }, allow_nil: false
end