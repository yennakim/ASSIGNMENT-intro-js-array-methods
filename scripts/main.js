import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";

// Reusable function to get the cards on the DOM
// .forEach()
const renderCards = (array) => {
  let refStuff = "";

  array.forEach((item) => {
    refStuff += card(item);
  });

  renderToDom("#cards", refStuff);
};

// UPDATE/ADD ITEMS TO CART
// .findIndex() & (.includes() - string method)
const toggleCart = (event) => {
  if (event.target.id.includes("fav-btn")) {
    // .split turns a string into an array of values
    // "--"" separate the id from the number id
    //fav-btn--idNumber --> ['fav-btn', 'idNumber']

    // Destructured form (line item 27) shows we are only using the second item (id)
    const [, id] = event.target.id.split("--");

    // We don't know where the object shows up in the array (unknown order) so we use .findIndex to find where it is in the array to update the element
    //id from button is a string, id from our object is an integer so we must convert the string to a number

    // The value of index is referenceList. I am finding the index on the attribute where the id is equal to a number which was converted from a string
    const index = referenceList.findIndex((item) => item.id === Number(id));
    // We want to change the value of whether or not it is in cart from true to false.
    // referenceList[index].inCart
    // index is passed to get the index that we need which returns the object
    // Use ! below to reassign/toggle
    referenceList[index].inCart = !referenceList[index].inCart;

    // Updates cart total
    cartTotal();
    renderCards(referenceList);
  }
};

// SEARCH

// NOTES
// .filter()
// (event) is a callback from line 118
// search function is being called which automatically gets access to the event.
// I want to use the event to capture the input the user is typing into the text field

const search = (event) => {
  // value is an attribute inside of target
  const userInput = event.target.value.toLowerCase();
  // searchResult filter is looking at our referenceList, pulling in each item and saying "hey if the title.toLowerCase() includes whatever the user input is, put this object into the array the filter is going to return "
  const searchResult = referenceList.filter(
    (item) =>
      item.title.toLowerCase().includes(userInput) ||
      item.author.toLowerCase().includes(userInput) ||
      item.description.toLowerCase().includes(userInput)
  );
  renderCards(searchResult);
};

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining
const buttonFilter = (event) => {
  if (event.target.id.includes("free")) {
    // Look at referenceList and any item where the price <= 0 and return in a new array
    // reuse renderCards(array) to render any card where price <= 0
    const free = referenceList.filter((item) => item.price <= 0);
    renderCards(free);
  }
  if (event.target.id.includes("cartFilter")) {
    const wishList = referenceList.filter((item) => item.inCart);
    renderCards(wishList);
  }
  if (event.target.id.includes("books")) {
    const books = referenceList.filter(
      //Using .toLowerCase(0 accounts for when data is incorrect(book type is capitalized; "Book")
      (item) => item.type.toLowerCase() === "book"
    );
    renderCards(books);
  }
  if (event.target.id.includes("clearFilter")) {
    renderCards(referenceList);
  }
  if (event.target.id.includes("productList")) {
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;

    productList()
      // .localeCompare will compares regardless of uppercase/lowercase
      .sort((a, b) => a.type.localeCompare(b.type))
      .forEach((item) => {
        table += tableRow(item);
      });

    table += `</tbody></table>`;

    renderToDom("#cards", table);
  }
};

// CALCULATE CART TOTAL
// .reduce() & .some()
// We want the previous value to add to the currentValue
// Every time it goes through the loop, the previousValue changes
// Initial value of 0, and iterates through each item to total up

// We did a function that does the cart total
// Looked at referenceList and filters over to only give the items in the cart
// Take the cart and use .reduce to
// Query selecting cart total and changing the innerHTML from 0 to be whatever we get back from total.toFixed
const cartTotal = () => {
  const cart = referenceList.filter((item) => item.inCart);
  const total = cart.reduce((value1, value2) => value1 + value2.price, 0);
  const free = cart.some((taco) => taco.price <= 0);
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

  if (free) {
    document.querySelector("#includes-free").innerHTML = "INCLUDES FREE ITEMS";
  } else {
    document.querySelector("#includes-free").innerHTML = "";
  }
};

// RESHAPE DATA TO RENDER TO DOM
// .map()

// NOTES

// productList is going to take in/look for the referenceList and map over all of the items inside of referenceList and return a new object that I created/determined to be the new key value pairs
//Out of this item/object, I want you to make the value -> item.title, item.price, item.type
// .map returns a new array, but in this case it will return an array of objects
const productList = () => {
  return referenceList.map((item) => ({
    title: item.title,
    price: item.price,
    type: item.type,
  }));
};

const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList);

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector("#cards").addEventListener("click", toggleCart);

  // SELECT THE SEARCH INPUT
  document.querySelector("#searchInput").addEventListener("keyup", search);

  // SELECT BUTTON ROW DIV
  document.querySelector("#btnRow").addEventListener("click", buttonFilter);
};
startApp();
