module Import
  class Category < ActiveWorksheet::Base
    self.source = Rails.root.join("db/categories.txt")

    def self.popular
      all.select do |category|
        category.category_name.to_s.match(/plate|brick|slope|tile|minifigure/i)
      end
    end
  end
end
