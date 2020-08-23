class ActiveWorksheet::Base
  def self.where(conditions)
    results = all

    conditions.each do |name, value|
      results = results.select { |item| item.send(name) == value }
    end

    results
  end

  def as_json(options = nil)
    to_h.as_json(options)
  end
end
