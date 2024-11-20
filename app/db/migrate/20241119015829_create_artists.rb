class CreateArtists < ActiveRecord::Migration[7.0]
  def change
    create_table :artists do |t|
      t.references :user, null: false, foreign_key: true, on_delete: :cascade
      t.integer :first_release_year, limit: 2, null: true
      t.integer :no_of_albums_released, limit: 1, null: true
      t.timestamps
    end
  end
end
