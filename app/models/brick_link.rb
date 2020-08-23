class BrickLink
  SEARCH_PRODUCT_URL = "https://www.bricklink.com/ajax/clone/search/searchproduct.ajax"

  SEARCH_PRODUCT_PARAMS = {
    q: nil,
    st: '0',
    cond: '',
    type: 'P',
    cat: '',
    yf: '0',
    yt: '0',
    loc: '',
    reg: '0',
    ca: '0',
    ss: '',
    pmt: '',
    nmp: '0',
    color: '-1',
    min: '0',
    max: '0',
    minqty: '0',
    nosuperlot: '1',
    incomplete: '0',
    showempty: '1',
    rpp: '25',
    pi: '1',
    ci: '0',
  }.freeze

  SEARCH_STORE_URL = "https://store.bricklink.com/ajax/clone/catalogifs.ajax"

  SEARCH_STORE_PARAMS = {
    itemid: nil,
    color: nil,
    ss: "US",
    loc: "US",
    minqty: nil,
    iconly: 0,
    rpp: 50,
  }.freeze

  IMAGE_URL = "https://img.bricklink.com/ItemImage/PN/%d/%d.png"

  def self.search_items(q:, color:)
    results = JSON.parse(HTTP.get(SEARCH_PRODUCT_URL, params: SEARCH_PRODUCT_PARAMS.merge(q: q, color: color)).to_s).dig("result", "typeList")
    results&.any? ? results.first.fetch("items", []) : []
  end

  def self.search_products_in_store(item_id:, color:, min_quantity: 50)
    JSON.parse(HTTP.get(SEARCH_STORE_URL, params: SEARCH_STORE_PARAMS.merge(itemid: item_id, color: color, minqty: min_quantity)).to_s).fetch("list", [])
  end
end
