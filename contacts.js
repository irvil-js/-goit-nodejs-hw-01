const fs = require("fs");
const path = require("path");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const contactsPath = path.join(__dirname, "db", "contacts.json");
async function parsedContact() {
  try {
    const contactsFromDb = await readFile(contactsPath);
    return JSON.parse(contactsFromDb);
  } catch (error) {
    return console.log(error.message);
  }
}


async function listContacts() {
  try {
     const contacts = await parsedContact();

    console.table(contacts);
    return contacts;
  } catch (error) {
    console.log("ERROR",error.message);
  }
}

async function getContactById(contactId) {
  try {
   const contacts = await parsedContact();
    const contact = contacts.find(
      (contact) => contact.id === Number(contactId)
    );

      if (!contact) {
          throw new Error(`Пользователь с id ${contactId} не найден`);
      }
    console.log(contact);
    return contact;
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await parsedContact();
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== Number(contactId)
    );
      if (contacts.length === filteredContacts.length)
      throw new Error(`Пользователь с id ${contactId} не найден`);


    await writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2), error => {
     if (error) {
        console.log(error.message);
        return;
      }
    });
    console.log(`Контакт с id ${contactId} удален!`);
      console.table(filteredContacts);
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
   const contacts = await parsedContact();
    const id = contacts[contacts.length - 1].id + 1;
    const newContact = { id, name, email, phone };
    const updatedContacts = [...contacts, newContact];

    await writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2), error => {
      if (error) {
        console.log(error);
        return;
      }
    });
      console.table(updatedContacts);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};