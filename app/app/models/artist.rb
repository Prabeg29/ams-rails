class Artist < ApplicationRecord
  belongs_to :user, dependent: :destroy

  validates :user_id, presence: true
  validates :first_release_year, numericality: { only_integer: true, allow_nil: true }
  validates :no_of_albums_released, numericality: { only_integer: true, allow_nil: true }
end
