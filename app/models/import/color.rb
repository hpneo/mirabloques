module Import
  class Color < ActiveWorksheet::Base
    self.source = Rails.root.join("db/colors.txt")
  end
end
