Import::Category.all.each do |category|
  Category.create(bl_id: category.category_id, name: category.category_name)
end

Import::Color.all.each do |color|
  Color.create(bl_id: color.color_id, name: color.color_name, rgb: color.rgb)
end

Import::Part.all.each do |part|
  category = Category.find_by(bl_id: part.category_id)
  Part.create(category_id: category.id, name: part.name, number: part.number, weight: part.weight_in_grams)
end
