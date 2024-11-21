class Song < ApplicationRecord
  belongs_to :artist, dependent: :destroy

  enum genre: {
    rnb: 0,
    country: 1,
    classic: 2,
    rock: 3,
    jazz: 4,
  }

  validates :title, :album_name, :genre, presence: true
  validates :genre, inclusion: { in: genres.keys, message: "must be one of: #{genres.keys.join(", ")}" }, allow_nil: false
end
