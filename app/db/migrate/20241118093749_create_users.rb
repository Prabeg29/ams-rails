class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email, index: { unique: true, name: "unique_emails" }
      t.string :password, :limit => 500
      t.string :password_digest
      t.string :phone, :limit => 20
      t.datetime :dob
      t.integer :gender
      t.integer :role
      t.string :address
      t.timestamps
    end
  end
end
