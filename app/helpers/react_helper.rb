module ReactHelper
  def data_to_react(id, object)
    content_tag(:script, id: "#{id}-data", type: "application/json") do
      object.to_json.html_safe
    end
  end
end
