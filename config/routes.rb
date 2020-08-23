Rails.application.routes.draw do
  get "/parts", to: "site#parts"
  get "/items", to: "site#items"
  post "/in_store", to: "site#in_store"
  root to: "site#index"
end
