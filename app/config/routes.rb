Rails.application.routes.draw do
  namespace :api do
    # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  
    # Defines the root path route ("/")
    # root "articles#index"
    post "/auth/register", to: "auth#register"
    post "/auth/login", to: "auth#login"
    post "/auth/renew-access-token", to: "auth#generateAccessToken"
    post "/auth/logout", to: "auth#logout"
    resources :users
    resources :artists do
      collection do
        post "csvExport"
        post "csvImport"
      end
    end
    resources :artists do
      resources :songs
    end
  end
end
