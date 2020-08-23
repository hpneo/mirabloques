class CreateColors < ActiveRecord::Migration[6.0]
  def change
    create_table :colors do |t|
      t.integer :bl_id
      t.string :name
      t.string :rgb

      t.timestamps
    end
  end
end
