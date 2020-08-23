module Import
  class Part < ActiveWorksheet::Base
    self.source = Rails.root.join("db/parts.csv")
  end
end
