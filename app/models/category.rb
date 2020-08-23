class Category < ApplicationRecord
  def self.popular
    query = where("name LIKE ?", "Plate%")
    query = query.or(where("name LIKE ?", "Brick%"))
    query = query.or(where("name LIKE ?", "Slope%"))
    query = query.or(where("name LIKE ?", "Tile%"))
    query = query.or(where("name LIKE ?", "Bracket%"))
    query = query.or(where("name LIKE ?", "Minifigure%"))
    query = query.or(where("name LIKE ?", "Baseplate%"))
    query = query.or(where("name LIKE ?", "Plant%"))
    query = query.or(where("name LIKE ?", "Support%"))
    query = query.or(where("name LIKE ?", "Wheel%"))
    query = query.or(where("name LIKE ?", "Tire%"))
    query = query.or(where("name LIKE ?", "Train%"))

    query
  end
end
