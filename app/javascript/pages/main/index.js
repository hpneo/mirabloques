import React, { useState, useEffect } from "react";
import Select from "react-select";
import useDOMState from "hooks/useDOMState";
import classNames from "helpers/classNames";
import PlusIcon from "images/plus.svg";
import RemoveIcon from "images/remove.svg";
import SearchIcon from "images/search.svg";
import LoaderIcon from "images/loader.svg";
import layoutStyles from "styles/layout";
import tableStyles from "styles/table";
import formStyles from "styles/form";
import buttonStyles from "styles/button";
import styles from "./styles";

const csrfTag = document.querySelector("meta[name=csrf-token]");
const SHIPPING_PER_G = 0.02010618;
const MINIMUM_SHIPPING = 3.99;

function NumericInput(props) {
  const [value, setValue] = useState(props.value);

  function onChange(event) {
    const newValue = Number(event.target.value);
    setValue(newValue);
    props.onChange && props.onChange(newValue);
  }

  function onKeyUp(event) {
    if (event.keyCode === 13) {
      props.onPressEnter && props.onPressEnter();
    }
  }

  return (
    <input
      type="number"
      value={value}
      className={formStyles.input}
      onChange={onChange}
      onKeyUp={onKeyUp}
    />
  );
}

function SearchBar({ setAddedParts }) {
  const { colors, categories } = useDOMState("root");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedMinimumQuantity, setSelectedMinimumQuantity] = useState(0);
  const [parts, setParts] = useState([]);
  const [isAddingPart, setIsAddingPart] = useState(false);

  useEffect(() => {
    if (selectedCategory?.value) {
      loadParts(selectedCategory.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory?.value]);

  async function loadParts(categoryId) {
    const response = await fetch(`/parts?category_id=${categoryId}`);
    const parts = await response.json();
    setParts(parts);
  }

  async function addToList() {
    setIsAddingPart(true);
    const response = await fetch(
      `/items?number=${selectedPart.value}&color=${selectedColor.value}`
    );
    const items = await response.json();
    const item = items[0];

    if (item) {
      const newPart = {
        itemId: item.idItem,
        part: selectedPart.object,
        color: selectedColor.object,
        minimumQuantity: selectedMinimumQuantity,
      };
      setAddedParts((previousValue) => [...previousValue, newPart]);
    }

    setIsAddingPart(false);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addToList();
      }}
      className={classNames(
        layoutStyles.flex,
        layoutStyles.distributedBetween,
        layoutStyles.alignedCenter,
        styles.nav
      )}
    >
      <Select
        value={selectedColor}
        placeholder="Select a color..."
        isSearchable
        onChange={setSelectedColor}
        options={colors.map((color) => ({
          value: color.bl_id,
          label: color.name,
          object: color,
        }))}
      />
      <Select
        value={selectedCategory}
        placeholder="Select a category..."
        isSearchable
        onChange={setSelectedCategory}
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
          object: category,
        }))}
      />
      <Select
        value={selectedPart}
        placeholder="Select a part..."
        isSearchable
        onChange={setSelectedPart}
        options={parts.map((part) => ({
          value: part.number,
          label: part.name,
          object: part,
        }))}
        isDisabled={parts.length === 0}
      />
      <input
        type="number"
        className={formStyles.input}
        size="3"
        min="0"
        value={selectedMinimumQuantity}
        onChange={(event) =>
          setSelectedMinimumQuantity(Number(event.target.value))
        }
      />
      <button
        type="submit"
        className={classNames(buttonStyles.button, buttonStyles.ghost)}
        disabled={!selectedPart || !selectedColor}
      >
        {isAddingPart ? (
          <LoaderIcon width="16" height="16" className="spinning" />
        ) : (
          <PlusIcon width="16" height="16" />
        )}
      </button>
    </form>
  );
}

export default function App() {
  const [addedParts, setAddedParts] = useState([]);
  const [eligibleStores, setEligibleStores] = useState([]);
  const [isLoadingSearchInStores, setIsLoadingSearchInStores] = useState(false);

  function updateItemInList(itemIndex, newValue) {
    setAddedParts((previousValue) =>
      previousValue.map((item, index) => {
        if (index === itemIndex) {
          return {
            ...item,
            ...newValue,
          };
        }

        return item;
      })
    );
  }

  function removeFromList(itemId, color) {
    setAddedParts((previousValue) =>
      previousValue.filter(
        (item) => !(item.itemId === itemId && item.color.name === color)
      )
    );
  }

  async function searchInStores() {
    setIsLoadingSearchInStores(true);
    const body = {
      items: addedParts.map((addedPart) => ({
        item_id: addedPart.itemId,
        color: addedPart.color.bl_id,
        minimum_quantity: addedPart.minimumQuantity,
      })),
    };
    const response = await fetch("/in_store", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfTag?.content,
      },
    });
    const stores = await response.json();

    stores.forEach((store) => {
      store.items = store.items.map((item) => {
        const addedPart = addedParts.find(
          (addedPart) =>
            addedPart.itemId == item.item_id &&
            addedPart.color.bl_id == item.color
        );

        return {
          ...item,
          ...addedPart,
        };
      });
    });

    setEligibleStores(stores);
    setIsLoadingSearchInStores(false);
  }

  return (
    <>
      <SearchBar setAddedParts={setAddedParts} />
      <section className={styles.tableWrapper}>
        <table className={classNames(tableStyles.table, tableStyles.full)}>
          <thead>
            <tr>
              <th width="20%"></th>
              <th width="20%">Color</th>
              <th>Part</th>
              <th width="5%">Quantity</th>
              <th width="5%"></th>
            </tr>
          </thead>
          <tbody>
            {addedParts.map((addedPart, index) => (
              <tr key={`${addedPart.itemId}.${addedPart.color.name}`}>
                <td>
                  <img
                    src={`https://img.bricklink.com/ItemImage/PN/${addedPart.color.bl_id}/${addedPart.part.number}.png`}
                    height="64"
                  />
                </td>
                <td>{addedPart.color.name}</td>
                <td>{addedPart.part.name}</td>
                <td>
                  <NumericInput
                    value={addedPart.minimumQuantity}
                    onChange={(newValue) =>
                      updateItemInList(index, {
                        minimumQuantity: newValue,
                      })
                    }
                    onPressEnter={searchInStores}
                  />
                </td>
                <td align="center">
                  <button
                    type="button"
                    className={classNames(
                      buttonStyles.button,
                      buttonStyles.ghost
                    )}
                    onClick={() =>
                      removeFromList(addedPart.itemId, addedPart.color.name)
                    }
                  >
                    <RemoveIcon width="16" height="16" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <nav
        className={classNames(
          layoutStyles.flex,
          layoutStyles.distributedBetween,
          layoutStyles.alignedCenter,
          styles.nav
        )}
      >
        <button
          type="button"
          className={classNames(
            buttonStyles.button,
            buttonStyles.primary,
            styles.searchButton
          )}
          onClick={searchInStores}
          disabled={addedParts.length === 0}
        >
          {isLoadingSearchInStores ? (
            <LoaderIcon width="16" height="16" className="spinning" />
          ) : (
            <SearchIcon width="16" height="16" />
          )}
        </button>
      </nav>
      <section className={styles.tableWrapper}>
        <table className={classNames(tableStyles.table, tableStyles.full)}>
          <thead>
            <tr>
              <th width="20%" rowSpan="2">
                Store
              </th>
              <th colSpan="6">Parts included</th>
            </tr>
            <tr>
              <th>Item</th>
              <th>Unit Price</th>
              <th>Unit Weight</th>
              <th>Quantity</th>
              <th>Item Total + Shipping</th>
              <th>Total Weight</th>
            </tr>
          </thead>
          <tbody>
            {eligibleStores.flatMap((eligibleStore) => {
              const totals = {
                price: 0,
                weight: 0,
              };

              return [
                ...eligibleStore.items.map((item, index) => {
                  const quantity = Math.min(
                    item.quantity,
                    item.minimum_quantity
                  );
                  const price = item.price * quantity;
                  const weight = Number(item.part.weight) * quantity;

                  totals.price += price;
                  totals.weight += weight;

                  return (
                    <tr
                      key={`${eligibleStore.url}.${item.inventory_id}`}
                      className={index === 0 ? styles.rowSeparator : null}
                    >
                      {index === 0 ? (
                        <td rowSpan={eligibleStore.items.length + 1}>
                          <a target="_blank" href={eligibleStore.url}>
                            {eligibleStore.name}{" "}
                            {eligibleStore.instant_checkout ? "⚡️" : null}
                          </a>
                        </td>
                      ) : null}
                      <td>
                        <a
                          target="_blank"
                          href={`${eligibleStore.url}?itemID=${item.inventory_id}`}
                        >
                          {item.color.name} {item.part.name} (
                          {item.is_new ? "New" : "Used"})
                        </a>
                        {item.description ? (
                          <p className={styles.itemDescription}>
                            <small>{item.description}</small>
                          </p>
                        ) : null}
                      </td>
                      <td>US$ {item.price}</td>
                      <td>{item.part.weight} g</td>
                      <td>{quantity}</td>
                      <td>US$ {price.toFixed(2)}</td>
                      <td>{weight.toFixed(2)} g</td>
                    </tr>
                  );
                }),
                <tr
                  key={`${eligibleStore.url}.total`}
                  className={styles.totalByStore}
                >
                  <th colSpan="4">Total</th>
                  <th>
                    US$ {totals.price.toFixed(2)} + US${" "}
                    {(totals.weight * SHIPPING_PER_G).toFixed(2)}
                  </th>
                  <th>{totals.weight.toFixed(2)} g</th>
                </tr>,
              ];
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}
