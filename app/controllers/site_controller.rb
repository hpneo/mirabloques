class SiteController < ApplicationController
  def index
  end

  def parts
    parts = Part.where(category_id: params[:category_id].to_i).order(name: :asc)

    render json: parts
  end

  def items
    items = BrickLink.search_items(q: params[:number], color: params[:color])

    render json: items
  end

  def in_store
    stores = {}

    params[:items].each do |item|
      items_in_stores = BrickLink.search_products_in_store(item_id: item[:item_id], color: item[:color], min_quantity: item[:minimum_quantity])

      items_in_stores.each do |item_in_store|
        stores[item_in_store["strSellerUsername"]] ||= {
          name: item_in_store["strStorename"],
          instant_checkout: item_in_store["instantCheckout"],
          url: "https://store.bricklink.com/#{item_in_store["strSellerUsername"]}",
          items: [],
        }

        unless stores[item_in_store["strSellerUsername"]][:items].any? { |item_in_collection| item_in_collection[:item_id] == item[:item_id] && item_in_collection[:color] == item[:color] }
          stores[item_in_store["strSellerUsername"]][:items] << item.merge(
            inventory_id: item_in_store["idInv"],
            quantity: item_in_store["n4Qty"],
            description: item_in_store["strDesc"],
            price: item_in_store["mDisplaySalePrice"].split("US $").last.to_f,
            is_new: item_in_store["codeNew"] == "N"
          )
        end
      end
    end

    render json: stores.select { |_store_name, store| store[:items].size == params[:items].size }.values
  end
end
