class CreateParts < ActiveRecord::Migration[6.0]
  def change
    create_table :parts do |t|
      t.references :category, null: false, foreign_key: true
      t.string :name
      t.string :number
      t.decimal :weight, precision: 6, scale: 2

      t.timestamps
    end
  end
end
