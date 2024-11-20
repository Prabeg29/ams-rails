Rails.application.routes.draw do
  namespace :api do
    # resources :groups
    # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  
    # Defines the root path route ("/")
    # root "articles#index"
    post "/auth/register", to: "auth#register"
    post "/auth/login", to: "auth#login"
    post "/auth/renew-access-token", to "auth#generateAccessToken"
    post "/auth/logout", to "auth#logout"
    resources :users
    resources :artists
  end
end
