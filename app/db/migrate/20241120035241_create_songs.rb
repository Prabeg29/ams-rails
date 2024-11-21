class CreateSongs < ActiveRecord::Migration[7.0]
  def change
    create_table :songs do |t|
      t.references :artist, null: false, foreign_key: true, on_delete: :cascade
      t.string :title
      t.string :album_name
      t.integer :genre
      t.timestamps
    end
  end
end
