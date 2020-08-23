class Category < ApplicationRecord
  def self.popular
    query = where("name LIKE ?", "Plate%")
    query = query.or(where("name LIKE ?", "Brick%"))
    query = query.or(where("name LIKE ?", "Slope%"))
    query = query.or(where("name LIKE ?", "Tile%"))
    query = query.or(where("name LIKE ?", "Bracket%"))
    query = query.or(where("name LIKE ?", "Minifigure%"))

    query
  end
end
