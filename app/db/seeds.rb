user = User.create(first_name: "John", last_name: "Doe", email: "admin@cloco.net", password: "Test123$", gender: 1, role: 0)
if user.errors.any?
  puts "Error: #{user.errors.full_messages.join(", ")}"
else
  puts "User created successfully!"
end
